from __future__ import annotations

import hashlib
from pathlib import Path

from sqlmodel import Session, select

from artflow.ai.base import ClassificationProvider
from artflow.ai.gemini_provider import GeminiProvider
from artflow.ai.openai_provider import OpenAIProvider
from artflow.ai.rules import RulesProvider
from artflow.analysis import technical_scores
from artflow.config import ArtflowSettings
from artflow.models import ImageAsset, utcnow


def get_provider(
    settings: ArtflowSettings, provider_name: str | None = None
) -> ClassificationProvider:
    name = provider_name or settings.ai_provider
    if name == "rules":
        return RulesProvider()
    if name == "openai":
        key = settings.openai_api_key.get_secret_value() if settings.openai_api_key else ""
        return OpenAIProvider(key, settings.openai_model or "")
    if name == "gemini":
        key = settings.gemini_api_key.get_secret_value() if settings.gemini_api_key else ""
        return GeminiProvider(key, settings.gemini_model or "")
    raise ValueError(f"Unknown AI provider: {name}")


def _signature(
    asset: ImageAsset, settings: ArtflowSettings, provider: ClassificationProvider
) -> str:
    payload = ":".join(
        [
            asset.sha256,
            asset.analysis_signature or "not-analysed",
            settings.prompt_version,
            provider.name,
            provider.model_name,
        ]
    )
    return hashlib.sha256(payload.encode()).hexdigest()


def classify_manifest(
    session: Session,
    settings: ArtflowSettings,
    image_id: str | None = None,
    provider_name: str | None = None,
) -> dict[str, int]:
    provider = get_provider(settings, provider_name)
    prompt = Path(settings.prompt_path).read_text(encoding="utf-8")
    statement = select(ImageAsset)
    if image_id:
        statement = statement.where(ImageAsset.id == image_id)
    assets = session.exec(statement.order_by(ImageAsset.source_relative_path)).all()
    result = {"classified": 0, "unchanged": 0, "failed": 0}

    for asset in assets:
        signature = _signature(asset, settings, provider)
        if asset.classification_signature == signature and asset.ai_assessment_json:
            result["unchanged"] += 1
            continue
        try:
            assessment = provider.classify(
                Path(asset.source_path), asset, technical_scores(asset), prompt
            )
            asset.ai_assessment_json = assessment.model_dump_json()
            asset.ai_confidence = assessment.confidence
            asset.image_role = assessment.role.value
            asset.processing_recipe = assessment.role.value
            asset.preserve_background = assessment.preserve_background
            asset.crop_coordinates_json = (
                assessment.boundary.model_dump_json() if assessment.boundary else None
            )
            asset.gallery_template_id = assessment.gallery_template_id
            asset.installation_visualisation = assessment.installation_visualisation
            asset.documentation_label = (
                "installation_visualisation"
                if assessment.installation_visualisation
                else "artwork_documentation"
            )
            asset.ai_provider = provider.name
            asset.ai_model = provider.model_name
            asset.prompt_version = settings.prompt_version
            asset.classification_signature = signature
            asset.updated_at = utcnow()
            session.add(asset)
            session.commit()
            result["classified"] += 1
        except Exception:
            session.rollback()
            result["failed"] += 1
    return result
