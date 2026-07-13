# Phase 2 — Global Shell Completion & Homepage Transformation

> Completes the global shell (ultra-wide header alignment + a global footer) and
> rebuilds the homepage from its transitional text-hero-plus-cards state into a
> finished, artwork-led landing experience: the opening pages of an artist
> monograph followed by entry into a small digital exhibition.
>
> Direction: **The Animated Monograph** (approved Phase 1A/1B). Production
> foundations — Newsreader + Manrope, warm paper / soot & bone, cadmium accent,
> square edges, no gradients/pills/content-shadows, low-to-moderate CSS-first
> motion — are all preserved and reused; no new tokens system, no dependency.

---

## 1. Files created and modified

### Created

| File | Purpose |
| ---- | ------- |
| `content/homepage.ts` | Typed homepage curation (hero, featured series, selected works, archive ordering). References works by `year` + `id`, resolves through the existing query helper, throws at module load on a bad reference. No artwork records duplicated. |
| `lib/enquiry.ts` | Single source of truth for the enquiry email + `mailto:` builder, so the hard-coded fallback lives in exactly one place. Shared by `EnquiryButton` and the footer. |
| `components/site-footer.tsx` | Restrained, editorial global footer (Server Component). |
| `components/home/artwork-figure.tsx` | Lightweight, card-free artwork presentation. The whole block is one link; caption is quieter than the art; alt comes from data; adapts to paper and soot via tokens. |
| `components/home/home-hero.tsx` | Opening hero (type column + one principal artwork). |
| `components/home/home-introduction.tsx` | Editorial artist introduction (existing About copy). |
| `components/home/featured-series.tsx` | Featured Upland Folk preview — local soot exhibition environment. |
| `components/home/selected-work-grid.tsx` | Curated selected-work composition (anchor + satellites, vertical conversation). |
| `components/home/archive-index.tsx` | Editorial archive index (rows, not cards). |
| `components/home/home-contact.tsx` | Closing enquiry invitation. |
| `tests/homepage.test.ts` | 8 tests validating the curation configuration. |
| `playwright.config.ts`, `e2e/shell.spec.ts`, `e2e/a11y.spec.ts` | Browser + axe checks (added post-phase; see `docs/browser-testing.md`). |
| `docs/phase-2-homepage-and-shell.md`, `docs/browser-testing.md` | This document + the browser-testing guide. |

### Modified

| File | Change |
| ---- | ------ |
| `src/app/page.tsx` | Rebuilt: now composes the six home sections. Remains a Server Component. |
| `src/app/layout.tsx` | Renders `<SiteFooter />` between `<main>` and the lightbox portal. |
| `components/site-header.tsx` | Header content wrapped in a centred `.site-header-inner` container (alignment fix). No behavioural change. |
| `components/enquiry-button.tsx` | Uses `buildEnquiryHref()` from `lib/enquiry.ts`. **Rendered markup is byte-identical** — same class, same label, same href. |
| `src/app/globals.css` | Added HOMEPAGE and FOOTER sections and the header surface/inner split; removed the now-dead home classes (`.hero-grid`, `.cta-row`, `.page-home`, `.year-summary`, `.year-cards`, `.year-card*`); added `.sr-only`, `.section-eyebrow`, and `body { overflow-x: clip }`. |

**Not modified:** any artwork image, the artwork Zod schema, any artwork record
in `content/artworks.ts`, the theme store / `portfolio-ui` key / no-flash script
/ `suppressHydrationWarning`, the lightbox behaviour, `netlify.toml`, public
route URLs, `sitemap.ts`, `robots.ts`, and the entire `src/app/design-lab/`
tree. **No dependency added or removed.**

---

## 2. Header alignment solution

The Phase 1B ultra-wide issue (full-bleed sticky header vs. `--canvas-max`-capped
content) is resolved by decoupling the surface from the content:

```
header.site-header            ← full-width sticky surface: background, blur, border
└── div.site-header-inner     ← max-width: var(--canvas-max); margin-inline: auto
    ├── brand lockup
    ├── nav-toggle (mobile)
    └── nav + theme toggle
```

