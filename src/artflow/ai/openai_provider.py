from __future__ import annotations

import json
from pathlib import Path

from artflow.ai.base import ClassificationProvider, review_image_data_url
from artflow.models import AIClassification, ImageAsset, TechnicalScores


class OpenAIProvider(ClassificationProvider):
    name = "openai"

    def __init__(self, api_key: str, model_name: str):
        if not api_key or not model_name:
            raise ValueError(
                "OpenAI provider requires ARTFLOW_OPENAI_API_KEY and ARTFLOW_OPENAI_MODEL"
            )
        try:
            from openai import OpenAI
        except ImportError as error:
            raise RuntimeError("Install the adapter with: uv sync --extra openai") from error
        self.client = OpenAI(api_key=api_key)
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
        response = self.client.responses.parse(
            model=self.model_name,
            input=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": f"{prompt}\n\nContext:\n{json.dumps(context)}",
                        },
                        {"type": "input_image", "image_url": review_image_data_url(image_path)},
                    ],
                }
            ],
            text_format=AIClassification,
        )
        parsed = response.output_parsed
        if parsed is None:
            raise RuntimeError("OpenAI returned no structured classification")
        return parsed
