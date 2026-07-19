from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageOps

from artflow.ai.base import ClassificationProvider
from artflow.models import AIClassification, ImageAsset, TechnicalScores


class GeminiProvider(ClassificationProvider):
    name = "gemini"

    def __init__(self, api_key: str, model_name: str):
        if not api_key or not model_name:
            raise ValueError(
                "Gemini provider requires ARTFLOW_GEMINI_API_KEY and ARTFLOW_GEMINI_MODEL"
            )
        try:
            from google import genai
            from google.genai import types
        except ImportError as error:
            raise RuntimeError("Install the adapter with: uv sync --extra gemini") from error
        self.client = genai.Client(api_key=api_key)
        self.types = types
        self.model_name = model_name

    def classify(
        self,
        image_path: Path,
        asset: ImageAsset,
        technical: TechnicalScores | None,
        prompt: str,
    ) -> AIClassification:
        context = {
            "source_relative_path": asset.source_relative_path,
            "preserve_background_default": asset.preserve_background,
            "technical_scores": technical.model_dump(mode="json") if technical else None,
        }
        with Image.open(image_path) as source:
            image = ImageOps.exif_transpose(source).convert("RGB").copy()
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=[image, f"{prompt}\n\nContext:\n{json.dumps(context)}"],
            config=self.types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AIClassification,
            ),
        )
        if getattr(response, "parsed", None) is not None:
            return AIClassification.model_validate(response.parsed)
        if not response.text:
            raise RuntimeError("Gemini returned no structured classification")
        return AIClassification.model_validate_json(response.text)
