# my-art-portfolio

Modern rebuild of the artist portfolio using Next.js, TypeScript, Zustand, and token-driven design.

## Quick start
1. Install dependencies:
   `npm install`
2. Copy environment file:
   `copy .env.example .env.local`
3. Run development server:
   `npm run dev`

## Stack
- Next.js App Router
- TypeScript (strict)
- Zustand
- Zod

## Key docs
- `AGENTS.md`
- `docs/PRODUCT_BRIEF.md`
- `docs/DESIGN_TOKENS.md`
- `docs/CONTENT_SCHEMA.md`
- `docs/PERFORMANCE_BUDGETS.md`

## Artflow image-processing pilot

`artflow` is the local, fidelity-first pipeline for inventorying artwork
photographs, recording technical and AI-assisted assessments, proposing
deterministic edits, and exporting only human-approved images. Originals are
opened read-only and are never overwritten. Upland Folk paths and known Upland
Folk filenames are excluded before ingest.

### Requirements

- Python 3.12 (the project intentionally excludes 3.13+ until the image stack
  is validated there)
- [uv](https://docs.astral.sh/uv/)
- Google Drive for Desktop when the source collection is not otherwise local

### Setup

1. Install the base CPU environment: `uv sync --group dev`.
2. For a cloud vision provider, install one optional adapter:
   `uv sync --group dev --extra openai` or
   `uv sync --group dev --extra gemini`.
3. Copy the Artflow entries from `.env.example` to an untracked `.env` or set
   them in the shell.
4. In Google Drive for Desktop, make `Backup/Peadar/edits` available offline
   and set `ARTFLOW_SOURCE_PATH` to that local folder. Artflow never writes to
   it. The cloud folder verified during the pilot has Drive ID
   `1-5XfEn7v71F08t1EoN4ynuDnE75qQP_V`.
5. Initialise and inventory: `uv run artflow ingest`.
6. Analyse and classify: `uv run artflow analyse`, then
   `uv run artflow classify`.
7. Start review: `uv run artflow review`.

The default `ARTFLOW_AI_PROVIDER=rules` is a deliberately low-confidence,
deterministic fallback. It makes the workflow runnable without credentials but
does not pretend to be visual AI. Set the provider to `openai` or `gemini` and
configure its model name and key to enable vision classification. Model names
are configuration, not scattered through the codebase.

### Commands

- `artflow ingest` — inventory and hash supported source images.
- `artflow analyse` — compute resolution, clipping, blur, sharpness, and colour
  metrics.
- `artflow classify` — store a structured recipe recommendation.
- `artflow process` — create deterministic working copies or perspective
  rectifications without touching originals.
- `artflow review` — open the Streamlit approval interface.
- `artflow export` — export approved masters and provenance sidecars; website
  writes require the explicit `--website --apply` flags.
- `artflow report` — print or write a manifest and dry-run summary.

All commands are resumable: the source hash, configuration fingerprint,
processing version, and relevant operation signature are persisted in SQLite.
The SQLite manifest, working images, approved images, source library, and API
secrets are ignored by Git.

The Streamlit entry point is `review_app/review.py`. It intentionally does not
use the otherwise conventional `app/review.py` path: a root `app/` directory
would make Next.js ignore this repository's real `src/app` router and remove
the portfolio routes from production builds.

The Drive-level pilot inventory and the proposed 20-image review set are in
`docs/ARTFLOW_PILOT_INVENTORY.md`. Candidate purposes in that report are
coverage hypotheses only, not artwork metadata or classifications.
