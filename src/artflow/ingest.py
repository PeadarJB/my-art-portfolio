from __future__ import annotations

import hashlib
import json
import re
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import imagehash
from PIL import ExifTags, Image, ImageOps
from sqlmodel import Session, select

from artflow.config import ArtflowSettings
from artflow.models import ImageAsset, utcnow


class SourceConfigurationError(RuntimeError):
    pass


@dataclass
class IngestResult:
    discovered: int = 0
    created: int = 0
    updated: int = 0
    unchanged: int = 0
    excluded: list[str] = field(default_factory=list)
    failed: dict[str, str] = field(default_factory=dict)


def _normalise_term(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.casefold())


def should_exclude(path: Path, source_root: Path, settings: ArtflowSettings) -> bool:
    relative = path.relative_to(source_root)
    path_text = "/".join(relative.parts)
    path_key = _normalise_term(path_text)
    filename_key = _normalise_term(path.stem)
    if any(_normalise_term(term) in path_key for term in settings.exclude_path_terms):
        return True
    if filename_key in {_normalise_term(term) for term in settings.exclude_filename_stems}:
        return True
    return any(_normalise_term(term) in filename_key for term in settings.exclude_filename_terms)


def iter_source_images(source_root: Path, settings: ArtflowSettings):
    extensions = {extension.casefold() for extension in settings.image_extensions}
    for path in sorted(source_root.rglob("*"), key=lambda item: str(item).casefold()):
        if not path.is_file() or path.suffix.casefold() not in extensions:
            continue
        if should_exclude(path, source_root, settings):
            continue
        yield path


def _all_candidates(source_root: Path, settings: ArtflowSettings):
    extensions = {extension.casefold() for extension in settings.image_extensions}
    for path in sorted(source_root.rglob("*"), key=lambda item: str(item).casefold()):
        if path.is_file() and path.suffix.casefold() in extensions:
            yield path


def sha256_file(path: Path, chunk_size: int = 1024 * 1024) -> str:
    digest = hashlib.sha256()
    # Explicit binary read only. No mode in this module can modify a source.
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(chunk_size), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _json_safe(value: Any):
    if isinstance(value, bytes):
        return value.hex()
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    if isinstance(value, (list, tuple)):
        return [_json_safe(item) for item in value]
    if isinstance(value, dict):
        return {str(key): _json_safe(item) for key, item in value.items()}
    return str(value)


def read_image_metadata(path: Path) -> tuple[int, int, str | None, str]:
    with Image.open(path) as image:
        exif = image.getexif()
        exif_named = {
            ExifTags.TAGS.get(tag, str(tag)): _json_safe(value) for tag, value in exif.items()
        }
        orientation = int(exif.get(274, 1))
        width, height = image.size
        if orientation in {5, 6, 7, 8}:
            width, height = height, width
        oriented = ImageOps.exif_transpose(image).convert("RGB")
        perceptual_hash = str(imagehash.phash(oriented))
    return (
        width,
        height,
        json.dumps(exif_named, sort_keys=True) if exif_named else None,
        perceptual_hash,
    )


def _preserve_background(relative_path: Path, settings: ArtflowSettings) -> bool:
    return any(
        part.isdigit() and int(part) in settings.preserve_background_years
        for part in relative_path.parts
    )


def validate_source(settings: ArtflowSettings) -> Path:
    if settings.source_path is None:
        raise SourceConfigurationError(
            "ARTFLOW_SOURCE_PATH is not configured. Set it to the local Google Drive for "
            "Desktop folder for Backup/Peadar/edits."
        )
    source_root = settings.source_path.resolve()
    if not source_root.is_dir():
        raise SourceConfigurationError(
            f"Source folder does not exist or is not a directory: {source_root}"
        )
    for output_path in (settings.working_path, settings.approved_path):
        resolved_output = output_path.resolve()
        if resolved_output == source_root or source_root in resolved_output.parents:
            raise SourceConfigurationError(
                f"Output folder must not be inside the source: {resolved_output}"
            )
    return source_root


def ingest(session: Session, settings: ArtflowSettings) -> IngestResult:
    source_root = validate_source(settings)
    result = IngestResult()
    fingerprint = settings.fingerprint()

    for path in _all_candidates(source_root, settings):
        relative = path.relative_to(source_root)
        if should_exclude(path, source_root, settings):
            result.excluded.append(relative.as_posix())
            continue
        result.discovered += 1
        try:
            stat = path.stat()
            digest = sha256_file(path)
            width, height, exif_json, perceptual_hash = read_image_metadata(path)
            source_path = str(path.resolve())
            existing = session.exec(
                select(ImageAsset).where(ImageAsset.source_path == source_path)
            ).first()
            duplicate = session.exec(
                select(ImageAsset).where(
                    ImageAsset.sha256 == digest,
                    ImageAsset.source_path != source_path,
                )
            ).first()
            values = {
                "source_relative_path": relative.as_posix(),
                "source_filename": path.name,
                "source_size_bytes": stat.st_size,
                "source_modified_ns": stat.st_mtime_ns,
                "sha256": digest,
                "perceptual_hash": perceptual_hash,
                "duplicate_of_id": duplicate.id if duplicate else None,
                "pixel_width": width,
                "pixel_height": height,
                "exif_json": exif_json,
                "preserve_background": _preserve_background(relative, settings),
                "processing_version": settings.processing_version,
                "config_fingerprint": fingerprint,
                "updated_at": utcnow(),
            }
            if existing is None:
                session.add(ImageAsset(id=str(uuid.uuid4()), source_path=source_path, **values))
                result.created += 1
            elif existing.sha256 == digest and existing.config_fingerprint == fingerprint:
                result.unchanged += 1
            else:
                for key, value in values.items():
                    setattr(existing, key, value)
                existing.analysis_signature = None
                existing.classification_signature = None
                existing.processing_signature = None
                result.updated += 1
            session.commit()
        except Exception as error:  # continue the resumable batch and report exact failures
            session.rollback()
            result.failed[relative.as_posix()] = str(error)
    return result
