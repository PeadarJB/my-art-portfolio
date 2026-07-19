# Artflow configuration

Runtime configuration is supplied with `ARTFLOW_` environment variables so
the Google Drive for Desktop path and provider credentials remain untracked.
The repository defaults live in `src/artflow/config.py` and mirror the existing
website variant generator in `scripts/optimize-images.mjs`.

`pilot-selection.json` contains Drive file references for the representative
pilot. It is inventory data only; it does not assign artwork facts or approve
processing recipes.

