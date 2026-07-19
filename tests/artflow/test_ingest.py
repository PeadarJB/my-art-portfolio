from __future__ import annotations

from PIL import Image
from sqlmodel import select

from artflow.database import session_scope
from artflow.ingest import ingest, iter_source_images
from artflow.models import ImageAsset


def test_upland_folk_paths_and_known_filenames_are_excluded(artflow_settings, make_image):
    source = artflow_settings.source_path
    make_image(source / "2021" / "ordinary.jpg")
    make_image(source / "Upland Folk" / "not-for-pipeline.jpg")
    make_image(source / "2021" / "EscapeFromTheCave.jpeg")
    make_image(source / "archive" / "Dawn.jpg")

    paths = [
        path.relative_to(source).as_posix() for path in iter_source_images(source, artflow_settings)
    ]

    assert paths == ["2021/ordinary.jpg"]


def test_ingest_is_idempotent_and_unknown_metadata_is_null(artflow_settings, make_image):
    make_image(artflow_settings.source_path / "2020" / "untitled-source.jpg")

    with session_scope(artflow_settings.database_path) as session:
        first = ingest(session, artflow_settings)
        second = ingest(session, artflow_settings)
        assets = session.exec(select(ImageAsset)).all()

    assert first.created == 1
    assert second.created == 0
    assert second.unchanged == 1
    assert len(assets) == 1
    assert assets[0].verified_title is None
    assert assets[0].verified_year is None
    assert assets[0].verified_medium is None
    assert assets[0].verified_dimensions is None


def test_exif_orientation_records_oriented_dimensions(artflow_settings):
    path = artflow_settings.source_path / "2020" / "rotated.jpg"
    path.parent.mkdir(parents=True)
    image = Image.new("RGB", (40, 20), "red")
    exif = Image.Exif()
    exif[274] = 6
    image.save(path, exif=exif)

    with session_scope(artflow_settings.database_path) as session:
        ingest(session, artflow_settings)
        asset = session.exec(select(ImageAsset)).one()

    assert (asset.pixel_width, asset.pixel_height) == (20, 40)


def test_exact_duplicates_are_linked(artflow_settings, make_image):
    make_image(artflow_settings.source_path / "2019" / "one.png")
    make_image(artflow_settings.source_path / "2020" / "two.png")

    with session_scope(artflow_settings.database_path) as session:
        ingest(session, artflow_settings)
        assets = session.exec(select(ImageAsset).order_by(ImageAsset.source_relative_path)).all()

    assert len({asset.sha256 for asset in assets}) == 1
    assert assets[0].duplicate_of_id is None
    assert assets[1].duplicate_of_id == assets[0].id
