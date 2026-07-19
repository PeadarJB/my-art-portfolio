# Design Tokens

## Token Layers
1. Primitive tokens: the fixed V2 palette from the gallery-redesign handoff
   (`--color-*` in `src/app/globals.css`).
2. Room tokens: role-based aliases (`--room-bg`, `--room-ink`, `--room-muted`,
   `--room-accent`) resolved per room. `.room.is-soot` swaps a page (or the
   home hero stage) into the Upland Folk dark room with a 600ms crossfade;
   components read room tokens and never branch on palette themselves.

## Current Token Source
- `src/app/globals.css`

## Design Direction (approved — V2 Gallery Redesign)
- Gallery-grade language: **white ground** (`#ffffff`) with near-black ink
  (`#131313`), hairline rules (1px, ink; secondary rules `#dcdcdc`), and
  **cadmium** (`#b74034`) as the only accent.
- The **soot room** (`#171412` / bone `#eee8de` / muted `#bdb4a8` / lifted
  accent `#d98a80` / rules `#3a3430`) is reserved exclusively for the Upland
  Folk (2022) series — the gallery chapter, its detail plates, its chapter
  row, and hero slides showing 2022 works.
- Type: a **single neutral grotesque** (`'Helvetica Neue', Helvetica, Arial,
  sans-serif`), weights 400/600 only. No serif anywhere. Uppercase
  letter-spaced bars (12px/0.08em), tabular zero-padded counters, italic
  artwork titles in caption lines.
- Structure: page gutter `clamp(16px, 2.5vw, 32px)`; no border radius, no
  cards; shadows only on soot-room plates.
- Motion: reveals ≤24px translate on `cubic-bezier(0.22, 1, 0.36, 1)`; plate
  crossfades 420–800ms; room crossfade 600ms; hover colour 160ms.
- Custom circle cursor (26px, difference-blended) on fine pointers only.

## Theme Model
- No user-facing theme toggle. The white gallery is the only theme; soot is a
  contextual room, not a preference. The former Zustand-persisted
  `data-theme` model was retired with the V2 redesign.

## Rules
- Add/extend tokens before adding one-off hardcoded values.
- Prefer room tokens in component styles so soot support comes for free.
- Maintain WCAG-AA contrast in both rooms (all V2 pairings pass AA).
- Let the artwork supply most of the page colour; cadmium is the only accent.
