from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps
from sqlmodel import Session, select

from artflow.config import ArtflowSettings
from artflow.models import ArtworkBoundary, ImageAsset, ImageRole, utcnow
from artflow.processing.rectify import rectify_image


def _signature(asset: ImageAsset, settings: ArtflowSettings) -> str:
    payload = ":".join(
        [
            asset.sha256,
            asset.processing_recipe or "unclassified",
            asset.crop_coordinates_json or "no-crop",
            settings.processing_version,
        ]
    )
    return hashlib.sha256(payload.encode()).hexdigest()


def _normalized_corners(asset: ImageAsset) -> list[tuple[float, float]] | None:
    if not asset.crop_coordinates_json:
        return None
    boundary = ArtworkBoundary.model_validate(json.loads(asset.crop_coordinates_json))
    return [
        (point.x * (asset.pixel_width - 1), point.y * (asset.pixel_height - 1))
        for point in boundary.points
    ]


def _orientation_copy(source: Path, destination: Path) -> Path:
    if source.resolve() == destination.resolve():
        raise ValueError("Artflow never writes over an original source image")
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        icc_profile = opened.info.get("icc_profile")
        destination.parent.mkdir(parents=True, exist_ok=True)
        kwargs = {"icc_profile": icc_profile} if icc_profile else {}
        image.save(destination, format="PNG", **kwargs)
    return destination


def process_asset(asset: ImageAsset, settings: ArtflowSettings) -> Path | None:
    if not asset.processing_recipe:
        raise ValueError("image must be classified or assigned a recipe before processing")
    role = ImageRole(asset.processing_recipe)
    if role == ImageRole.REPHOTOGRAPH:
        return None
    if role in {ImageRole.ISOLATE_OBJECT, ImageRole.WHITE_CUBE_2D, ImageRole.WHITE_CUBE_OBJECT}:
        raise NotImplementedError(
            "segmentation and gallery compositing are intentionally deferred until pilot approval"
        )
    source = Path(asset.source_path)
    output = settings.working_path / asset.id / "documentation.png"
    corners = _normalized_corners(asset)
    if role == ImageRole.RECTIFY_2D and corners:
        return rectify_image(source, output, corners)
    return _orientation_copy(source, output)


def process_manifest(
    session: Session, settings: ArtflowSettings, image_id: str | None = None
) -> dict[str, int]:
    statement = select(ImageAsset)
    if image_id:
        statement = statement.where(ImageAsset.id == image_id)
    assets = session.exec(statement.order_by(ImageAsset.source_relative_path)).all()
    result = {"processed": 0, "unchanged": 0, "deferred": 0, "failed": 0}
    for asset in assets:
        signature = _signature(asset, settings)
        if (
            asset.processing_signature == signature
            and asset.processing_output_path
            and Path(asset.processing_output_path).exists()
        ):
            result["unchanged"] += 1
            continue
        try:
            output = process_asset(asset, settings)
            if output is None:
                result["deferred"] += 1
                continue
            asset.processing_output_path = str(output.resolve())
            asset.processing_signature = signature
            asset.processed_at = utcnow()
            asset.updated_at = utcnow()
            session.add(asset)
            session.commit()
            result["processed"] += 1
        except NotImplementedError:
            session.rollback()
            result["deferred"] += 1
        except Exception:
            session.rollback()
            result["failed"] += 1
    return result
