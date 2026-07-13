# Phase 1B — Production Design-System Integration

> Promotes the approved **Animated Monograph** foundations (Phase 1A, System B)
> into the production design system: Newsreader + Manrope, warm-paper light and
> soot/bone dark environments, cadmium accent, square artwork edges, flattened
> elevation, and editorial controls.
>
> This phase is deliberately **transitional**. The global visual language and
> site shell are now live, while the homepage, gallery, artwork-detail, CV and
> contact pages remain structurally intact awaiting their dedicated redesign
> phases.

---

## 1. Files modified

| File | Change |
| ---- | ------ |
| `src/app/globals.css` | Full rewrite of the token layer + shell/component styling onto the approved foundations. Selectors and structure preserved; values re-pointed. |
| `src/app/layout.tsx` | Production fonts swapped: `Sora`→`Manrope`, `Spectral`→`Newsreader` (both via `next/font/google`, `display: swap`). Body `className` updated to the new font variables. |
| `components/site-header.tsx` | Removed the generic `Artist Portfolio` brand subtitle from the global brand lock-up. |
| `src/app/page.tsx` | Removed the decorative `.hero-glow` element that competed with the paintings. |
| `src/app/opengraph-image.tsx` | Replaced the teal→ochre→coral gradient card with warm paper / ink / cadmium. Text unchanged. |
| `eslint.config.mjs` | Added `.netlify/**` (generated deploy output) to `ignores`, alongside the existing `.next/**`. Restores a clean `npm run lint`. |
| `docs/phase-1a-design-lab.md` | Appended an **Approved (Phase 1B)** decision record. |
| `docs/DESIGN_TOKENS.md` | Updated token source description and palette guidance to the editorial system. |
| `docs/phase-1b-production-design-system.md` | This document. |

**Not modified:** any artwork data, the Zod content schema, any image file, the
theme store (`lib/store/ui-store.ts`), the lightbox behaviour/JSX, routes, the
sitemap/robots, `netlify.toml`, or the entire `src/app/design-lab/` tree. No
dependency was added or removed.

---

## 2. Typography changes

Production pairing is now **Newsreader (display/editorial)** + **Manrope
(interface/body)**, both self-hosted through `next/font/google` with
`display: swap` preserved and stable fallback stacks.

```css
--font-display: var(--font-newsreader), Georgia, "Times New Roman", serif;
--font-body:    var(--font-manrope), "Segoe UI", Arial, sans-serif;
```

Weights loaded (only what the production interface uses):

| Face | Weights | Italic |
| ---- | ------- | ------ |
| Newsreader | 400, 500, 600 | none |
| Manrope | 400, 500, 600, 700 | none |

- **Newsreader** controls: brand name, page titles (`.headline`), section/card
  headings (`.year-summary h2`, `.year-card h3`, `.series-intro-copy h3`,
  `.detail-meta-card h2`, `.cv-card h2`, `.lightbox-meta h3`) and artwork titles
  (`.artwork-card h3` — newly promoted from the sans face to the display face).
- **Manrope** controls: navigation, buttons/controls, metadata, dates,
  dimensions, captions, eyebrows and all utility/body text.
- Editorial prose keeps a readable measure (`--reading-max: 64ch`) and is **not**
  forced into the display face.
- **Instrument Serif is not a production font.** It remains confined to
  `/design-lab` for a future series-level decision.
- `.headline` and `.brand-title` received explicit display weights (500 / 600)
  because Newsreader at 400 reads light at large sizes; this avoids the "light
  hero" issue noted for Spectral in Phase 1A.

---

## 3. Token mapping (old → new)

The three-layer architecture (primitive → semantic → component) is retained.
Rather than introduce a competing system, legacy semantic/primitive names were
**re-pointed** so existing rules inherit the new language.

### Primitives (replaced)

