from __future__ import annotations

import base64
import io
from abc import ABC, abstractmethod
from pathlib import Path

from PIL import Image, ImageOps

from artflow.models import AIClassification, ImageAsset, TechnicalScores


class ClassificationProvider(ABC):
    name: str
    model_name: str

    @abstractmethod
    def classify(
        self,
        image_path: Path,
        asset: ImageAsset,
        technical: TechnicalScores | None,
        prompt: str,
    ) -> AIClassification:
        raise NotImplementedError


def review_image_data_url(path: Path, max_edge: int = 1800) -> str:
    """Encode a temporary in-memory review copy; never modify the source."""

    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG", quality=88, optimize=True)
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/jpeg;base64,{encoded}"
