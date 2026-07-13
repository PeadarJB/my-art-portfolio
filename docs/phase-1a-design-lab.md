# Phase 1A — Creative Direction & Design Laboratory

> Creative direction: **The Animated Monograph** — an editorial contemporary-art
> portfolio that feels authoritative and spacious, with controlled tactile movement
> and occasional atmospheric exhibition environments. The artwork, not the interface,
> supplies the colour and drama.
>
> This phase is **exploratory and fully isolated**. No production page changed
> visually or functionally.

---

## 0. Approved (Phase 1B) — decision record

The recommendations below were reviewed and **approved**, and promoted into the
production design system in Phase 1B (see
`docs/phase-1b-production-design-system.md`). This resolves the outstanding
decisions in §12:

- **Typography:** **Newsreader + Manrope** approved as the production pairing.
- **Default background:** **warm paper `#f2eee6`** approved as the default
  (pure white rejected as the default; kept only as a lab comparison).
- **Atmospheric environment:** **soot `#171412`** with bone approved for
  atmospheric/exhibition environments (currently applied to the lightbox).
- **Accent:** **cadmium** approved as the principal interactive accent; ochre
  restricted to large graphic marks; ultramarine/mineral held as reserved,
  series-aware secondary accents.
- **Instrument Serif:** **deferred** to a later series-level decision; it stays
  confined to `/design-lab` and is not a production font.
- **Existing images retained** for the build; **photo cleanup and gallery
  visualisation are deferred** to a later content phase.

This laboratory remains intact as the reference artefact and does **not** inherit
the production tokens, so the original A/B/C comparison is preserved.

---

## 1. Files created / changed

**Created (all new, all under the isolated route or docs):**

| File | Purpose |
| ---- | ------- |
| `src/app/design-lab/layout.tsx` | Nested layout: loads experimental fonts (Newsreader, Manrope, Instrument Serif) via `next/font/google`; sets `robots: noindex, nofollow`; wraps children in the scoped `.design-lab` container. |
| `src/app/design-lab/page.tsx` | Assembles all specimens + type scale (§2), environments (§7), responsive notes (§9). |
| `src/app/design-lab/design-lab.css` | All experimental tokens + styles, every selector nested under `.design-lab`. Imported **only** by the nested layout. |
| `src/app/design-lab/contrast.ts` | Local WCAG 2.x contrast utility (no dependency). |
| `src/app/design-lab/lab-content.ts` | Selects real artworks via the existing query helper; holds clearly-labelled prototype copy. |
| `src/app/design-lab/components/typography-specimen.tsx` | Systems A/B/C side by side. |
| `src/app/design-lab/components/palette-specimen.tsx` | Swatches, grounds, calculated contrast table. |
| `src/app/design-lab/components/artwork-layouts.tsx` | Layout tokens + three composition recipes + labelled crop. |
| `src/app/design-lab/components/component-specimen.tsx` | Interface controls (client). |
| `src/app/design-lab/components/motion-specimen.tsx` | CSS-only motion demos (client). |
| `src/app/design-lab/components/decision-panel.tsx` | Read-only design-review summary. |
| `docs/phase-1a-design-lab.md` | This document. |

**Changed:** none outside the new `src/app/design-lab/` tree and this doc. No production component, route, style, config, schema, or data file was edited. No dependency added or removed.

---

## 2. How to access the route

```bash
npm run dev
# then open:
http://localhost:3000/design-lab
```

The route is intentionally **not linked** anywhere on the site. It is `noindex, nofollow`, absent from `src/app/sitemap.ts` and unaffected by `src/app/robots.ts`. The global site header still renders above it (it lives in the untouched root layout) but contains no link to it.

---

## 3. Isolation — how production stays untouched

- **CSS scope:** every rule in `design-lab.css` is prefixed with `.design-lab`; all experimental custom properties are declared on `.design-lab` (or nested `[data-lab-env]`), never on `:root`. They cannot reach `globals.css`.
- **Import boundary:** `design-lab.css` is imported only by `src/app/design-lab/layout.tsx`, never by the root layout.
- **Fonts:** experimental fonts are loaded in the nested layout and applied via CSS variables on the `.design-lab` wrapper; the production Sora/Spectral setup in `src/app/layout.tsx` is unchanged. System A in the specimen reuses the existing `--font-serif`/`--font-sans` variables already on `<body>` — nothing extra is loaded for it.
- **Theme:** the production Zustand theme store and no-flash script are untouched. Environment demos use scoped `data-lab-env` attributes only — they do not read or write the global theme.
- **Data/schema:** real artworks come through `getArtworkByYearAndId` (existing helper); no records are duplicated and the Zod schema is not extended. Non-schema strings are marked `[PROTOTYPE COPY]` and live only in `lab-content.ts`.

