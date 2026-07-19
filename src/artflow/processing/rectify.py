from __future__ import annotations

import math
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageOps


def assert_safe_output(source: Path, destination: Path) -> None:
    if source.resolve() == destination.resolve():
        raise ValueError("Artflow never writes over an original source image")


def _distance(a: np.ndarray, b: np.ndarray) -> float:
    return float(math.hypot(*(a - b)))


def rectify_image(source: Path, destination: Path, corners: list[tuple[float, float]]) -> Path:
    """Perspective-correct a full, reviewer-specified artwork boundary."""

    assert_safe_output(source, destination)
    if len(corners) != 4:
        raise ValueError("corners must be top-left, top-right, bottom-right, bottom-left")
    with Image.open(source) as opened:
        oriented = ImageOps.exif_transpose(opened).convert("RGB")
        icc_profile = opened.info.get("icc_profile")
        pixels = np.asarray(oriented)

    points = np.asarray(corners, dtype=np.float32)
    if np.any(points[:, 0] < 0) or np.any(points[:, 0] > oriented.width - 1):
        raise ValueError("corner x coordinate is outside the oriented image")
    if np.any(points[:, 1] < 0) or np.any(points[:, 1] > oriented.height - 1):
        raise ValueError("corner y coordinate is outside the oriented image")

    top_left, top_right, bottom_right, bottom_left = points
    width = max(1, round(max(_distance(top_right, top_left), _distance(bottom_right, bottom_left))))
    height = max(
        1, round(max(_distance(bottom_left, top_left), _distance(bottom_right, top_right)))
    )
    target = np.asarray(
        [[0, 0], [width - 1, 0], [width - 1, height - 1], [0, height - 1]],
        dtype=np.float32,
    )
    transform = cv2.getPerspectiveTransform(points, target)
    rectified = cv2.warpPerspective(
        pixels,
        transform,
        (width, height),
        flags=cv2.INTER_LANCZOS4,
        borderMode=cv2.BORDER_REPLICATE,
    )
    destination.parent.mkdir(parents=True, exist_ok=True)
    output = Image.fromarray(rectified, mode="RGB")
    save_args = {"icc_profile": icc_profile} if icc_profile else {}
    if destination.suffix.casefold() in {".tif", ".tiff"}:
        save_args["compression"] = "tiff_lzw"
    output.save(destination, **save_args)
    return destination