The background and hairline border still span the viewport; the brand and nav now
sit in a centred column capped at the same `--canvas-max` (106rem) with the same
`--gutter-page`, so they align with page content at any width. Preserved: sticky
behaviour (on the outer `header`), active-route indication + `aria-current`, the
theme toggle, the mobile menu (show/hide, `aria-expanded`, Escape), and keyboard
focus visibility. The `max-width: 720px` collapse now targets
`.site-header-inner` (which owns the flex layout). This is an alignment fix only —
no navigation redesign.

---

## 3. Footer implementation

`components/site-footer.tsx` (Server Component), inserted globally through the
root layout. It contains:

- Artist name (`siteName`, Newsreader), linked home.
- A factual tagline: `Selected works, 2019–2022`.
- Primary navigation links (Gallery, About, CV, Contact).
- An **Enquiries** link built from the existing enquiry configuration
  (`buildEnquiryHref()` → the same env var + fallback as `EnquiryButton`).
- Copyright year generated at build/render time via `new Date().getFullYear()`.

Appearance: full-width surface, hairline top divider, content aligned to the same
capped canvas as the header/page, Manrope utility links with the same animated
hairline-underline as the nav, Newsreader artist name. No filled panel, no
gradient, no card. Warm-paper / soot semantic tokens, so it adapts to both
themes. **No invented representation, studio address, social links, or location**
(no approved factual studio location exists in the content, so the optional
location line was omitted).

**Design-lab isolation:** the footer is added via the root layout, so it appears
on public routes and also below `/design-lab`. This does **not** compromise the
lab's isolation: the footer's styles live in `globals.css`, while every
design-lab specimen style is scoped under `.design-lab` in the separately-imported
`design-lab.css`. The footer sits outside that wrapper — exactly like the global
header already did — so the specimens themselves are visually untouched. No
route-aware exclusion was needed. `/design-lab` remains `noindex, nofollow` and
absent from nav and sitemap (verified in build output).

---

## 4. Homepage curation configuration

`content/homepage.ts` holds all curation as lightweight references:

- `heroWork` — one `{ year, artworkId }`.
- `featuredSeries` — `{ principal, supporting[] }`.
- `selectedWorks` — `HomepageSelection[]` (`{ year, artworkId, role }`), where
  `role: "anchor" | "supporting" | "vertical" | "landscape"` drives the layout.
- `archiveSummaries` — re-exports the existing year-descending
  `yearlyCollectionSummaries` (no separate ordering needed).

Every reference is resolved through the existing `getArtworkByYearAndId` helper.
`resolveArtwork()` **throws a clear error at module load** if an id/year does not
exist, so a mistyped reference fails `npm run dev`, `npm run test` and
`npm run build` rather than rendering an empty slot. No full artwork record is
duplicated and the Zod schema is untouched. Re-curation is a one-line edit.

---

## 5. Hero artwork selected and rationale

**Hero: _Remnants of the Wild Hunt_ (2022, `2022-remnants-of-the-wild-hunt`, 1000×1486 portrait).**

All eight 2022 Upland Folk assets were confirmed to be **transparent cutouts**
(VP8X WebP with an alpha channel) of paintings in irregular artist-made sculptural
frames, and each was viewed before selection. _Remnants of the Wild Hunt_ was
chosen on the brief's criteria:

- **Silhouette** — the strongest, most balanced, symmetrical frame (moth crown,
  crescent-moon corners, knot base) reads as a single distinctive shape.
- **Readability at scale & mobile** — symmetrical composition and a clear dark
  interior hold up large and small.
- **Relationship to the artist name** — its verticality and symmetry sit
  naturally beside the editorial type column.
- **Resolution** — the highest-fidelity 2022 file (largest encoded size).
- **Environment fit** — a transparent cutout needs no photographed rectangular
  background; it floats on warm paper as required (no card, no glow).

