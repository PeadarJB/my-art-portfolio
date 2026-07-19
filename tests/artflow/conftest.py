from __future__ import annotations

from pathlib import Path

import pytest
from PIL import Image

from artflow.config import ArtflowSettings


@pytest.fixture
def artflow_settings(tmp_path: Path) -> ArtflowSettings:
    source = tmp_path / "source"
    source.mkdir()
    return ArtflowSettings(
        source_path=source,
        database_path=tmp_path / "manifest.sqlite",
        working_path=tmp_path / "working",
        approved_path=tmp_path / "approved",
        website_root=tmp_path / "website",
        prompt_path=tmp_path / "prompt.txt",
        gallery_template_path=tmp_path / "gallery",
        min_short_edge=10,
    ).resolved(tmp_path)


@pytest.fixture
def make_image():
    def factory(path: Path, size: tuple[int, int] = (80, 60), color=(90, 120, 150)) -> Path:
        path.parent.mkdir(parents=True, exist_ok=True)
        Image.new("RGB", size, color).save(path)
        return path

    return factory