| Old primitive | Status | New primitive(s) |
| ------------- | ------ | ---------------- |
| `--color-ink-900 #181413`, `--color-ink-700` | removed | `--color-ink #191714`, `--color-graphite #595550`, `--color-muted #6f6a64` |
| `--color-paper-50 #f8f4ef`, `--color-paper-100 #f2e8dc` | removed | `--color-paper #f2eee6`, `--color-paper-raised #f8f5ef` |
| `--color-cyan-500 #1aa7b5` | removed | `--color-cadmium #b74034` (primary accent) |
| `--color-red-500 #dd5f4b` | removed | (accent role consolidated to cadmium) |
| `--color-green-500 #24866d` | removed | `--color-mineral #4e6551` (reserved) |
| `--color-sun-300 #f4ad42` | removed | `--color-ochre #b98328` (graphic marks only) |
| `--btn-from`, `--btn-to` (gradient) | removed | none — gradient CTA language retired |
| — | added | `--color-soot #171412`, `--color-soot-raised #1f1b18`, `--color-bone #eee8de`, `--color-dark-muted #bdb4a8`, `--color-dark-line #3a3430`, `--color-ultramarine #31578a`, `--color-cadmium-light #d98a80` |

### Semantic (names kept, values moved)

| Token | Light (was → now) | Dark (was → now) |
| ----- | ----------------- | ---------------- |
| `--bg-canvas` | canvas gradient → `--color-paper` | radial gradient → `--color-soot` |
| `--bg-card` / `--bg-card-strong` | translucent white → `--color-paper-raised` | translucent ink → `--color-soot-raised` |
| `--text-main` | ink-900 → `--color-ink` | `#faf2e8` → `--color-bone` |
| `--text-muted` | `#5f4f4d` → `--color-muted` | `#d2c6bb` → `--color-dark-muted` |
| `--accent-main` | cyan → `--color-cadmium` | teal → `--color-cadmium-light` |
| `--accent-alt` | coral → `--color-ultramarine` (reserved, unused in shell) | coral → `--color-ultramarine` |
| `--border-soft` | ink 14% → `--color-line` | bone 18% → `--color-dark-line` |
| `--link` / `--focus-ring` | teal → `--color-cadmium` | teal → `--color-cadmium-light` |

### Shape / elevation / motion (legacy aliases re-pointed)

| Legacy alias | Now resolves to |
| ------------ | --------------- |
| `--radius-sm` (10px) | `--radius-image` = `0` |
| `--radius-md` (20px) | `--radius-control` = `0.2rem` |
| `--radius-lg` (32px) | `--radius-overlay` = `0.3rem` |
| `--shadow-soft` | `--shadow-content` = `none` |
| `--shadow-strong` | `--shadow-overlay` = `0 1rem 3rem rgb(0 0 0 / 0.16)` |
| `--transition-fast` (180ms) | `var(--motion-control) var(--ease-standard)` (240ms) |
| `--transition-slow` (420ms) | `var(--motion-editorial) var(--ease-enter)` (800ms) |

New layout tokens added: `--gutter-page: clamp(1.25rem, 4vw, 6rem)`,
`--canvas-max: 106rem`, `--reading-max: 64ch`, `--line-width: 1px`.

---

## 4. Theme changes

Preserved unchanged: `data-theme` on `<html>`, the Zustand store, the
`portfolio-ui` localStorage key, the inline no-flash script,
`suppressHydrationWarning`, `ThemeSync`, and the mounted guard in `ThemeToggle`.

- **Light** is now flat **warm paper** (`#f2eee6`), not the decorative
  canvas gradient.
- **Dark** is now **soot** (`#171412`) with **bone** text — an exhibition
  environment, not a blue-black "dark mode".
- Teal/coral gradient language, the radial dark gradient, and the hero glow are
  all removed.
- Series-specific automatic theme switching is **not** implemented yet, but the
  semantic tokens and the lightbox soot environment (below) demonstrate the
  pattern so it can be added in the Upland Folk phase.

---