Hero text uses only approved/existing content: the artist name (`<h1>`), a factual
range (`Selected works · 2019–2022`), a **verbatim excerpt** from the approved
About statement (`Painting and drawing works grounded in narrative, memory, and
symbolic form.`), and one route into the work (`Enter the gallery`, plus the hero
image itself links to the work's detail page). No new marketing tagline was
introduced.

---

## 6. Featured Upland Folk works

A **preview**, not the standalone series page. Distinct from the hero:

| Role | Work | Record |
| ---- | ---- | ------ |
| Principal | Escape from the Cave | 2022 · 1000×1754 (tall, dramatic; red interior glows on soot) |
| Supporting | Cycle of the Goddess | 2022 · 1000×1181 (bright, calmer) |
| Supporting | Dawn | 2022 · 1000×1036 (near-square, sunburst frame) |

Series identity uses the **existing Upland Folk title graphic** and the
**existing series-context copy** (reused verbatim from `UplandFolkIntro`). Only the
**white** SVG variant is rendered, because the environment is always soot — the
theme-swap classes would show black-on-soot in the light theme. No new Upland Folk
work was shown beyond these three (the brief asks not to show every work), and no
artificial wall shadows or simulated architecture were added.

---

## 7. Selected works and layout roles

Six works, all clean flat scans, mixing orientation, tone and year:

| Order | Work | Year | Orientation / character | Role | Band |
| ----- | ---- | ---- | ----------------------- | ---- | ---- |
| 1 | Dismal Day on the Beach | 2019 | landscape, largest physical work | `anchor` | Anchor + satellites |
| 2 | Clouds | 2019 | ~square, quiet / pale | `supporting` | Anchor + satellites |
| 3 | Female Portrait | 2020 | portrait, graphite monochrome | `supporting` | Anchor + satellites |
| 4 | Jungle at Nighttime | 2019 | portrait, dark / saturated | `vertical` | Vertical conversation |
| 5 | Self Portrait | 2020 | portrait, mid-tone figurative | `vertical` | Vertical conversation |
| 6 | Imagined Landscape 2 | 2020 | landscape, bright watercolour | `landscape` | Vertical conversation |

This set demonstrates the brief's checklist across the whole homepage: an
artist-made-frame/transparent work (hero + featured), landscape orientation
(Dismal Day, Imagined Landscape 2), portrait orientation (Jungle, Self, Female),
a quieter/pale work (Clouds), a darker/more saturated work (Jungle at Nighttime),
and year variation (2022 hero+featured, 2019 + 2020 selected, all years in the
archive index).

**Why 2021 is absent from the prominent sections:** every 2021 source asset is a
low-resolution photograph of the artwork propped in an environment (concrete wall,
bench, pebbledash) rather than a clean scan. Showing them would read as a
simulated gallery setting (explicitly disallowed) and would be soft at homepage
scale. 2021 remains fully present in the archive index and the gallery. This is a
content limitation to revisit in the deferred photo-cleanup phase.

**Selection is not permanent** — re-curate in `content/homepage.ts`.

---

## 8. Archive-index implementation

The old year cards are replaced by an editorial index built from the existing
`yearlyCollectionSummaries` (year, count, story — no invented copy):

```
Archive
2022   8 works   Upland Folk series and sculptural framing explorations.      View
2021  10 works   Oil pastel studies with intimate narrative energy.           View
2020  15 works   Mixed-media transitions across memory and landscape.         View
2019  24 works   Early works shaped by travel, myth, and observation.         View
```

Rows with hairline dividers (top border on the list + bottom border per row), not
cards. Each row is a link to the gallery year anchor (`/gallery#year-YYYY`), keeps
keyboard accessibility, and responds on hover/focus (cadmium colour + a small
left-pad shift). On narrow screens (≤620px) the columns reflow to year + count on
one line and the story beneath, and the decorative "View" cue is hidden, so it
never compresses into unreadable columns.

---

## 9. Motion and reduced-motion behaviour

**Motion used (CSS-only, no library, no scroll listeners):**

- Hero entrance: a short staggered `home-rise` (opacity 0→1, translateY **16px→0**,
  ≤ the 24px cap) on the text elements, plus a `home-fade` opacity entrance on the
  artwork. No preloader, no perpetual motion, no delayed link availability, no
  scroll-linked hero animation.
- Selected works hover/focus: ≈1.2% image enlargement (`scale(1.012)`, within the
  1–1.5% brief) with the frame clipping the overflow invisibly, plus a quiet title
  colour shift. Transparent hero/featured works are **never** scaled (their
  sculptural silhouettes must not be clipped).
- Archive rows, nav, footer links, controls: existing token-driven colour/underline
  transitions.

**Reduced motion (`prefers-reduced-motion: reduce`):** the global block still
collapses all durations. A homepage-specific block additionally sets
`animation: none` on the hero entrance elements — this removes the animation
entirely so content is **immediately visible** (avoiding any fill-state flash
during `animation-delay`, which the global duration-only reset does not cover) —
and disables the hover enlargement. Static focus and colour feedback are preserved.

---

## 10. Accessibility

- **One `<h1>`** (the artist name). Section `<h2>` sequence: Introduction → Upland
  Folk → Selected works → Archive → Enquiries (verified in prerendered HTML).
- **Landmarks:** each section is a `<section aria-labelledby>`; the new global
  `<footer>` adds the previously-missing contentinfo landmark; footer nav is a
  labelled `<nav aria-label="Footer">`.
- **Linked artworks** have accessible names via `aria-label` (`"{title} ({year}) —
  view artwork"`); **image `alt` still comes from the data**. The Upland Folk
  graphic keeps its data alt and the soot section is labelled by an `.sr-only`
  `<h2>Upland Folk</h2>`.
- **No essential content is hover-only** — titles, medium, dimensions and years
  are always rendered; hover/focus only adjusts styling.
- **Focus** is visible in both environments: the global 3px focus ring plus a
  figure-level `focus-visible` outline; the featured soot section redefines
  `--focus-ring` to `cadmium-light` for contrast on soot.
- **Contrast:** cadmium-on-paper (~4.7:1) and cadmium-light/bone/dark-muted on
  soot were validated in Phase 1A and are reused unchanged; ochre is not used for
  text.
- Touch targets: the enquiry action and nav retain the existing comfortable
  padding; archive rows are full-width link targets.
- **Reading order matches visual order** (DOM order is the curation order; the
  desktop grid never reorders items away from source order in a way that conflicts
  with reading order). The skip link and nav semantics are unchanged.

---

## 11. Image-loading strategy & performance

- All images use `next/image` with explicit `width`/`height` from the data
  (aspect ratios preserved; low CLS) and per-surface `sizes`.
- **Only the hero** receives `priority` (one `<link rel="preload" as="image">` for
  `WildHunt-large` in the head — verified: exactly one). Every other homepage
  image is `loading="lazy"` (10 lazy images: 3 featured + 6 selected + the title
  SVG).
- The hero points at `-large` (quality 90); featured/selected point at `-medium`
  (quality 82). No full-resolution lightbox asset is loaded on the homepage.
- No client-side carousel, no scroll listeners. All home components are Server
  Components — **no new client JavaScript** was added to the homepage.

### First Load JS — before and after

| Route | Before | After |
| ----- | ------ | ----- |
| `/` | 165 B route · **106 kB** First Load JS | 173 B route · **111 kB** First Load JS |
| Shared by all | 102 kB | **102 kB** (unchanged) |

The +5 kB on `/` is the shared `next/image` client runtime, now used on the
homepage (it was already loaded on `/gallery`, which is likewise 111 kB). The
route-specific payload stays negligible (173 B), and the shared baseline is
unchanged. 69 static pages; route set identical.

---

## 12. Metadata

Reviewed and left unchanged. The root default title
(`Peadar Jolliffe-Byrne | Art Portfolio`) and description
(`Colour-driven contemporary painting portfolio…`) still accurately describe the
page; the canonical (`/`), Open Graph behaviour, `metadataBase`/site-URL handling
and the Phase 1B warm-paper OG image all remain valid. No claims were invented.

---

## 13. CSS organisation

Homepage and footer styles were added as clearly-grouped sections in the existing
single global stylesheet (`globals.css`) — no CSS Modules or new methodology.
Only production tokens are used (no Phase 1A lab tokens). New reusable decisions
kept minimal: `.sr-only`, `.section-eyebrow`, the header surface/inner split, and
`body { overflow-x: clip }`. The atmospheric featured section reuses the
established local-token-override pattern (as the lightbox does) rather than adding
new global tokens. Reduced-motion handling, light/dark semantic tokens, existing
focus styles and breakpoints are all preserved.

Full-width bands use `.home-bleed { margin-inline: calc(50% - 50vw) }` with an
inner `.home-bleed-inner` re-capping content to `--canvas-max`; `overflow-x: clip`
on `body` prevents a horizontal scrollbar without affecting the sticky header
(`clip`, unlike `hidden`, does not create a scroll container).

---

## 14. Verification

| Command | Result |
| ------- | ------ |
| `npm run typecheck` | ✅ pass (0 errors) |
| `npm run lint` | ✅ pass (0 errors, 0 warnings) |
| `npm run test` | ✅ pass — 3 files, **19 tests** (11 existing + 8 new homepage-curation tests) |
| `npm run build` | ✅ pass — **69 static pages**, route set identical |

Confirmed from the build output / prerendered HTML:

- 69 static pages; all 57 artwork routes still generate.
- Sitemap: 62 URLs (5 static + 57 works), **0** design-lab entries.
- `/design-lab` remains `noindex, nofollow`, absent from nav and sitemap; its
  scoped specimens render unchanged (only the shared header/footer surround them).
- No dependency added; no artwork image, artwork record, or Zod schema changed;
  theme persistence, no-flash script and lightbox behaviour intact.

### Curation tests (`tests/homepage.test.ts`)

Every configured reference resolves to a real artwork; hero/featured/selected
resolve at module load; a missing reference throws a clear error; **no duplicate
works across the whole curation**; 4–7 selected works; only known roles with at
least one anchor; selected works mix orientations; archive years/counts match the
collections.

---

## 15. Items deferred

- Standalone Upland Folk series page (this phase ships a preview only).
- Gallery, artwork-detail, About, CV and Contact **layout** redesigns (only
  unavoidable global-shell inheritance — header/footer — reaches them).
- Artwork-title italic treatment (Newsreader italic file still not loaded).
- Photo cleanup / re-shoot of the 2021 (and other soft) source images; gallery
  visualisations — remain deferred, and now block those 2021 works from prominent
  homepage placement (see §7).
- Native View Transitions between routes.
- Confirming/replacing the enquiry fallback email in Netlify env (a deployment
  decision; centralised in `lib/enquiry.ts` but value unchanged).

---

## 16. Confirmation — images, schema and records unchanged

- No file under any image directory was edited, added or removed. (Transparency of
  the 2022 assets was only *read* for selection.)
- No artwork record in `content/artworks.ts` was changed; no descriptions,
  availability, exhibition history or tags were added.
- The Zod content schema (`lib/content-schema.ts`) is unchanged.
- Transparent Upland Folk assets and their light/dark swap rules are unchanged; the
  featured section simply chooses the existing white variant for its always-soot
  environment.
- `next/image` sources, dimensions, aspect ratios and `object-fit` are unchanged;
  no CSS drop shadow, artificial background or coloured frame was applied to any
  artwork.

---

## 17. Visual review

### Automated browser checks (added after the initial phase)

A Playwright + axe suite now automates the deterministic parts of this review
(see `docs/browser-testing.md`). It runs a real browser against `next start` and
passes locally (14 checks): one `<h1>` and the `<h2>` sequence, exactly one hero
preload, archive year links, **no horizontal scroll at 390/768/1440/1920px**,
**header/page/footer alignment at 1920px**, theme default + persisted-dark, hero
visible under reduced motion, and **zero axe violations in both the paper and
soot themes**. It is wired into CI as a separate `e2e` job. Dev-dependencies
only; no runtime footprint.

The aesthetic/composition judgments below still require human eyes — the tooling
gets a reviewer to the right screen quickly but cannot assert "reads as
intentional".

### Manual review

Run `npm run dev` and open `http://localhost:3000/` at
**390px**, **768px**, **1440px**, and **≥1920px**, in **light** and **dark**
themes and with OS **Reduce motion** on. Priority checks:

1. Desktop hero — artwork present in the first viewport, editorial not promotional.
2. Mobile hero — title + "Enter the gallery" visible; artwork near-edge-to-edge.
3. Paper→soot Upland Folk transition — full-width soot band, content aligned.
4. Selected-work composition — asymmetry and intentional blank space read as
   deliberate (esp. the anchor's negative space and the vertical-conversation
   stagger); confirm the anchor's large blank region looks intentional.
5. Editorial archive index — rows/dividers at desktop and the ≤620px reflow.
6. Header + footer at ≥1920px — brand/nav/footer aligned to the content column.

### Remaining visual decisions requiring human review

- Hero image scale/negative-space balance vs. the type column at 1440–1920px.
- The anchor band's deliberate blank space (see §7) — confirm it reads as
  composition, not a gap; adjust `align-items`/spans if not.
- Whether the featured principal (Escape from the Cave, very tall) wants a lower
  `max-height` cap on some viewports.
- Final selected-works set and ordering (fully data-driven; easy to re-curate).
