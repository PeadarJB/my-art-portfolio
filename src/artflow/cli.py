from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path
from typing import Annotated

import typer

from artflow.ai import classify_manifest
from artflow.analysis import analyse_manifest
from artflow.config import PROJECT_ROOT, ArtflowSettings, get_settings
from artflow.database import session_scope
from artflow.exporter import apply_website_export, plan_website_export
from artflow.ingest import ingest as ingest_collection
from artflow.processing import process_manifest
from artflow.provenance import export_all_approved
from artflow.reporting import manifest_report, write_report

app = typer.Typer(
    no_args_is_help=True,
    help="Review-gated, fidelity-first artwork image processing.",
)


def _settings(source: Path | None = None) -> ArtflowSettings:
    if source is None:
        return get_settings()
    return ArtflowSettings(source_path=source).resolved()


@app.command()
def ingest(
    source: Annotated[
        Path | None,
        typer.Option("--source", help="Read-only local Drive for Desktop source folder."),
    ] = None,
) -> None:
    """Inventory source images, hashes, EXIF, dimensions, and duplicates."""

    settings = _settings(source)
    with session_scope(settings.database_path) as session:
        result = ingest_collection(session, settings)
    typer.echo(json.dumps(result.__dict__, indent=2, sort_keys=True))


@app.command()
def analyse(
    image_id: Annotated[str | None, typer.Option("--image-id")] = None,
) -> None:
    """Compute deterministic technical quality metrics."""

    settings = get_settings()
    with session_scope(settings.database_path) as session:
        result = analyse_manifest(session, settings, image_id)
    typer.echo(json.dumps(result, indent=2, sort_keys=True))


@app.command()
def classify(
    image_id: Annotated[str | None, typer.Option("--image-id")] = None,
    provider: Annotated[str | None, typer.Option("--provider")] = None,
) -> None:
    """Store a structured AI or explicitly low-confidence rules assessment."""

    settings = get_settings()
    with session_scope(settings.database_path) as session:
        result = classify_manifest(session, settings, image_id, provider)
    typer.echo(json.dumps(result, indent=2, sort_keys=True))


@app.command()
def process(
    image_id: Annotated[str | None, typer.Option("--image-id")] = None,
) -> None:
    """Create deterministic working images; never write into the source tree."""

    settings = get_settings()
    with session_scope(settings.database_path) as session:
        result = process_manifest(session, settings, image_id)
    typer.echo(json.dumps(result, indent=2, sort_keys=True))


@app.command()
def review() -> None:
    """Launch the local Streamlit review and approval application."""

    subprocess.run(
        [
            sys.executable,
            "-m",
            "streamlit",
            "run",
            str(PROJECT_ROOT / "review_app" / "review.py"),
        ],
        check=True,
    )


@app.command()
def export(
    website: Annotated[
        bool, typer.Option("--website", help="Include approved website derivatives.")
    ] = False,
    apply: Annotated[
        bool, typer.Option("--apply", help="Apply the website plan after dry-run validation.")
    ] = False,
    allow_replace: Annotated[
        bool,
        typer.Option(
            "--allow-replace", help="Allow replacement only for explicitly planned paths."
        ),
    ] = False,
) -> None:
    """Export approved masters; website writes require --website --apply."""

    settings = get_settings()
    with session_scope(settings.database_path) as session:
        masters = export_all_approved(session, settings)
        output: dict = {"approved_masters": masters}
        if website:
            plan = plan_website_export(session, settings, allow_replace=allow_replace)
            output["website_dry_run"] = plan.to_dict()
            if apply:
                output["website_applied"] = apply_website_export(
                    session, settings, allow_replace=allow_replace
                ).to_dict()
    typer.echo(json.dumps(output, indent=2, sort_keys=True))


@app.command()
def report(
    output: Annotated[Path | None, typer.Option("--output")] = None,
) -> None:
    """Report manifest progress and all proposed website changes."""

    settings = get_settings()
    with session_scope(settings.database_path) as session:
        report_data = manifest_report(session, settings)
    typer.echo(write_report(report_data, output))


if __name__ == "__main__":
    app()
