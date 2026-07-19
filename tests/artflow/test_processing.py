from __future__ import annotations

import hashlib
from pathlib import Path

import numpy as np
import pytest
from PIL import Image
from sqlmodel import select

from artflow.database import session_scope
from artflow.ingest import ingest
from artflow.models import ImageAsset, ImageRole
from artflow.processing.basic import process_manifest
from artflow.processing.composite import composite_exact_artwork
from artflow.processing.rectify import rectify_image


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def test_rectification_never_overwrites_original(artflow_settings, make_image):
    source = make_image(artflow_settings.source_path / "2020" / "work.png", (100, 80))
    before = digest(source)
    output = artflow_settings.working_path / "rectified.png"

    rectify_image(source, output, [(5, 5), (94, 4), (95, 74), (4, 75)])

    assert output.is_file()
    assert digest(source) == before
    assert Image.open(output).size == (91, 70)
    with pytest.raises(ValueError, match="never writes over"):
        rectify_image(source, source, [(0, 0), (99, 0), (99, 79), (0, 79)])


def test_processing_is_resumable_and_preserves_source(artflow_settings, make_image):
    source = make_image(artflow_settings.source_path / "2021" / "context.png")
    before = digest(source)
    with session_scope(artflow_settings.database_path) as session:
        ingest(session, artflow_settings)
        asset = session.exec(select(ImageAsset)).one()
        asset.processing_recipe = ImageRole.CONTEXT_LIGHT_CLEANUP.value
        session.add(asset)
        session.commit()
        first = process_manifest(session, artflow_settings)
        second = process_manifest(session, artflow_settings)

    assert first["processed"] == 1
    assert second["unchanged"] == 1
    assert digest(source) == before


def test_protected_opaque_artwork_pixels_are_bit_identical():
    background = Image.new("RGB", (8, 8), (240, 240, 240))
    artwork = Image.new("RGBA", (3, 3), (17, 99, 203, 255))

    result = composite_exact_artwork(background, artwork, (2, 3))
    pixels = np.asarray(result)

    assert np.all(pixels[3:6, 2:5, :3] == np.array([17, 99, 203]))
