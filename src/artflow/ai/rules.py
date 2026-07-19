from __future__ import annotations

from pathlib import Path

from artflow.ai.base import ClassificationProvider
from artflow.models import AIClassification, ImageAsset, ImageRole, TechnicalScores


class RulesProvider(ClassificationProvider):
    """Safe, explicitly low-confidence fallback when no vision provider is configured."""

    name = "rules"
    model_name = "deterministic-rules-v1"

    def classify(
        self,
        image_path: Path,
        asset: ImageAsset,
        technical: TechnicalScores | None,
        prompt: str,
    ) -> AIClassification:
        del image_path, prompt
        if technical and technical.recommend_rephotograph:
            return AIClassification(
                role=ImageRole.REPHOTOGRAPH,
                confidence=0.8,
                preserve_background=asset.preserve_background,
                rationale="Deterministic technical thresholds require human review before editing.",
                warnings=technical.warnings,
                rephotograph_reasons=technical.warnings,
                installation_visualisation=False,
            )
        if asset.preserve_background:
            return AIClassification(
                role=ImageRole.CONTEXT_LIGHT_CLEANUP,
                confidence=0.55,
                preserve_background=True,
                rationale=(
                    "The source is in a configured contextual year; surroundings are preserved."
                ),
                warnings=[
                    "Rules fallback cannot visually confirm whether the setting is intentional."
                ],
                installation_visualisation=False,
            )
        return AIClassification(
            role=ImageRole.RECTIFY_2D,
            confidence=0.25,
            preserve_background=False,
            rationale="Low-confidence holding recipe pending visual AI or reviewer classification.",
            warnings=["Rules fallback did not inspect image semantics or detect a boundary."],
            installation_visualisation=False,
        )