---

## 4. Font systems tested (§1)

| System | Display | Interface | Accent | Verdict |
| ------ | ------- | --------- | ------ | ------- |
| A — baseline | Spectral | Sora | — | Works, but Sora reads slightly "app/tech"; Spectral display is light at hero scale. |
| **B — recommended** | **Newsreader** | **Manrope** | — | Editorial authority + quiet UI + real italic for artwork titles + strong accent glyph coverage. |
| C — expressive | Newsreader | Manrope | Instrument Serif (series titles only) | Adopt C's accent rule *on top of* B; reserve Instrument Serif strictly for series/exhibition titles. |

All three are shown with real strings: wordmark, tagline (`Painting, objects and imagined landscapes`), `Upland Folk`, three real titles including the longest (`Indian Boy Breaking Rocks for the Rest of his Life`), real medium/dimensions, the verbatim About-page statement, a CV entry, and Irish/Spanish glyphs (`Dún Laoghaire`, `Co. Clare`, `Gimnasio de Arte y Cultura`, `Mexico City`). `display: swap` preserved throughout.

---

## 5. Tokens tested

- **Type scale (§2):** `--lab-type-{hero,page,section,artwork,body,ui,meta}`, all `clamp()`-based within the brief's ranges (52–144, 42–96, 30–64, 20–36, 17–21, 15–17, 12–14 px).
- **Palette (§3):** editorial light (`paper`, `paper-raised`, `ink`, `graphite`, `muted`, `line`), atmospheric dark (`soot`, `bone`, `dark-muted`), accents (`cadmium`, `ultramarine`, `mineral`, `ochre`), plus a pure-white comparison ground.
- **Spacing/layout (§4):** `--lab-gutter`, `--lab-canvas-max` (106rem), `--lab-reading-max` (64ch), section/art/meta gaps, `--lab-radius-image: 0`, `--lab-radius-control: .2rem`, `--lab-radius-overlay: .3rem`, `--lab-line-width: 1px`, `--lab-shadow-content: none`, `--lab-shadow-overlay`.
- **Motion (§8):** `--lab-motion-{micro,control,transition,editorial}`, `--lab-ease-enter`, `--lab-ease-standard`.

---

## 6. Artwork examples selected (all real)

| Category | Work | Record |
| -------- | ---- | ------ |
| Portrait | Escape from the Cave | 2022 · 1000×1754 |
| Landscape | Dismal Day on the Beach | 2019 · 1000×635 (160cm × 240cm) |
| Square-ish | Dawn | 2022 · 1000×1036 |
| Predominantly dark | Jungle at Nighttime | 2019 · 1000×1535 |
| Predominantly pale | Clouds | 2019 · 1000×1149 |
| Highly saturated | Defiance of King Puck | 2022 · 1000×1268 |
| Artist-made sculptural frame | Escape from the Cave (doubles w/ portrait) | medium: "Oil on board in artist made frame" |
| Installation / contextual image | **None exists in the repo** | Upland Folk title graphic SVG used for series identity instead |

Dark/pale/saturated selections were made after viewing the actual images, but the reviewer should still confirm them (see outstanding decisions).

---

## 7. Contrast calculations (§3)

Ratios are computed at render time by `contrast.ts` (WCAG 2.x), not asserted. Key results (foreground on background):

| Pair | Ratio | Grade |
| ---- | ----- | ----- |
| ink `#191714` on paper `#f2eee6` | ~14.8:1 | AAA |
| graphite `#595550` on paper | ~6.3:1 | AA |
| muted `#6f6a64` on paper | ~4.6:1 | AA |
| ink on pure white | ~16.9:1 | AAA |
| bone `#eee8de` on soot `#171412` | ~14.9:1 | AAA |
| cadmium `#b74034` on paper | ~4.7:1 | AA |
| ultramarine `#31578a` on paper | ~4.9:1 | AA |
| mineral `#4e6551` on paper | ~4.9:1 | AA |
| **ochre `#b98328` on paper** | **~2.9:1** | **fail (normal text)** → large/graphic marks only |
| white on cadmium (filled action) | ~3.2:1 | AA large only |

> Exact figures render live in the palette specimen; the table above is indicative. The **ochre gate** is enforced by direction: ochre is never used for body/metadata text.

---

## 8. Container-query usage (§5)

Each reusable recipe (`.lab-recipe`) sets `container-type: inline-size` and reshapes on its **own** width, not the viewport:

