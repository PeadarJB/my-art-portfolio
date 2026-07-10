# Design Tokens

## Token Layers
1. Primitive tokens: raw color, spacing, radius, shadow values.
2. Semantic tokens: role-based aliases (`--text-main`, `--bg-card`, `--accent-main`).
3. Component tokens: scoped overrides where needed.

## Current Token Source
- `app/globals.css`

## Theme Model
- `data-theme="light"` and `data-theme="dark"` on `<html>`.
- Theme state persisted via Zustand store (`lib/store/ui-store.ts`).

## Rules
- Add tokens before adding one-off hardcoded values.
- Prefer semantic tokens in component styles.
- Maintain visual contrast and readability across themes.
- Keep the palette warm, high-energy, and professional.
