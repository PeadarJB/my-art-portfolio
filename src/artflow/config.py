from __future__ import annotations

import hashlib
import json
from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parents[2]


class ArtflowSettings(BaseSettings):
    """Runtime settings; secrets and the Drive path stay outside Git."""

    model_config = SettingsConfigDict(
        env_prefix="ARTFLOW_",
        env_file=(".env", ".env.artflow"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    source_path: Path | None = None
    database_path: Path = Path("manifest.sqlite")
    working_path: Path = Path("working")
    approved_path: Path = Path("approved")
    website_root: Path = Path(".")
    prompt_path: Path = Path("prompts/classification-v1.txt")
    gallery_template_path: Path = Path("templates/gallery")

    ai_provider: Literal["rules", "openai", "gemini"] = "rules"
    openai_model: str | None = None
    openai_api_key: SecretStr | None = None
    gemini_model: str | None = None
    gemini_api_key: SecretStr | None = None

    processing_version: str = "0.1.0"
    prompt_version: str = "classification-v1"
    image_extensions: set[str] = Field(
        default_factory=lambda: {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp"}
    )
    exclude_path_terms: list[str] = Field(
        default_factory=lambda: ["upland folk", "upland_folk", "uplandfolk"]
    )
    # Verified from the repository's 2022 Upland Folk collection. Filename
    # guards are needed because one known source sits in the Drive 2021 folder.
    exclude_filename_terms: list[str] = Field(
        default_factory=lambda: [
            "wildhunt",
            "escape from the cave",
            "escapefromthecave",
            "summerday",
            "morning sun",
            "kingpuck",
            "shavasana",
            "hawthorntrespasser",
            "cycle of the goddess",
        ]
    )
    exclude_filename_stems: set[str] = Field(
        default_factory=lambda: {
            "wildhunt",
            "dawn",
            "summerday",
            "goddess",
            "kingpuck",
            "shavasana",
            "hawthorntrespasser",
            "escapefromthecave",
        }
    )
    preserve_background_years: set[int] = Field(default_factory=lambda: {2021})

    variant_widths: dict[str, int] = Field(
        default_factory=lambda: {"small": 640, "medium": 1280, "large": 2200}
    )
    variant_qualities: dict[str, int] = Field(
        default_factory=lambda: {"small": 78, "medium": 78, "large": 82}
    )
    min_short_edge: int = 1200
    max_blur_effect: float = 0.6
    max_highlight_clip_percent: float = 8.0
    max_shadow_clip_percent: float = 15.0

    def resolved(self, project_root: Path = PROJECT_ROOT) -> ArtflowSettings:
        """Return a copy whose repository-relative paths are absolute."""

        def resolve(path: Path | None) -> Path | None:
            if path is None or path.is_absolute():
                return path
            return (project_root / path).resolve()

        return self.model_copy(
            update={
                "source_path": resolve(self.source_path),
                "database_path": resolve(self.database_path),
                "working_path": resolve(self.working_path),
                "approved_path": resolve(self.approved_path),
                "website_root": resolve(self.website_root),
                "prompt_path": resolve(self.prompt_path),
                "gallery_template_path": resolve(self.gallery_template_path),
            }
        )

    def fingerprint(self) -> str:
        """Hash non-secret settings that affect deterministic results."""

        payload = {
            "processing_version": self.processing_version,
            "prompt_version": self.prompt_version,
            "image_extensions": sorted(self.image_extensions),
            "exclude_path_terms": self.exclude_path_terms,
            "exclude_filename_terms": self.exclude_filename_terms,
            "exclude_filename_stems": sorted(self.exclude_filename_stems),
            "preserve_background_years": sorted(self.preserve_background_years),
            "variant_widths": self.variant_widths,
            "variant_qualities": self.variant_qualities,
            "min_short_edge": self.min_short_edge,
            "max_blur_effect": self.max_blur_effect,
            "max_highlight_clip_percent": self.max_highlight_clip_percent,
            "max_shadow_clip_percent": self.max_shadow_clip_percent,
        }
        encoded = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
        return hashlib.sha256(encoded).hexdigest()


@lru_cache(maxsize=1)
def get_settings() -> ArtflowSettings:
    return ArtflowSettings().resolved()
