from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

from sqlmodel import Session, select

from artflow.config import ArtflowSettings
from artflow.exporter import plan_website_export
from artflow.models import ImageAsset


def manifest_report(session: Session, settings: ArtflowSettings) -> dict:
    assets = session.exec(select(ImageAsset)).all()
    roles = Counter(asset.image_role or "unclassified" for asset in assets)
    approvals = Counter(asset.approval_state for asset in assets)
    return {
        "manifest": str(settings.database_path),
        "source": str(settings.source_path) if settings.source_path else None,
        "total_images": len(assets),
        "duplicates": sum(asset.duplicate_of_id is not None for asset in assets),
        "technically_analysed": sum(asset.technical_scores_json is not None for asset in assets),
        "classified": sum(asset.ai_assessment_json is not None for asset in assets),
        "processed": sum(asset.processing_output_path is not None for asset in assets),
        "roles": dict(sorted(roles.items())),
        "approvals": dict(sorted(approvals.items())),
        "website_dry_run": plan_website_export(session, settings).to_dict(),
    }


def write_report(report: dict, output: Path | None = None) -> str:
    rendered = json.dumps(report, indent=2, sort_keys=True)
    if output:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered + "\n", encoding="utf-8")
    return rendered
