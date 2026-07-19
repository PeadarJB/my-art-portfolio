from __future__ import annotations

from datetime import UTC, datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, field_validator
from pydantic import Field as PydanticField
from sqlalchemy import Column, Text
from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    return datetime.now(UTC)


class ImageRole(StrEnum):
    CONTEXT_LIGHT_CLEANUP = "CONTEXT_LIGHT_CLEANUP"
    RECTIFY_2D = "RECTIFY_2D"
    ISOLATE_OBJECT = "ISOLATE_OBJECT"
    WHITE_CUBE_2D = "WHITE_CUBE_2D"
    WHITE_CUBE_OBJECT = "WHITE_CUBE_OBJECT"
    REPHOTOGRAPH = "REPHOTOGRAPH"


class ApprovalState(StrEnum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    REPHOTOGRAPH = "rephotograph"


class NormalizedPoint(BaseModel):
    x: float
    y: float

    @field_validator("x", "y")
    @classmethod
    def normalized_coordinate(cls, value: float) -> float:
        if not 0.0 <= value <= 1.0:
            raise ValueError("boundary coordinates must be normalized from 0 to 1")
        return value


class ArtworkBoundary(BaseModel):
    """Clockwise points: top-left, top-right, bottom-right, bottom-left."""

    points: list[NormalizedPoint] = PydanticField(min_length=4, max_length=4)


class TechnicalScores(BaseModel):
    model_config = ConfigDict(extra="forbid")

    megapixels: float
    long_edge: int
    short_edge: int
    sharpness_laplacian_variance: float
    blur_effect: float
    luminance_mean: float
    shadow_clip_percent: float
    highlight_clip_percent: float
    dynamic_range: float
    saturation_mean: float
    warnings: list[str] = PydanticField(default_factory=list)
    recommend_rephotograph: bool = False


class AIClassification(BaseModel):
    model_config = ConfigDict(extra="forbid")

    role: ImageRole
    confidence: float = PydanticField(ge=0.0, le=1.0)
    preserve_background: bool
    rationale: str
    warnings: list[str] = PydanticField(default_factory=list)
    boundary: ArtworkBoundary | None = None
    rephotograph_reasons: list[str] = PydanticField(default_factory=list)
    gallery_template_id: str | None = None
    installation_visualisation: bool = False

    @field_validator("installation_visualisation")
    @classmethod
    def visualisation_role_matches_label(cls, value: bool, info):
        role = info.data.get("role")
        should_be_visualisation = role in {ImageRole.WHITE_CUBE_2D, ImageRole.WHITE_CUBE_OBJECT}
        if value != should_be_visualisation:
            raise ValueError("white-cube roles must be labelled as installation visualisations")
        return value


class ImageAsset(SQLModel, table=True):
    __tablename__ = "image_assets"

    id: str = Field(primary_key=True)
    source_path: str = Field(unique=True, index=True)
    source_relative_path: str = Field(index=True)
    source_filename: str
    source_size_bytes: int
    source_modified_ns: int
    sha256: str = Field(index=True)
    perceptual_hash: str | None = Field(default=None, index=True)
    duplicate_of_id: str | None = Field(default=None, index=True)
    pixel_width: int
    pixel_height: int
    exif_json: str | None = Field(default=None, sa_column=Column(Text))

    verified_title: str | None = None
    verified_year: int | None = None
    verified_medium: str | None = None
    verified_dimensions: str | None = None
    verified_width_cm: float | None = None
    verified_height_cm: float | None = None

    image_role: str | None = Field(default=None, index=True)
    processing_recipe: str | None = None
    technical_scores_json: str | None = Field(default=None, sa_column=Column(Text))
    ai_assessment_json: str | None = Field(default=None, sa_column=Column(Text))
    ai_confidence: float | None = None
    preserve_background: bool = False
    crop_coordinates_json: str | None = Field(default=None, sa_column=Column(Text))
    mask_path: str | None = None
    mask_add_regions_json: str | None = Field(default=None, sa_column=Column(Text))
    mask_remove_regions_json: str | None = Field(default=None, sa_column=Column(Text))
    gallery_template_id: str | None = None
    installation_visualisation: bool = False
    documentation_label: str = "artwork_documentation"

    ai_provider: str | None = None
    ai_model: str | None = None
    prompt_version: str | None = None
    processing_version: str
    config_fingerprint: str
    analysis_signature: str | None = Field(default=None, index=True)
    classification_signature: str | None = Field(default=None, index=True)
    processing_signature: str | None = Field(default=None, index=True)

    approval_state: str = Field(default=ApprovalState.PENDING.value, index=True)
    reviewer_notes: str | None = Field(default=None, sa_column=Column(Text))
    processing_output_path: str | None = None
    approved_master_path: str | None = None
    transparent_output_path: str | None = None
    neutral_output_path: str | None = None
    website_output_paths_json: str | None = Field(default=None, sa_column=Column(Text))
    website_basename: str | None = None
    website_alt_text: str | None = None
    website_primary: bool = False
    website_secondary: bool = False

    ingested_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)
    processed_at: datetime | None = None
    approval_timestamp: datetime | None = None
