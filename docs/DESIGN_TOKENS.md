# Design Tokens

## Token Layers
1. Primitive tokens: raw color, spacing, radius, shadow, and motion values.
2. Semantic tokens: role-based aliases (`--text-main`, `--bg-canvas`, `--bg-card`,
   `--accent-main`, `--border-soft`, `--link`, `--focus-ring`) resolved per theme.
3. Component tokens: scoped overrides where needed (e.g. the lightbox redefines
   the semantic tokens locally to render an atmospheric soot environment).

## Current Token Source
- `src/app/globals.css`

## Design Direction (approved — Phase 1A/1B)
- **The Animated Monograph** — editorial, spacious, artwork-led.
- Fonts: **Newsreader** (display/editorial) + **Manrope** (interface/body),
  via `next/font/google` with `display: swap`.
- Light environment: **warm paper** (`--color-paper #f2eee6`) with ink text.
- Dark environment: **soot & bone** (`--color-soot #171412` / `--color-bone`).
- Principal accent: **cadmium** (`--color-cadmium #b74034`); `--color-cadmium-light`
  for legible links/accents on soot. Ultramarine/mineral are reserved,
  series-aware secondaries; ochre is for large graphic marks only (never body
  text on paper).
- Shape: square artwork edges (`--radius-image: 0`); minimal control/overlay
  radii. Elevation: content is flat; shadow is reserved for overlays.
- Motion: low-to-moderate, CSS-first (`--motion-*`, `--ease-*`).

## Theme Model
- `data-theme="light"` and `data-theme="dark"` on `<html>`.
- Theme state persisted via Zustand store (`lib/store/ui-store.ts`), key
  `portfolio-ui`, applied before paint by the inline no-flash script.

## Rules
- Add/extend tokens before adding one-off hardcoded values.
- Prefer semantic tokens in component styles; keep legacy aliases pointing at the
  current scale rather than creating a competing system.
- Maintain WCAG-AA contrast and readability across both themes.
- Let the artwork supply most of the page colour; use one accent at a time.
