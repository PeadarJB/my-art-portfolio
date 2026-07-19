"""Local Streamlit review UI, kept outside `app/` so Next.js uses `src/app`."""

from __future__ import annotations

import json
from pathlib import Path

import streamlit as st
from PIL import Image, ImageDraw, ImageOps
from sqlmodel import select

from artflow.config import get_settings
from artflow.database import session_scope
from artflow.exporter import plan_website_export
from artflow.models import (
    ApprovalState,
    ArtworkBoundary,
    ImageAsset,
    ImageRole,
    NormalizedPoint,
    utcnow,
)
from artflow.provenance import export_approved_master

st.set_page_config(page_title="Artflow Review", layout="wide", page_icon="◻")
st.markdown(
    """
    <style>
      :root { --paper: #fff; --ink: #131313; --muted: #696969; --rule: #dcdcdc; --accent: #b74034; }
      .stApp { background: var(--paper); color: var(--ink); }
      h1, h2, h3 { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-weight: 400; }
      [data-testid="stMetric"] { border-top: 1px solid var(--rule); padding-top: .6rem; }
      .integrity-note {
        border-left: 3px solid var(--accent); padding: .7rem 1rem; color: var(--muted);
      }
      .visualisation-label {
        color: var(--accent); text-transform: uppercase; letter-spacing: .08em;
      }
    </style>
    """,
    unsafe_allow_html=True,
)


def load_assets() -> list[ImageAsset]:
    settings = get_settings()
    with session_scope(settings.database_path) as session:
        return list(
            session.exec(select(ImageAsset).order_by(ImageAsset.source_relative_path)).all()
        )


def boundary_from_asset(asset: ImageAsset) -> ArtworkBoundary:
    if asset.crop_coordinates_json:
        return ArtworkBoundary.model_validate_json(asset.crop_coordinates_json)
    return ArtworkBoundary(
        points=[
            NormalizedPoint(x=0.0, y=0.0),
            NormalizedPoint(x=1.0, y=0.0),
            NormalizedPoint(x=1.0, y=1.0),
            NormalizedPoint(x=0.0, y=1.0),
        ]
    )