- Recipe A (anchor + satellites): `@container recipe (min-width: 44rem)` → 2fr/1fr with a deliberate empty region. Fallback: `@supports not (container-type…)` + `@media (min-width: 60rem)`.
- Recipe B (vertical conversation): `@container recipe (min-width: 40rem)`.
- Recipe C (exhibition plate): `@container recipe (min-width: 48rem)`.

Full aspect ratios are preserved everywhere; the single art-directed crop is explicitly tagged `CROP`.

---

## 9. Motion demonstrations & reduced-motion (§8)

Demos (CSS only, no library): image mask/clip-path reveal, text fade + ≤24px rise, hover enlarge 1.5% (transform), animated underline, mobile-menu open, editorial→atmospheric cross-fade, overlay entrance (fade + 2% scale), and a native View-Transitions feasibility flag. A "Replay entrances" button remounts the subtree to re-run entrances (no JS tween).

Constraints honoured: opacity/transform only, ≤24px entrance distance, ≤6 staggered items, no perpetual motion, no scroll hijacking, no pre-navigation delay.

**Reduced motion:** a `@media (prefers-reduced-motion: reduce)` block replaces every mask/rise/scale/stagger with a short opacity fade (`--lab-motion-micro`), zeroes stagger delays, disables the hover scale, and removes the `view-transition-name`. This reuses the same principle as the global reduced-motion rule in `globals.css`.

---

## 10. Current recommendation

| Decision | Recommendation |
| -------- | -------------- |
| Typography | **System B (Newsreader + Manrope)**; add Instrument Serif for series titles only. |
| Default background | **Warm paper `#f2eee6`** (pure white kept as alternate). |
| Series-dark background | **Soot `#171412`** with a soft vignette — an exhibition room, not dark mode. |
| Accent strategy | **Cadmium primary**, one accent at a time; ochre for large/graphic marks only. |
| Radius & shadow | **Square images (0)**, ~0.2rem on controls, shadows on overlays only. |
| Layout | Anchor+satellites, Vertical conversation, Exhibition plate (Grid + container queries). |
| Motion | **Low–moderate, tactile, CSS-first**; native View Transitions as progressive enhancement. |

---

## 11. Rejected / weaker alternatives

- **System A (Spectral + Sora):** viable but less authoritative; keeps the current slightly app-like UI feel.
- **Pure-white default ground:** clean but colder; loses the paper/gallery warmth. Retained only for comparison.
- **Pill buttons, gradient CTAs, card shadows** (the Phase-0 "app-like" signatures): explicitly excluded here.
- **Animation library:** not needed — everything demonstrated is CSS + native View Transitions.
- **Simultaneous multi-accent palette:** rejected; accents must appear one at a time.

---

## 12. Decisions still outstanding (human judgement)

1. Warm paper vs pure white as the true default (needs eyes on real screens).
2. Confirm dark/pale/saturated categorisations against the actual paintings.
3. Whether Instrument Serif's single 400 weight suffices at hero scale.
4. Ultramarine vs mineral roles once real page compositions exist.
5. Whether a real installation photograph can be sourced (none exists today).

---

## 13. Verification

| Command | Result |
| ------- | ------ |
| `npm run typecheck` | ✅ pass (0 errors) |
| `npm run lint` | ✅ pass (0 errors, 0 warnings) |
| `npm run test` | ✅ pass (2 files, 11 tests) — unchanged |
| `npm run build` | ✅ pass — see route table below |

**Route-count change:** the build adds exactly the new `/design-lab` route (static). No production route was added, removed, or altered. `sitemap.xml` still lists only the 5 static routes + 57 artwork URLs (design-lab excluded). `robots.txt` unchanged.

**Confirmation — production unchanged:** existing public pages retain their exact classes, styles, and behaviour. Nothing in `globals.css`, root `layout.tsx`, components, content, config, or the schema was modified. The only additions are the isolated `design-lab` tree and docs.

---

## 14. Screenshots

Automated screenshot/headless tooling is **not available in this environment**, so captures were not produced here. To review visually:

1. `npm run dev` → open `http://localhost:3000/design-lab`.
2. Capture at widths **390px**, **768px**, and **1440px** (browser responsive mode).
3. Toggle OS "Reduce motion" and reload to verify the reduced-motion path.

Sections that most need human screenshots: **Typography (A/B/C)**, **Palette grounds** (paper vs white vs soot), **Recipe C (atmospheric exhibition plate)**, **Interface controls** (focus states via Tab), and the **Motion** section (Replay + Reduce-motion).
</content>
