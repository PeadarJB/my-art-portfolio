from __future__ import annotations

import uuid
from pathlib import Path

import pytest
from PIL import Image
from pydantic import ValidationError

from artflow.database import session_scope
from artflow.exporter import apply_website_export, plan_website_export
from artflow.models import (
    AIClassification,
    ApprovalState,
    ImageAsset,
    ImageRole,
)


def make_asset(artflow_settings, master: Path, approval: ApprovalState) -> ImageAsset:
    return ImageAsset(
        id=str(uuid.uuid4()),
        source_path=str(artflow_settings.source_path / "source.jpg"),
        source_relative_path="2020/source.jpg",
        source_filename="source.jpg",
        source_size_bytes=1,
        source_modified_ns=1,
        sha256="a" * 64,
        pixel_width=100,
        pixel_height=80,
        processing_version=artflow_settings.processing_version,
        config_fingerprint=artflow_settings.fingerprint(),
        approval_state=approval.value,
        approved_master_path=str(master),
        verified_year=2020,
        website_basename="VerifiedName",
        website_alt_text="Reviewer verified description",
    )


def test_unapproved_images_are_rejected_from_website_plan(artflow_settings):
    master = artflow_settings.approved_path / "master.png"
    master.parent.mkdir(parents=True)
    Image.new("RGB", (100, 80), "blue").save(master)
    with session_scope(artflow_settings.database_path) as session:
        session.add(make_asset(artflow_settings, master, ApprovalState.PENDING))
        session.commit()
        plan = plan_website_export(session, artflow_settings)

    assert not plan.actions


def test_website_export_is_idempotent_and_keeps_unrelated_files(artflow_settings):
    master = artflow_settings.approved_path / "master.png"
    master.parent.mkdir(parents=True)
    Image.new("RGB", (100, 80), "blue").save(master)
    unrelated = artflow_settings.website_root / "public" / "images" / "keep.txt"
    unrelated.parent.mkdir(parents=True)
    unrelated.write_text("do not remove", encoding="utf-8")

    with session_scope(artflow_settings.database_path) as session:
        session.add(make_asset(artflow_settings, master, ApprovalState.APPROVED))
        session.commit()
        first_plan = plan_website_export(session, artflow_settings)
        apply_website_export(session, artflow_settings)
        second_plan = plan_website_export(session, artflow_settings)

    assert {action.status for action in first_plan.actions} == {"create"}
    assert {action.status for action in second_plan.actions} == {"unchanged"}
    assert unrelated.read_text(encoding="utf-8") == "do not remove"


def test_white_cube_classification_requires_visualisation_label():
    with pytest.raises(ValidationError):
        AIClassification(
            role=ImageRole.WHITE_CUBE_2D,
            confidence=0.9,
            preserve_background=False,
            rationale="test",
            installation_visualisation=False,
        )
    valid = AIClassification(
        role=ImageRole.WHITE_CUBE_OBJECT,
        confidence=0.9,
        preserve_background=False,
        rationale="test",
        installation_visualisation=True,
    )
    assert valid.installation_visualisation is True
