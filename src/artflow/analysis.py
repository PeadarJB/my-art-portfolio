from __future__ import annotations

import hashlib
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageOps
from skimage import color, measure
from sqlmodel import Session, select

from artflow.config import ArtflowSettings
from artflow.models import ImageAsset, TechnicalScores, utcnow


def analyse_image(path: Path, settings: ArtflowSettings) -> TechnicalScores:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        rgb = np.asarray(image)

    gray = color.rgb2gray(rgb)
    gray_u8 = np.clip(gray * 255.0, 0, 255).astype(np.uint8)
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    long_edge = max(image.size)
    short_edge = min(image.size)
    shadow_clip = float(np.mean(gray_u8 <= 5) * 100.0)
    highlight_clip = float(np.mean(gray_u8 >= 250) * 100.0)
    blur_effect = float(measure.blur_effect(gray))
    sharpness = float(cv2.Laplacian(gray_u8, cv2.CV_64F).var())
    p5, p95 = np.percentile(gray_u8, [5, 95])

    warnings: list[str] = []
    if short_edge < settings.min_short_edge:
        warnings.append(f"short edge {short_edge}px is below {settings.min_short_edge}px")
    if blur_effect > settings.max_blur_effect:
        warnings.append(f"blur effect {blur_effect:.3f} exceeds {settings.max_blur_effect:.3f}")
    if highlight_clip > settings.max_highlight_clip_percent:
        warnings.append(f"highlight clipping is {highlight_clip:.2f}%")
    if shadow_clip > settings.max_shadow_clip_percent:
        warnings.append(f"shadow clipping is {shadow_clip:.2f}%")

    return TechnicalScores(
        megapixels=round((image.width * image.height) / 1_000_000, 3),
        long_edge=long_edge,
        short_edge=short_edge,
        sharpness_laplacian_variance=round(sharpness, 4),
        blur_effect=round(blur_effect, 4),
        luminance_mean=round(float(np.mean(gray)), 4),
        shadow_clip_percent=round(shadow_clip, 4),
        highlight_clip_percent=round(highlight_clip, 4),
        dynamic_range=round(float((p95 - p5) / 255.0), 4),
        saturation_mean=round(float(np.mean(hsv[:, :, 1]) / 255.0), 4),
        warnings=warnings,
        recommend_rephotograph=bool(warnings),
    )


def analysis_signature(asset: ImageAsset, settings: ArtflowSettings) -> str:
    payload = f"{asset.sha256}:{settings.fingerprint()}:technical-v1"
    return hashlib.sha256(payload.encode()).hexdigest()


def analyse_manifest(
    session: Session, settings: ArtflowSettings, image_id: str | None = None
) -> dict[str, int]:
    statement = select(ImageAsset)
    if image_id:
        statement = statement.where(ImageAsset.id == image_id)
    assets = session.exec(statement.order_by(ImageAsset.source_relative_path)).all()
    result = {"analysed": 0, "unchanged": 0, "failed": 0}
    for asset in assets:
        signature = analysis_signature(asset, settings)
        if asset.analysis_signature == signature and asset.technical_scores_json:
            result["unchanged"] += 1
            continue
        try:
            scores = analyse_image(Path(asset.source_path), settings)
            asset.technical_scores_json = scores.model_dump_json()
            asset.analysis_signature = signature
            asset.updated_at = utcnow()
            session.add(asset)
            session.commit()
            result["analysed"] += 1
        except Exception:
            session.rollback()
            result["failed"] += 1
    return result


def technical_scores(asset: ImageAsset) -> TechnicalScores | None:
    if not asset.technical_scores_json:
        return None
    return TechnicalScores.model_validate(json.loads(asset.technical_scores_json))
