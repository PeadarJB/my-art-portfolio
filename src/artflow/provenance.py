from __future__ import annotations

import json
import os
import shutil
from pathlib import Path

from sqlmodel import Session, select

from artflow.config import ArtflowSettings
from artflow.ingest import sha256_file
from artflow.models import ApprovalState, ImageAsset, utcnow


def provenance_payload(asset: ImageAsset, output_path: Path) -> dict:
    payload = asset.model_dump(mode="json")
    payload.update(
        {
            "provenance_schema_version": "1.0",
            "output_path": str(output_path.resolve()),
            "output_sha256": sha256_file(output_path),
            "source_read_only": True,
            "artwork_pixels_generative_edit": False,
            "documentation_label": asset.documentation_label,
            "installation_visualisation": asset.installation_visualisation,
            "exported_at": utcnow().isoformat(),
        }
    )
    return payload


def _atomic_json(path: Path, payload: dict) -> None:
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(
        json.dumps(payload, indent=2, sort_keys=True, ensure_ascii=False), encoding="utf-8"
    )
    os.replace(temporary, path)


def export_approved_master(
    session: Session, asset: ImageAsset, settings: ArtflowSettings
) -> tuple[Path, bool]:
    if asset.approval_state != ApprovalState.APPROVED.value:
        raise PermissionError("only explicitly approved images can be exported")
    if not asset.processing_output_path:
        raise FileNotFoundError("approved image has no processed working output")
    source = Path(asset.processing_output_path)
    if not source.is_file():
        raise FileNotFoundError(source)

    destination_dir = settings.approved_path / "masters" / asset.id
    destination_dir.mkdir(parents=True, exist_ok=True)
    destination = (
        destination_dir / f"{Path(asset.source_filename).stem}-approved{source.suffix.lower()}"
    )
    changed = not destination.exists() or sha256_file(destination) != sha256_file(source)
    if changed:
        temporary = destination.with_suffix(destination.suffix + ".tmp")
        shutil.copy2(source, temporary)
        os.replace(temporary, destination)

    sidecar = destination.with_suffix(destination.suffix + ".provenance.json")
    _atomic_json(sidecar, provenance_payload(asset, destination))
    asset.approved_master_path = str(destination.resolve())
    asset.updated_at = utcnow()
    session.add(asset)
    session.commit()
    return destination, changed


def export_all_approved(session: Session, settings: ArtflowSettings) -> dict[str, int]:
    assets = session.exec(
        select(ImageAsset).where(ImageAsset.approval_state == ApprovalState.APPROVED.value)
    ).all()
    result = {"exported": 0, "unchanged": 0, "failed": 0}
    for asset in assets:
        try:
            _, changed = export_approved_master(session, asset, settings)
            result["exported" if changed else "unchanged"] += 1
        except Exception:
            session.rollback()
            result["failed"] += 1
    return result