## 5. Shape and elevation changes

- Artwork images are square (`--radius-image: 0`): `.artwork-image-shell`,
  `.detail-image-shell` and `.lightbox-image-wrap` are explicitly square-edged.
- Content panels use a barely-there radius (`--radius-control: 0.2rem`); larger
  panels/overlays use `--radius-overlay: 0.3rem`.
- Ordinary content shadows are gone (`--shadow-soft → none`). Depth is reserved
  for overlays: the lightbox, the skip-link, and menus (`--shadow-overlay`).
- Hairline borders (`--line-width`) and subtle raised-paper backgrounds keep
  unfinished page layouts legible without cards or shadows.

---

## 6. Header / navigation changes

- **Brand** shows `Peadar Jolliffe-Byrne` only; the generic `Artist Portfolio`
  subtitle was removed. No new tagline was added. Brand set in Newsreader 600.
- **Desktop nav**: pill backgrounds removed. Links are quiet Manrope; active
  state is a **persistent cadmium hairline** under the label plus `aria-current`
  (a non-colour signal), and hover grows the same rule. Sticky behaviour and
  keyboard focus visibility retained.
- **Theme toggle** restyled from a pill into a restrained bordered utility
  control (square corners, no lift, no accent flood).
- **Mobile nav**: existing show/hide, Escape handling and `aria-expanded`
  preserved. Pills removed; typography/spacing improved; a reliable
  CSS `@keyframes nav-drop` (opacity + small translate) plays when the menu
  opens, and is neutralised under `prefers-reduced-motion`. The full
  future-screen menu is deferred.

---

## 7. Button / link changes

- **Gradient CTA language retired.** `.btn` lost `border-radius: 999px`, the
  gradient fill, the box-shadow, uppercase tracking and the hover lift.
- `.btn-primary`: solid ink (light) / bone (dark) with text inverted off the
  page background, animating to a **cadmium** fill with white text on hover
  (white-on-cadmium ≈ 5.5:1, AA). Filled actions are reserved for genuine
  actions/enquiries.
- `.btn-secondary`: quiet outlined control (transparent, hairline border, border
  darkens on hover).
- **Text links** (`.inline-link`): cadmium with a permanent fine underline
  (never colour alone), darkening to ink on hover.
- **Enquiry behaviour and email handling are unchanged** — `EnquiryButton` was
  restyled only through its `.btn.btn-primary` classes; no JSX/logic edit.

---

## 8. Transitional card / panel treatment

All the following now use quiet borders, subtle raised-paper backgrounds, a
near-square radius and **no shadow**, keeping their padding and structure until
their dedicated redesign:

| Structure | Deferred final treatment |
| --------- | ------------------------ |
| Year cards (`.year-card`) | To be replaced by an editorial year index. |
| Artwork cards (`.artwork-card`) | To become border-light plates; title-italic and layout recipes deferred. |
| Detail metadata cards (`.detail-meta-card`) | To become a definition-list column, not cards. |
| CV cards (`.cv-card`) | To become an editorial CV list. |
| Contact card (`.contact-card`) | Shadow removed; to become an editorial contact block. |
| Series introduction (`.series-intro`) | To become the Upland Folk atmospheric intro. |

---

## 9. Motion-token changes

Promoted to production and used only for control/link feedback, nav states,
theme changes and existing small hover responses:

```css
--motion-micro: 150ms;  --motion-control: 240ms;
--motion-transition: 520ms;  --motion-editorial: 800ms;
--ease-enter: cubic-bezier(.22, 1, .36, 1);
--ease-standard: cubic-bezier(.4, 0, .2, 1);
```

The legacy `--transition-fast` / `--transition-slow` aliases now resolve to
these. **No** page transitions, scroll-triggered entrances, shared-element
transitions or large reveal sequences were added. The global
`prefers-reduced-motion` block is preserved and neutralises the one new
entrance animation (`nav-drop`).

---

