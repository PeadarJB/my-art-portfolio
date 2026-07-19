from __future__ import annotations

import hashlib
import io
import json
import os
from dataclasses import asdict, dataclass, field
from pathlib import Path

from PIL import Image, ImageOps
from sqlmodel import Session, select

from artflow.config import ArtflowSettings
from artflow.models import ApprovalState, ImageAsset, utcnow


@dataclass
class VariantAction:
    asset_id: str
    variant: str
    destination: str
    status: str
    reason: str | None = None


@dataclass
class WebsiteExportPlan:
    actions: list[VariantAction] = field(default_factory=list)
    blockers: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "actions": [asdict(action) for action in self.actions],
            "blockers": self.blockers,
            "warnings": self.warnings,
            "summary": {
                status: sum(action.status == status for action in self.actions)
                for status in ("create", "replace", "unchanged", "blocked")
            },
        }


def _variant_bytes(master: Path, width: int, quality: int) -> bytes:
    with Image.open(master) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        if image.width > width:
            height = max(1, round(image.height * width / image.width))
            image = image.resize((width, height), Image.Resampling.LANCZOS)
        buffer = io.BytesIO()
        image.save(
            buffer,
            format="WEBP",
            quality=quality,
            method=6,
            exact=True,
        )
    return buffer.getvalue()


def _digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _website_destination(asset: ImageAsset, variant: str, settings: ArtflowSettings) -> Path:
    return (
        settings.website_root
        / "public"
        / "images"
        / str(asset.verified_year)
        / f"{asset.website_basename}-{variant}.webp"
    )


def plan_website_export(
    session: Session, settings: ArtflowSettings, allow_replace: bool = False
) -> WebsiteExportPlan:
    plan = WebsiteExportPlan()
    assets = session.exec(select(ImageAsset).order_by(ImageAsset.source_relative_path)).all()
    approved = [asset for asset in assets if asset.approval_state == ApprovalState.APPROVED.value]
    if not approved:
        plan.warnings.append("No approved images are eligible for website export.")

    for asset in approved:
        missing = []
        if not asset.approved_master_path or not Path(asset.approved_master_path).is_file():
            missing.append("approved master")
        if asset.verified_year is None:
            missing.append("verified year")
        if not asset.website_basename:
            missing.append("reviewer-entered website basename")
        if not asset.website_alt_text:
            missing.append("reviewer-entered alt text")
        if missing:
            plan.blockers.append(f"{asset.id}: missing {', '.join(missing)}")
            continue

        master = Path(asset.approved_master_path)
        for variant in ("small", "medium", "large"):
            destination = _website_destination(asset, variant, settings)
            data = _variant_bytes(
                master, settings.variant_widths[variant], settings.variant_qualities[variant]
            )
            if not destination.exists():
                status, reason = "create", None
            elif _digest(destination.read_bytes()) == _digest(data):
                status, reason = "unchanged", "existing bytes match deterministic output"
            elif allow_replace:
                status, reason = "replace", "explicit replacement flag supplied"
            else:
                status, reason = "blocked", "existing unrelated or different file would be replaced"
                plan.blockers.append(f"{asset.id}: replacement blocked for {destination}")
            plan.actions.append(
                VariantAction(asset.id, variant, str(destination.resolve()), status, reason)
            )
    plan.warnings.append(
        "Artwork content files are not edited automatically; review the reported image paths and "
        "update the existing Zod-validated content entry separately."
    )
    return plan


def apply_website_export(
    session: Session, settings: ArtflowSettings, allow_replace: bool = False
) -> WebsiteExportPlan:
    plan = plan_website_export(session, settings, allow_replace=allow_replace)
    if plan.blockers:
        raise PermissionError("website export has blockers; inspect the dry-run report first")

    assets = {
        asset.id: asset
        for asset in session.exec(select(ImageAsset)).all()
        if asset.approval_state == ApprovalState.APPROVED.value
    }
    paths_by_asset: dict[str, dict[str, str]] = {}
    for action in plan.actions:
        if action.status == "unchanged":
            paths_by_asset.setdefault(action.asset_id, {})[action.variant] = action.destination
            continue
        asset = assets[action.asset_id]
        data = _variant_bytes(
            Path(asset.approved_master_path),
            settings.variant_widths[action.variant],
            settings.variant_qualities[action.variant],
        )
        destination = Path(action.destination)
        destination.parent.mkdir(parents=True, exist_ok=True)
        temporary = destination.with_suffix(destination.suffix + ".tmp")
        temporary.write_bytes(data)
        os.replace(temporary, destination)
        paths_by_asset.setdefault(action.asset_id, {})[action.variant] = action.destination

    for asset_id, paths in paths_by_asset.items():
        asset = assets[asset_id]
        asset.website_output_paths_json = json.dumps(paths, sort_keys=True)
        asset.updated_at = utcnow()
        session.add(asset)
    session.commit()
    return plan