def boundary_preview(asset: ImageAsset, boundary: ArtworkBoundary) -> Image.Image:
    with Image.open(asset.source_path) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
    preview = image.copy()
    draw = ImageDraw.Draw(preview)
    points = [
        (round(point.x * image.width), round(point.y * image.height)) for point in boundary.points
    ]
    draw.line(points + [points[0]], fill=(183, 64, 52), width=max(3, image.width // 500))
    for x, y in points:
        radius = max(5, image.width // 250)
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(183, 64, 52))
    return preview


def gallery_template_ids(path: Path) -> list[str]:
    ids: list[str] = []
    for sidecar in sorted(path.glob("*.json")):
        if sidecar.name == "template.schema.json":
            continue
        try:
            ids.append(json.loads(sidecar.read_text(encoding="utf-8"))["id"])
        except (KeyError, json.JSONDecodeError):
            continue
    return ids


def save_asset(asset_id: str, values: dict) -> None:
    settings = get_settings()
    with session_scope(settings.database_path) as session:
        asset = session.get(ImageAsset, asset_id)
        if asset is None:
            raise LookupError(asset_id)
        for key, value in values.items():
            setattr(asset, key, value)
        asset.updated_at = utcnow()
        session.add(asset)
        session.commit()


def set_approval(asset_id: str, state: ApprovalState) -> None:
    save_asset(
        asset_id,
        {
            "approval_state": state.value,
            "approval_timestamp": utcnow(),
            "documentation_label": "installation_visualisation"
            if state == ApprovalState.APPROVED and selected_asset.installation_visualisation
            else selected_asset.documentation_label,
        },
    )


settings = get_settings()
assets = load_assets()
st.title("Artflow review")
st.markdown(
    '<p class="integrity-note">Originals are read-only. Nothing reaches the portfolio until this '
    "record is explicitly approved. White-cube outputs are installation visualisations, never "
    "exhibition documentation.</p>",
    unsafe_allow_html=True,
)

if not assets:
    st.info("The manifest is empty. Configure ARTFLOW_SOURCE_PATH and run `uv run artflow ingest`.")
    st.stop()

filter_state = st.sidebar.selectbox(
    "Approval state", ["all", *[state.value for state in ApprovalState]]
)
filtered = [
    asset for asset in assets if filter_state == "all" or asset.approval_state == filter_state
]
if not filtered:
    st.warning("No records match this filter.")
    st.stop()

labels = {asset.id: f"{asset.source_relative_path} · {asset.approval_state}" for asset in filtered}
selected_id = st.sidebar.selectbox("Image", list(labels), format_func=labels.get)
selected_asset = next(asset for asset in filtered if asset.id == selected_id)
boundary = boundary_from_asset(selected_asset)

st.caption(f"{selected_asset.id} · SHA-256 {selected_asset.sha256}")
if selected_asset.installation_visualisation:
    st.markdown(
        '<p class="visualisation-label">Installation visualisation</p>', unsafe_allow_html=True
    )

left, right = st.columns([1.35, 1], gap="large")
with left:
    original_tab, boundary_tab, mask_tab, output_tab = st.tabs(
        ["Original", "Boundary", "Alpha mask", "Proposed output"]
    )
    with original_tab:
        st.image(selected_asset.source_path, caption="Read-only original", use_container_width=True)
    with boundary_tab:
        st.image(boundary_preview(selected_asset, boundary), use_container_width=True)
    with mask_tab:
        if selected_asset.mask_path and Path(selected_asset.mask_path).is_file():
            st.image(
                selected_asset.mask_path, caption="Current alpha mask", use_container_width=True
            )
        else:
            st.info(
                "No mask has been generated. Object segmentation is deferred until pilot review."
            )
    with output_tab:
        if (
            selected_asset.processing_output_path
            and Path(selected_asset.processing_output_path).is_file()
        ):
            st.image(
                selected_asset.processing_output_path,
                caption=selected_asset.documentation_label.replace("_", " ").title(),
                use_container_width=True,
            )
        else:
            st.info("No deterministic working output exists yet.")

with right:
    scores = (
        json.loads(selected_asset.technical_scores_json)
        if selected_asset.technical_scores_json
        else None
    )
    assessment = (
        json.loads(selected_asset.ai_assessment_json) if selected_asset.ai_assessment_json else None
    )
    st.subheader("Assessment")
    if scores:
        metric_columns = st.columns(3)
        metric_columns[0].metric("Megapixels", scores["megapixels"])
        metric_columns[1].metric("Blur effect", scores["blur_effect"])
        metric_columns[2].metric("Highlights clipped", f"{scores['highlight_clip_percent']:.2f}%")
        if scores.get("warnings"):
            st.warning("\n".join(scores["warnings"]))
        with st.expander("All technical scores"):
            st.json(scores)
    else:
        st.info("Technical analysis pending.")
    if assessment:
        st.write(f"**Recommendation:** {assessment['role']} ({assessment['confidence']:.0%})")
        st.write(assessment["rationale"])
        if assessment.get("warnings"):
            st.warning("\n".join(assessment["warnings"]))
        with st.expander("Structured AI assessment"):
            st.json(assessment)
    else:
        st.info("Classification pending.")

st.divider()
with st.form("review-form"):
    st.subheader("Reviewer controls")
    control_a, control_b, control_c = st.columns(3)
    with control_a:
        recipe_values = [role.value for role in ImageRole]
        recipe_index = (
            recipe_values.index(selected_asset.processing_recipe)
            if selected_asset.processing_recipe in recipe_values
            else 0
        )
        recipe = st.selectbox("Recipe", recipe_values, index=recipe_index)
        preserve_background = st.checkbox(
            "Preserve background", value=selected_asset.preserve_background
        )
        templates = ["", *gallery_template_ids(settings.gallery_template_path)]
        template_index = (
            templates.index(selected_asset.gallery_template_id)
            if selected_asset.gallery_template_id in templates
            else 0
        )
        gallery_template_id = st.selectbox("Gallery template", templates, index=template_index)
    with control_b:
        verified_title = st.text_input("Verified title", value=selected_asset.verified_title or "")
        verified_year = st.number_input(
            "Verified year", min_value=0, max_value=2200, value=selected_asset.verified_year or 0
        )
        verified_medium = st.text_input(
            "Verified medium", value=selected_asset.verified_medium or ""
        )
        verified_dimensions = st.text_input(
            "Verified dimensions", value=selected_asset.verified_dimensions or ""
        )
    with control_c:
        verified_width_cm = st.number_input(
            "Verified width (cm)", min_value=0.0, value=selected_asset.verified_width_cm or 0.0
        )
        verified_height_cm = st.number_input(
            "Verified height (cm)", min_value=0.0, value=selected_asset.verified_height_cm or 0.0
        )
        website_basename = st.text_input(
            "Website basename", value=selected_asset.website_basename or ""
        )
        website_alt_text = st.text_input(
            "Verified website alt text", value=selected_asset.website_alt_text or ""
        )
        website_primary = st.checkbox("Primary website image", value=selected_asset.website_primary)
        website_secondary = st.checkbox(
            "Secondary website image", value=selected_asset.website_secondary
        )

    with st.expander("Adjust four crop corners"):
        names = ["Top-left", "Top-right", "Bottom-right", "Bottom-left"]
        edited_points = []
        for index, (name, point) in enumerate(zip(names, boundary.points, strict=True)):
            x_col, y_col = st.columns(2)
            x = x_col.number_input(
                f"{name} x", 0.0, 1.0, float(point.x), 0.001, key=f"corner-{index}-x"
            )
            y = y_col.number_input(
                f"{name} y", 0.0, 1.0, float(point.y), 0.001, key=f"corner-{index}-y"
            )
            edited_points.append(NormalizedPoint(x=x, y=y))

    with st.expander("Mask add/remove refinements"):
        st.caption(
            "Enter normalized rectangles or polygon point arrays. These instructions are "
            "stored for the segmentation stage and never alter the original."
        )
        mask_add = st.text_area(
            "Add regions (JSON)", value=selected_asset.mask_add_regions_json or "[]"
        )
        mask_remove = st.text_area(
            "Remove regions (JSON)", value=selected_asset.mask_remove_regions_json or "[]"
        )

    reviewer_notes = st.text_area("Reviewer notes", value=selected_asset.reviewer_notes or "")
    saved = st.form_submit_button("Save review", type="primary")

if saved:
    try:
        json.loads(mask_add)
        json.loads(mask_remove)
        chosen_role = ImageRole(recipe)
        save_asset(
            selected_asset.id,
            {
                "processing_recipe": recipe,
                "image_role": recipe,
                "preserve_background": preserve_background,
                "gallery_template_id": gallery_template_id or None,
                "installation_visualisation": chosen_role
                in {ImageRole.WHITE_CUBE_2D, ImageRole.WHITE_CUBE_OBJECT},
                "documentation_label": "installation_visualisation"
                if chosen_role in {ImageRole.WHITE_CUBE_2D, ImageRole.WHITE_CUBE_OBJECT}
                else "artwork_documentation",
                "verified_title": verified_title or None,
                "verified_year": int(verified_year) or None,
                "verified_medium": verified_medium or None,
                "verified_dimensions": verified_dimensions or None,
                "verified_width_cm": verified_width_cm or None,
                "verified_height_cm": verified_height_cm or None,
                "website_basename": website_basename or None,
                "website_alt_text": website_alt_text or None,
                "website_primary": website_primary,
                "website_secondary": website_secondary,
                "crop_coordinates_json": ArtworkBoundary(points=edited_points).model_dump_json(),
                "mask_add_regions_json": mask_add,
                "mask_remove_regions_json": mask_remove,
                "reviewer_notes": reviewer_notes or None,
                "processing_signature": None,
            },
        )
        st.success("Review saved. Re-run processing when recipe or boundary changed.")
        st.rerun()
    except (json.JSONDecodeError, ValueError) as error:
        st.error(f"Review was not saved: {error}")

approve_col, reject_col, rephoto_col, export_col = st.columns(4)
if approve_col.button("Approve"):
    set_approval(selected_asset.id, ApprovalState.APPROVED)
    st.rerun()
if reject_col.button("Reject"):
    set_approval(selected_asset.id, ApprovalState.REJECTED)
    st.rerun()
if rephoto_col.button("Re-photograph"):
    set_approval(selected_asset.id, ApprovalState.REPHOTOGRAPH)
    st.rerun()
if export_col.button("Export approved master"):
    try:
        with session_scope(settings.database_path) as session:
            current = session.get(ImageAsset, selected_asset.id)
            destination, changed = export_approved_master(session, current, settings)
        st.success(f"{'Exported' if changed else 'Already current'}: {destination}")
    except (PermissionError, FileNotFoundError) as error:
        st.error(str(error))

with st.expander("Provenance and website dry-run"):
    st.json(selected_asset.model_dump(mode="json"))
    with session_scope(settings.database_path) as session:
        st.json(plan_website_export(session, settings).to_dict())