## 10. Lightbox

Behaviour is **untouched** (focus trap, keyboard nav, Escape, focus
restoration, `inert` background, scroll lock). Chrome only was restyled: the
shell is now an **atmospheric soot room in both themes** — it locally redefines
the semantic tokens (`--text-main`, `--bg-canvas`, `--border-soft`, `--link`,
`--accent-main`, `--focus-ring`) so the nested Close/Prev/Next buttons, the
counter, the "View detail page" and enquiry buttons all adapt automatically to
bone-on-soot without a single JSX edit. Controls are square with ≥44px targets;
the artwork stays square; only the overlay shadow is used. This is the template
for series-aware environments later.

---

## 11. Items intentionally deferred

- Full homepage, gallery, artwork-detail, CV and contact **layout** redesigns.
- Artwork-title **italic** treatment (would require loading a Newsreader italic
  file; roman is used for now).
- The **full future-screen mobile menu**.
- **Series-specific automatic theme switching** (tokens are prepared).
- Secondary accents (**ultramarine**, **mineral**) — declared but unused in the
  global shell, awaiting real series compositions.
- **Instrument Serif** as a production series-title face.
- **Image cleanup / gallery visualisations** and any photographic
  presentation variants.
- A typographically-branded OpenGraph card (palette fixed; Satori font-embedding
  deferred so the OG runtime stays on the safe system fallback).
- Ultra-wide (> ~1700px) alignment between the full-bleed sticky header and the
  `--canvas-max`-capped content column (see §13).

---

## 12. Confirmation — images, data and schema unchanged

- No file under any image directory was edited, added or removed.
- No artwork record or `content/` data was touched.
- The Zod content schema (`lib/content-schema`) is unchanged.
- Transparent Upland Folk assets and their light/dark swap rules are unchanged.
- `next/image` sources, dimensions, aspect ratios, `object-fit`, priority and
  lazy-loading behaviour are all unchanged. No CSS drop shadow, artificial
  background or coloured frame was applied to any artwork.

---

## 13. Known visual inconsistencies before page-specific redesigns

1. **Transitional cards still read as cards.** Year/artwork/CV/detail panels are
   flatter and quieter but retain bordered card structure until their phases.
2. **Home hero is minimal.** With the glow removed and no hero redesign yet, the
   homepage hero is plain type on paper — intentional placeholder.
3. **Artwork titles are roman, not italic.** The approved editorial italic is
   deferred with the gallery/detail redesign.
4. **Ultra-wide header alignment.** The sticky header is full-bleed with page
   gutters while body content is capped at `--canvas-max` and centred; beyond
   ~1700px the brand sits slightly left of the content column.
5. **Detail/lightbox artwork framing** keeps a neutral hairline for separation;
   whether artworks sit frameless is a page-redesign decision.
6. **Eyebrow labels** (e.g. the homepage `Artist Portfolio` eyebrow) are page
   content and will be revisited during page redesigns; only the global brand
   lock-up subtitle was demoted in this phase.

---

## 14. Verification

| Command | Result |
| ------- | ------ |
| `npm run typecheck` | ✅ pass (0 errors) |
| `npm run lint` | ✅ pass (0 errors, 0 warnings) after ignoring `.netlify/**` |
| `npm run test` | ✅ pass (unchanged content/query suites) |
| `npm run build` | ✅ pass — 69 static pages, route count identical to Phase 1A |

- Route set unchanged: `/`, `/about`, `/contact`, `/cv`, `/gallery`,
  `/gallery/[year]/[artworkId]` (57 works), `/design-lab`, `/opengraph-image`,
  `/robots.txt`, `/sitemap.xml`, `/_not-found`.
- `/design-lab` remains `noindex, nofollow`, absent from nav and sitemap.
- No dependency added; no artwork data, schema or image file changed.
- Theme persistence, no-flash script, lightbox keyboard/focus behaviour and
  reduced-motion support all preserved.
