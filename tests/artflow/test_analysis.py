from __future__ import annotations

from sqlmodel import select

from artflow.ai import classify_manifest
from artflow.analysis import analyse_manifest
from artflow.database import session_scope
from artflow.ingest import ingest
from artflow.models import ImageAsset


def test_analysis_and_rules_classification_are_resumable(artflow_settings, make_image):
    make_image(artflow_settings.source_path / "2021" / "context.png", (120, 90))
    artflow_settings.prompt_path.write_text("classify conservatively", encoding="utf-8")

    with session_scope(artflow_settings.database_path) as session:
        ingest(session, artflow_settings)
        first_analysis = analyse_manifest(session, artflow_settings)
        second_analysis = analyse_manifest(session, artflow_settings)
        first_classification = classify_manifest(session, artflow_settings)
        second_classification = classify_manifest(session, artflow_settings)
        asset = session.exec(select(ImageAsset)).one()

    assert first_analysis["analysed"] == 1
    assert second_analysis["unchanged"] == 1
    assert first_classification["classified"] == 1
    assert second_classification["unchanged"] == 1
    assert asset.technical_scores_json is not None
    assert asset.ai_assessment_json is not None
    assert asset.ai_provider == "rules"
