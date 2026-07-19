# Phase 3 — V2 Gallery Redesign

Implemented from the "Art portfolio design system" handoff bundle
(`design_handoff_v2_gallery_redesign`, July 2026). The V2 system replaces the
warm-paper/serif "Animated Monograph" editorial design with a gallery-grade
language. The handoff's `.dc.html` prototypes were treated as high-fidelity
references; this phase recreated them with the repo's established patterns
(server components + small client components, tokens in `globals.css`,
`next/image`, typed content in `content/`).

## Screens
- **Home** (`src/app/page.tsx`) — once-per-session intro splash; full-bleed
  randomized hero carousel (per-series shuffle, series-interleaved playlist,
  6s autoplay, arrow keys, click-to-advance, soot crossfade on 2022 works);
  chapter menu with one full-width row per series (Upland Folk row in soot);
  footer.
- **Gallery** (`src/app/gallery/page.tsx` + `components/gallery-view.tsx`) —
  per-series slideshow (100dvh, no scroll) with chapter tabs, `?y=YYYY` deep
  links, invisible prev/next zones, keyboard arrows, and a "See All" sheet
  grid. The Upland Folk chapter opens on a series-context intro slide and
  renders the whole page in the soot room.
- **Artwork detail** (`components/detail-view.tsx`) — 100dvh expanded plate,
  prev/next zones + arrow keys wrapping within the year, counter, enquiry.
- **About / CV / Contact / 404** — ruled sub-bar pages per the prototypes.

## Structural decisions
- No global theme toggle any more: the soot room is contextual (Upland Folk
  only), driven by `.room.is-soot` room tokens — see `docs/DESIGN_TOKENS.md`.
- No Google fonts: the single grotesque stack ships zero font bytes.
- Removed with the old design: lightbox + trigger, theme store/sync/toggle,
  card grid, homepage curation module, and the phase-1A design lab (all
  recoverable from git history).
- The broken `UplandFolk-*-large.svg` logos (empty `<image>` hrefs, flagged in
  the handoff) were removed; the handoff's `UplandFolk-white.png` (700×300) is
  used on the gallery intro slide.
- `content/artworks.ts` collections now carry `name` and `description`
  (navigation is series-name-first). Series names for 2019–2021 are
  provisional pending confirmation by the artist.
- Playlist interleaving lives in `lib/playlist.ts` with an injectable RNG so
  `tests/playlist.test.ts` runs deterministically.

## Accessibility
- Custom cursor is fine-pointer only; native cursor restored on touch.
- Intro splash and autoplay are disabled under `prefers-reduced-motion`; the
  splash is also suppressed pre-paint for repeat visitors via an inline
  script setting `data-intro-seen` on `<html>`.
- All colour pairings in both rooms pass WCAG AA; axe (WCAG 2.1 A/AA) runs
  across all screens in `e2e/a11y.spec.ts`.
