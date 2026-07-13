# Phase 0 — Technical & Content Audit

> Purpose: a precise map of the repository so the redesign can be planned without
> rediscovering it. This document describes the site **as it is today**. It changes
> no appearance, behaviour, routes, data, or configuration.
>
> Audit date: 2026-07-12 · Branch `nextjs-rebuild` · Commit `2c6bced`

---

## 1. Repository snapshot

| Item | Value |
| ---- | ----- |
| Current branch | `nextjs-rebuild` |
| Current commit | `2c6bced21eab3db230bf9589ac998d1cf6092b75` ("Engage Netlify Next.js runtime plugin explicitly") |
| Main branch | `master` |
| Package manager | **npm** (only `package-lock.json` present; no `pnpm-lock.yaml`/`yarn.lock`) |
| Node/runtime requirement | Node **24** (pinned in [netlify.toml](../netlify.toml#L17) and [ci.yml](../.github/workflows/ci.yml#L24); local runtime observed: Node v24.11.1, npm 11.6.3) |
| Dev command | `npm run dev` → `next dev` |
| Production build | `npm run build` → `next build` |
| Preview / serve production | `npm run start` → `next start` (no dedicated preview script) |
| Test | `npm run test` → `vitest run` (watch: `npm run test:watch`) |
| Lint | `npm run lint` → `eslint .` (autofix: `npm run lint:fix`) |
| Type-check | `npm run typecheck` → `tsc --noEmit` |
| Image tool | `npm run optimize:images` → `node scripts/optimize-images.mjs` |

### Command outcomes (run during this audit)

| Command | Result |
| ------- | ------ |
| `npm run typecheck` | ✅ Pass (exit 0, no errors) |
| `npm run lint` | ✅ Pass (exit 0, no warnings) |
| `npm run test` | ✅ Pass — 2 files, 11 tests (`tests/content.test.ts`, `tests/artwork-queries.test.ts`) |
| `npm run build` | See [§12 Performance baseline](#12-performance-baseline) — result recorded there |

**Uncommitted changes before the audit:** none. `git status --porcelain` was empty; working tree clean. The only files added by the audit are `docs/phase-0-audit.md` and `docs/phase-0-manifest.json`.

---

## 2. Framework and build system

| Aspect | Finding | Evidence |
| ------ | ------- | -------- |
| Framework | **Next.js `^15.5.20`**, App Router | [package.json:18](../package.json#L18), `src/app/` tree |
| React | **19.0.0** / react-dom 19 | [package.json:19-20](../package.json#L19) |
| Rendering model | **Static-first hybrid.** All routes are statically generated (SSG); the dynamic artwork route is fully prerendered via `generateStaticParams`. Interactivity is layered on with a handful of client components. No SSR data fetching, no route handlers, no server actions. | [gallery/[year]/[artworkId]/page.tsx:22](../src/app/gallery/[year]/[artworkId]/page.tsx#L22) |
| Bundler / build tool | Next's built-in toolchain (Turbopack/Webpack per Next 15 defaults). No custom bundler config. | [next.config.ts](../next.config.ts) |
| Language | **TypeScript, strict.** `strict: true`, `allowJs: false`. `jsx: preserve`, `moduleResolution: bundler`. | [tsconfig.json:6-7](../tsconfig.json#L6) |
| Path alias | `@/*` → repo root `./*` (mirrored in Vitest via `resolve.alias`). | [tsconfig.json:17-19](../tsconfig.json#L17), [vitest.config.ts:6-10](../vitest.config.ts#L6) |
| Important plugins | Next TS plugin ([tsconfig.json:20-24](../tsconfig.json#L20)); ESLint flat config extending `next/core-web-vitals` + `next/typescript` ([eslint.config.mjs:26](../eslint.config.mjs#L26)); Netlify `@netlify/plugin-nextjs` ([netlify.toml:19-20](../netlify.toml#L19)). |
| Fonts | `next/font/google` self-hosts **Sora** (`--font-sans`) and **Spectral** (`--font-serif`), `display: swap`. No external font requests. | [layout.tsx:11-22](../src/app/layout.tsx#L11) |
| Image feature | `next/image` with AVIF+WebP output formats enabled. | [next.config.ts:36-38](../next.config.ts#L36) |
| Routing feature | App Router file routing; dynamic segments `[year]/[artworkId]`. No `middleware.ts`, no route groups, no parallel/intercepting routes. | `src/app/` |
| Transition feature | **None built in.** No `template.tsx`, no View Transitions, no animation library. See [§9](#9-existing-animation-and-interaction-stack). |

### Package scripts

All 9 scripts listed in [§1](#1-repository-snapshot). Runtime dependencies are deliberately small: `clsx`, `next`, `react`, `react-dom`, `zod`, `zustand`. Dev tooling: ESLint 9, Prettier 3, TypeScript 5.7, Vitest 3, Testing Library, jsdom, sharp.

### Environment files and variables

- Committed template: [.env.example](../.env.example). Local file `.env.local` is git-ignored.
- Variable **names** (values redacted; both are `NEXT_PUBLIC_*`, so client-exposed by design, not secrets):
  - `NEXT_PUBLIC_SITE_URL` — canonical origin for metadata/sitemap/robots/OG. Fallback in [lib/site.ts:6-7](../lib/site.ts#L6).
  - `NEXT_PUBLIC_ENQUIRY_EMAIL` — mailto target for enquiries. Fallback hard-coded in [enquiry-button.tsx:5](../components/enquiry-button.tsx#L5).
- ⚠️ Note for Phase 1: the enquiry fallback address hard-coded in `enquiry-button.tsx` (`peadarjb@gmail.com`, matching the `.env.example` placeholder) is a personal Gmail; it ships if `NEXT_PUBLIC_ENQUIRY_EMAIL` is not set on Netlify — see [§13 risk register](#13-technical-risk-register).

---

## 3. Route inventory

All routes live under [src/app/](../src/app/). Rendering is SSG throughout.

| Route | Page purpose | Route file | Main layout | Data source | Dynamic params | Rendering |
| ----- | ------------ | ---------- | ----------- | ----------- | -------------- | --------- |
| `/` | Home / hero + collection summary cards | [src/app/page.tsx](../src/app/page.tsx) | RootLayout | `yearlyCollectionSummaries` from [content/artworks.ts](../content/artworks.ts#L895) | — | SSG (static) |
| `/gallery` | All works grouped by year; Upland Folk intro before 2022 | [src/app/gallery/page.tsx](../src/app/gallery/page.tsx) | RootLayout | `artworksByYearDescending` | — | SSG (static) |
| `/gallery/[year]/[artworkId]` | Single artwork detail | [src/app/gallery/[year]/[artworkId]/page.tsx](../src/app/gallery/[year]/[artworkId]/page.tsx) | RootLayout | `lib/artwork-queries.ts` | `year`, `artworkId` | SSG (prerendered via `generateStaticParams`) |
| `/about` | Artist statement | [src/app/about/page.tsx](../src/app/about/page.tsx) | RootLayout | inline JSX prose | — | SSG (static) |
| `/cv` | Curriculum vitae | [src/app/cv/page.tsx](../src/app/cv/page.tsx) | RootLayout | `cvSections` from [content/site.ts](../content/site.ts) | — | SSG (static) |
| `/contact` | Enquiry prompt + mailto button | [src/app/contact/page.tsx](../src/app/contact/page.tsx) | RootLayout | inline JSX | — | SSG (static) |
| `/_not-found` (404) | Not-found page | [src/app/not-found.tsx](../src/app/not-found.tsx) | RootLayout | inline JSX | — | SSG (static) |
| `/sitemap.xml` | Sitemap | [src/app/sitemap.ts](../src/app/sitemap.ts) | — | `artworksByYearDescending` + static list | — | Generated at build |
| `/robots.txt` | Robots | [src/app/robots.ts](../src/app/robots.ts) | — | `siteUrl` | — | Generated at build |
| `/opengraph-image` | OG social image (1200×630 PNG) | [src/app/opengraph-image.tsx](../src/app/opengraph-image.tsx) | — | `next/og` `ImageResponse` | — | Generated at build |

There is **no dedicated collection/year route** — "collections" are anchor sections (`#year-2022`) within `/gallery`, linked from the home cards. There is no `error.tsx`, `loading.tsx`, or `template.tsx`.

---

## 4. Page-to-layout control map

The site has **one global shell** and a small set of shared surfaces. Every page reuses the same header, footer-less shell, and CSS class vocabulary. There are **no CSS Modules or scoped styles** — all styling flows from a single global stylesheet [src/app/globals.css](../src/app/globals.css) keyed on semantic class names.

| Concern | Controlling file(s) | Notes |
| ------- | ------------------- | ----- |
| Global shell / `<html>`/`<body>` | [src/app/layout.tsx](../src/app/layout.tsx) | Injects fonts, no-flash theme script, `ThemeSync`, skip link, header, `<main class="site-shell">`, lightbox portal. |
| Header | [components/site-header.tsx](../components/site-header.tsx) + `.site-header` in [globals.css:123](../src/app/globals.css#L123) | Sticky, blurred, brand lockup + nav. Client component. |
| Navigation | [components/site-header.tsx:11-17](../components/site-header.tsx#L11) (nav items array) + `.site-nav` [globals.css:157](../src/app/globals.css#L157) | Pill links; mobile hamburger toggles `is-open`. Active state via `usePathname`. |
| Footer | **None exists.** No footer component or element. | Opportunity/gap for Phase 1. |
| Page container | `.site-shell` [globals.css:271](../src/app/globals.css#L271); per-page `.page`/`.page-*` [globals.css:275](../src/app/globals.css#L275) | Width controlled by `clamp()` padding, not a max-width wrapper (see [§6](#6-styling-and-theme-architecture)). |
| Page title / hero | `.page-header`, `.headline`, `.eyebrow`, `.lede` [globals.css:280-306](../src/app/globals.css#L280); home hero `.hero-grid`/`.hero-glow` [globals.css:308-332](../src/app/globals.css#L308) | Shared across all pages. |
| Main grid (gallery) | [components/gallery-grid.tsx](../components/gallery-grid.tsx) + `.gallery-grid` [globals.css:489](../src/app/globals.css#L489) | `auto-fit, minmax(220px, 1fr)`. |
| Artwork listing / card | [components/artwork-card.tsx](../components/artwork-card.tsx) + `.artwork-card` [globals.css:495](../src/app/globals.css#L495) | Card = image shell + title + medium + meta + actions. |
| Artwork detail | [gallery/[year]/[artworkId]/page.tsx](../src/app/gallery/[year]/[artworkId]/page.tsx) + `.detail-*` [globals.css:541-610](../src/app/globals.css#L541) | Hero image + two meta cards. |
| Collection/year page | Section within `/gallery` (`.year-section`, `.year-section-header` [globals.css:420,477](../src/app/globals.css#L420)); home teaser `.year-card` [globals.css:389](../src/app/globals.css#L389) | No standalone route. |
| Upland Folk page | [components/upland-folk-intro.tsx](../components/upland-folk-intro.tsx) + `.series-intro*` [globals.css:425-475](../src/app/globals.css#L425) | Rendered inline in `/gallery` only when `year === 2022` ([gallery/page.tsx:32](../src/app/gallery/page.tsx#L32)). Light/dark SVG swap. |
| About | [src/app/about/page.tsx](../src/app/about/page.tsx) + `.prose-page`/`.prose` [globals.css:734-743](../src/app/globals.css#L734) | Static prose. |
| CV | [src/app/cv/page.tsx](../src/app/cv/page.tsx) + `.cv-grid`/`.cv-card` [globals.css:745-771](../src/app/globals.css#L745) | Maps `cvSections`. |
| Contact | [src/app/contact/page.tsx](../src/app/contact/page.tsx) + `.contact-card` [globals.css:723](../src/app/globals.css#L723) | mailto only. |
| Mobile behaviour | `@media (max-width: 720px)` [globals.css:243-269](../src/app/globals.css#L243) (nav collapse) and `@media (max-width: 900px)` [globals.css:773-785](../src/app/globals.css#L773) (lightbox stacking). Fluid `clamp()` sizing elsewhere. | No separate mobile components. |
| Light/dark appearance | `[data-theme="light"]` / `[data-theme="dark"]` blocks [globals.css:38-63](../src/app/globals.css#L38); toggled by [ui-store.ts](../lib/store/ui-store.ts) + [theme-sync.tsx](../components/theme-sync.tsx) + inline no-flash script [layout.tsx:59](../src/app/layout.tsx#L59). | See [§6](#6-styling-and-theme-architecture). |

**What must change to restyle a page without touching data/behaviour:** because the markup emits stable semantic class names and all visuals live in one stylesheet keyed on tokens, most restyling is achievable by (a) editing the `:root`/`[data-theme]` token values and the component rules in `globals.css`, and (b) optionally adjusting class names in the small JSX surfaces. The data (`content/*`, `lib/*`) and interaction logic (stores, client components) can remain untouched. The three visual signatures to target are the **CTA gradient**, **rounded cards**, and **pill buttons** — all centralized (see [§6](#6-styling-and-theme-architecture)).

---

## 5. Component inventory

All components are in the flat [components/](../components/) directory (client/server mix). No component library, no `index` barrels.

| Component | File | Used by | Responsibility | Coupling | Disposition |
| --------- | ---- | ------- | -------------- | -------- | ----------- |
| `SiteHeader` | [components/site-header.tsx](../components/site-header.tsx) | RootLayout | Sticky header, brand, nav, mobile toggle | Client; `useUIStore` (navOpen), `usePathname`, `ThemeToggle` | Preserve but restyle |
| `ThemeToggle` | [components/theme-toggle.tsx](../components/theme-toggle.tsx) | SiteHeader | Light/dark button w/ hydration-safe label | Client; `useUIStore` | Preserve but restyle |
| `ThemeSync` | [components/theme-sync.tsx](../components/theme-sync.tsx) | RootLayout | Mirrors store `theme` → `data-theme` attr | Client; `useUIStore` | Preserve |
| `GalleryGrid` | [components/gallery-grid.tsx](../components/gallery-grid.tsx) | `/gallery` | Grid wrapper mapping works → cards | Server; `Artwork[]` prop | Preserve but restyle |
| `ArtworkCard` | [components/artwork-card.tsx](../components/artwork-card.tsx) | GalleryGrid | Card: image, title, medium, meta, actions | Server; `next/image`, `EnquiryButton` | Preserve but restyle |
| `UplandFolkIntro` | [components/upland-folk-intro.tsx](../components/upland-folk-intro.tsx) | `/gallery` (2022) | Series banner w/ light/dark SVG + copy | Server; `next/image`, `EnquiryButton` | Preserve but restyle |
| `ArtworkLightbox` | [components/artwork-lightbox.tsx](../components/artwork-lightbox.tsx) | RootLayout (always mounted) | Full-screen viewer: focus trap, keyboard nav, body-inert, scroll lock | Client; `useLightboxStore`, `next/image` | Preserve (restyle chrome) |
| `LightboxTrigger` | [components/lightbox-trigger.tsx](../components/lightbox-trigger.tsx) | detail page | Button that opens lightbox at a start id | Client; `useLightboxStore` | Preserve but restyle |
| `EnquiryButton` | [components/enquiry-button.tsx](../components/enquiry-button.tsx) | cards, detail, contact, series | mailto CTA with subject | Server; reads `NEXT_PUBLIC_ENQUIRY_EMAIL` | Preserve but restyle (⚠ fallback email, [§13](#13-technical-risk-register)) |

### Grouped by role

- **Global layout:** `RootLayout` (in `layout.tsx`), `SiteHeader`. *(No footer.)*
- **Navigation:** `SiteHeader` nav, `ThemeToggle` (nav-hosted).
- **Artwork presentation:** `GalleryGrid`, `ArtworkCard`, `ArtworkLightbox`, `LightboxTrigger`, artwork detail page.
- **Content / editorial:** `UplandFolkIntro`, About/CV/Contact pages, home summary cards.
- **Forms:** none — `EnquiryButton` is a mailto link, not a form. No form inputs anywhere.
- **Theme:** `ThemeToggle`, `ThemeSync`, inline no-flash script in `layout.tsx`.
- **Animation:** none as dedicated components (CSS-only; see [§9](#9-existing-animation-and-interaction-stack)).
- **Utility:** `clsx` (dependency) for conditional classes; `lib/artwork-queries.ts` (data helpers, not a component).

### Repeated "app-like" primitives (redesign focus)

These are **not** components — they are repeated CSS class patterns. Consolidating them into tokens/components is the core restyle lever:

- **Pill buttons:** `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-compact` — `border-radius: 999px`, uppercase, letter-spaced ([globals.css:340-370](../src/app/globals.css#L340)). Also `.theme-toggle`, `.lightbox-close`, `.lightbox-nav`, `.site-nav a` all reuse `border-radius: 999px`.
- **Cards:** `.year-card`, `.artwork-card`, `.detail-meta-card`, `.cv-card`, `.contact-card`, `.series-intro` — all share `--bg-card` + `1px --border-soft` + `--radius-md/lg` + `--shadow-soft`.
- **Shadows:** `--shadow-soft` / `--shadow-strong` applied to every card and the primary button.
- **Gradients:** CTA gradient (`--btn-from`→`--btn-to`), hero glow (three radial gradients), canvas background gradients, OG image gradient.

---

## 6. Styling and theme architecture

| Aspect | Finding |
| ------ | ------- |
| Methodology | **Single global stylesheet + semantic BEM-ish class names + CSS custom properties.** No Tailwind, no CSS Modules, no CSS-in-JS, no Sass. |
| Global stylesheet | [src/app/globals.css](../src/app/globals.css) (794 lines) — the *only* stylesheet, imported once in [layout.tsx:9](../src/app/layout.tsx#L9). |
| Design tokens | Three-layer model already in place (documented in [docs/DESIGN_TOKENS.md](DESIGN_TOKENS.md)): **primitives** (`--color-*`, `--space-*`, `--radius-*`, `--shadow-*`) in `:root` [globals.css:1-36](../src/app/globals.css#L1); **semantic** (`--bg-canvas`, `--bg-card`, `--text-main`, `--accent-main`, `--link`, `--focus-ring`) per theme [globals.css:38-63](../src/app/globals.css#L38); **component** tokens minimal (`--btn-from`/`--btn-to`). |
| Custom properties | Colours: `--color-ink-900/700`, `--color-paper-50/100`, `--color-sun-300`, `--color-cyan-500`, `--color-red-500`, `--color-green-500` (green defined but unused in components). |
| Hard-coded values | Some remain **outside** the token system: raw hex in `[data-theme]` gradients ([globals.css:39,53](../src/app/globals.css#L39)), `--text-muted` (`#5f4f4d`/`#d2c6bb`), `--link`/`--focus-ring` hexes, lightbox `rgba(8,6,7,0.82)` backdrop [globals.css:617](../src/app/globals.css#L617), OG-image hexes [opengraph-image.tsx:22](../src/app/opengraph-image.tsx#L22), and `--btn-from/to` literals [globals.css:34-35](../src/app/globals.css#L34). Spacing/radius are consistently tokenized. |
| Typography | `--font-body` = Sora stack; `--font-display` = Spectral/Georgia serif ([globals.css:11-12](../src/app/globals.css#L11)). Fluid sizing via `clamp()` on `.headline`, `.lede`, `.brand-title`. Headings use the serif display font. |
| Breakpoints | Only **two** media queries: `max-width: 720px` (nav) and `max-width: 900px` (lightbox). Everything else is intrinsically responsive via `clamp()` + `auto-fit` grids. |
| Container width | **No max-width container.** Content spans full viewport minus fluid `clamp()` padding on `.site-shell` [globals.css:271-273](../src/app/globals.css#L271); prose blocks self-limit with `max-width: 70ch`. |
| Border-radius | Tokenized: `--radius-sm 10px`, `--radius-md 20px`, `--radius-lg 32px`, plus `999px` pills. |
| Shadows | Tokenized: `--shadow-soft`, `--shadow-strong`. |
| Light/dark mechanism | `data-theme` attribute on `<html>`; CSS switches all semantic tokens. Default `light` server-rendered. |
| Theme persistence | Zustand `persist` middleware → `localStorage` key **`portfolio-ui`**, `partialize` stores only `theme` ([ui-store.ts:26-30](../lib/store/ui-store.ts#L26)). |
| System-theme detection | **None.** No `prefers-color-scheme` for theme selection; default is always `light` until the user toggles. (`prefers-reduced-motion` *is* honoured, [globals.css:787](../src/app/globals.css#L787).) |
| No-flash handling | Inline `<script>` in `<head>` reads `localStorage['portfolio-ui']` and sets `data-theme` before paint ([layout.tsx:59](../src/app/layout.tsx#L59)); `suppressHydrationWarning` on `<html>`. |
| Component-level overrides | Light/dark SVG swap for Upland Folk title ([globals.css:445-455](../src/app/globals.css#L445)); nav active state uses `color-mix`. |
| Teal/coral gradient source | Primary CTA: `linear-gradient(120deg, var(--btn-from) #0e7a86, var(--btn-to) #bf4130)` on `.btn-primary` [globals.css:356-360](../src/app/globals.css#L356). Hero glow radial gradients [globals.css:320-332](../src/app/globals.css#L320). OG image gradient [opengraph-image.tsx:22](../src/app/opengraph-image.tsx#L22). |
| Rounded cards source | `.artwork-card`/`.year-card`/etc. `border-radius: var(--radius-md/lg)` — see [§5](#5-component-inventory). |
| Pill buttons source | `.btn` `border-radius: 999px` [globals.css:344](../src/app/globals.css#L344). |
| Repeated shadows source | `--shadow-soft`/`--shadow-strong` on all cards + primary button. |

**Assessment — can this architecture support semantic design tokens without replacement?**
**Yes, comfortably.** The three-layer token model already exists and is used consistently for spacing, radius, shadow, fonts, and most colours. Restyling to a less "app-like" look is largely a matter of re-valuing tokens (flatten shadows, reduce radii, replace gradient CTAs) and consolidating the four "pill/card/shadow/gradient" patterns — no framework migration required. The main gaps to close are (1) the handful of hard-coded hexes in theme gradients and the OG image, and (2) the absence of a max-width container and `prefers-color-scheme` default. A Phase-1 laboratory can add tokens additively without disturbing the current stylesheet.

---

## 7. Artwork content model

### Schema (source of truth)

Defined and Zod-validated in [lib/content-schema.ts](../lib/content-schema.ts):

```ts
imageVariantSchema = {
  small:  string (min 1),   // path to -small.webp
  medium: string (min 1),   // path to -medium.webp
  large:  string (min 1),   // path to -large.webp
  alt:    string (min 1),
  width:  number (positive),
  height: number (positive),
}

artworkSchema = {
  id:         string (min 1),
  title:      string (min 1),
  year:       number int 1900–2200,
  medium:     string (min 1),
  dimensions: string (min 1),
  image:      imageVariantSchema,
}

artworkCollectionSchema = { year: number int, works: artworkSchema[] }
```

Data lives in [content/artworks.ts](../content/artworks.ts) as a `const` array parsed at module load with `z.array(artworkCollectionSchema).parse(...)` then sorted year-descending ([artworks.ts:883-886](../content/artworks.ts#L883)).

### Field coverage vs. the audit's requested fields

The current model is **deliberately minimal.** Of the fields the brief asks about, only these exist: **id, title, year, medium, dimensions, main image (3 variants), image alt text, display order** (implicit = array order). **All of the following do NOT exist in the schema or data:** series, availability, description, alternative images, detail images, installation images, exhibition history, related works, tags/themes, featured status. Any redesign relying on them must extend the schema first (see [§13](#13-technical-risk-register)).

| Requested field | Present? | Where / note |
| --------------- | -------- | ------------ |
| Identifier / slug | ✅ | `id` (e.g. `2022-dawn`); used directly in URLs |
| Title | ✅ | `title` |
| Year | ✅ | `year` (number) + collection `year` |
| Medium | ✅ | `medium` (free text) |
| Dimensions | ✅ | `dimensions` (free text, e.g. `61cm x 41cm`) |
| Series | ⚠️ implicit | Only "Upland Folk" = the 2022 collection, hard-coded in [gallery/page.tsx:32](../src/app/gallery/page.tsx#L32) and [upland-folk-intro.tsx](../components/upland-folk-intro.tsx). No `series` field. |
| Availability | ❌ | Not modelled |
| Description | ❌ | Not modelled (no per-work prose) |
| Main image | ✅ | `image.{small,medium,large}` + `width`/`height` |
| Alternative / detail / installation images | ❌ | Only one image per work |
| Exhibition history | ❌ | Only global CV in [content/site.ts](../content/site.ts) |
| Related works | ⚠️ derived | No field; "neighbours" computed as prev/next **within the same year**, wrapping ([artwork-queries.ts:26-37](../lib/artwork-queries.ts#L26)) |
| Tags / themes | ❌ | Not modelled |
| Display order | ✅ implicit | Array order within each collection (no explicit `order` field) |
| Featured status | ❌ | Not modelled |
| Image alt text | ✅ | `image.alt` — **auto-generated** as `"{title} artwork"` for every record (not hand-written) |

### Three representative records

**Complete / typical** (all fields populated, full 2022 painting):
```
id: 2022-remnants-of-the-wild-hunt · title: Remnants of the Wild Hunt · year: 2022
medium: Oil on board in artist made frame · dimensions: 61cm x 41cm
image: WildHunt-{small,medium,large}.webp · alt: "Remnants of the Wild Hunt artwork" · 1000×1486
```

**Minimal** (shortest metadata, small drawing):
```
id: 2021-untitled · title: Untitled · year: 2021
medium: Oil pastel on paper · dimensions: 18cm x 16cm
image: Untitled4-{...}.webp · alt: "Untitled artwork" · 800×600
```

**Unusual** (missing source metadata; filename ≠ title):
```
id: 2020-3-figures · title: 3 Figures · year: 2020
medium: "Not recorded" · dimensions: "Not recorded"   ← placeholder strings, schema still passes (min length 1)
image: 3Figures-{...}.webp · 1000×1440
```
Filename/title mismatches are common, e.g. `2022-morning-sun` → `SummerDay-*.webp`; `2021-warm-mud` → `LluviaCollaboration2-*.webp`; `2021-ufo-landing` → `LluviaCollaboration-*.webp`.

### Completeness counts (full collection)

- **57 artworks** total across **4 collections**: 2022 (8), 2021 (10), 2020 (15), 2019 (24).
- **100% populated** for every schema field (all mandatory; there are no optional fields).
- **Data-quality flags:**
  - 1 work (`2020-3-figures`) uses `"Not recorded"` for both `medium` and `dimensions` (passes schema; a content gap, not a validation error). A test explicitly guards against the *legacy* placeholder phrase but not this one ([tests/content.test.ts:37-42](../tests/content.test.ts#L37)).
  - Duplicate titles: **"Untitled"** appears in both 2020 (`2020-untitled`) and 2021 (`2021-untitled`); ids remain unique.
  - `alt` text is templated (`"{title} artwork"`) for all 57 — accessible but not descriptive (see [§11](#11-accessibility-baseline)).
  - Image dimensions are inconsistent in scale: some `large` variants are only 450×600 or 800×600 (2021, and several 2020), while 2019/2022 are ~1000px+ wide. `width/height` describe the *stored* variant, and aspect ratios vary widely (portrait, landscape, near-square).

### How derived views are generated

- **Years / collections:** taken directly from the `collectionsRaw` array; sorted descending ([artworks.ts:883](../content/artworks.ts#L883)). Home summaries add a hard-coded `story` string per year ([artworks.ts:888-899](../content/artworks.ts#L888)).
- **Related works:** none stored; `getArtworkNeighbors` computes prev/next within the same year with wraparound ([artwork-queries.ts:26](../lib/artwork-queries.ts#L26)).
- **Route params:** `getArtworkRouteParams` flattens every work to `{year, artworkId}` for static generation ([artwork-queries.ts:39](../lib/artwork-queries.ts#L39)).

---

## 8. Image pipeline

| Aspect | Finding |
| ------ | ------- |
| Source directory | [public/images/](../public/images/) organised by year: `2019/`, `2020/`, `2021/`, `2022/`. Served as static assets. |
| Remote providers | **None.** No `next.config` `remotePatterns`; all images local. On Netlify, `next/image` is served through the **Netlify Image CDN** via `@netlify/plugin-nextjs`. |
| Formats | **171 `.webp`** derivatives + **2 `.svg`** (Upland Folk title, black/white). Output formats requested from `next/image`: **AVIF then WebP** ([next.config.ts:37](../next.config.ts#L37)). |
| Variant scheme | Each artwork ships 3 pre-generated variants: `-small`, `-medium`, `-large`. Target widths in the optimizer: small 640px, medium 1280px, large 2200px (`withoutEnlargement` prevents upscaling) ([optimize-images.mjs:48-52](../scripts/optimize-images.mjs#L48)). Actual stored widths vary (many sources are smaller than target, so left native). |
| Generation | `scripts/optimize-images.mjs` (sharp) re-encodes variants **in place** as deterministic lossy WebP, strips EXIF/XMP, never enlarges, never writes a larger file, idempotent. Includes OneDrive-specific robust-write retry logic ([optimize-images.mjs:114-134](../scripts/optimize-images.mjs#L114)). Run manually via `npm run optimize:images` — **not** part of the build. |
| Which variant renders where | Grid card → `image.medium`, `quality={82}`, `loading="lazy"` ([artwork-card.tsx:17-26](../components/artwork-card.tsx#L17)). Detail hero → `image.large`, `quality={96}`, `priority` ([detail page:87-96](../src/app/gallery/[year]/[artworkId]/page.tsx#L87)). Lightbox → `image.large`, `quality={90}`, `priority` ([artwork-lightbox.tsx:165-174](../components/artwork-lightbox.tsx#L165)). `image.small` is defined but **not referenced** by any component. |
| `srcset` / `sizes` | Handled by `next/image`. `sizes` set per surface: card `(max-width:900px) 100vw, (max-width:1300px) 50vw, 33vw`; detail `(max-width:900px) 95vw, 82vw`; lightbox `(max-width:900px) 96vw, 90vw`. |
| Lazy-loading | Grid cards `loading="lazy"`. Detail hero and lightbox use `priority` (eager, preloaded). |
| Hero image | The home page has **no raster hero** — the hero is a CSS radial-gradient glow, so no LCP image there. First meaningful image LCP is the detail-page hero (has `priority`). |
| Width/height reservation | Every `next/image` receives explicit `width`/`height` from the data → intrinsic aspect-ratio box reserved → minimal CLS. |
| Placeholder / blur | **None.** No `placeholder="blur"`, no `blurDataURL`. Images pop in on load. |
| Thumbnail generation | The `-small`/`-medium` variants serve as thumbnails; `next/image` further resizes via the CDN. |
| Full-resolution viewing | Lightbox (`image.large`, quality 90) and detail hero (quality 96) are the highest-fidelity views; `-large` targets 2200px but many stored sources are smaller. |
| CDN / transformation | Netlify Image CDN in production (via plugin). Locally, Next's built-in image optimizer. |
| Colour profile / metadata | **Metadata stripped** during optimization (sharp drops metadata by default; EXIF/XMP removed). No explicit ICC-profile preservation — colour is whatever sRGB the WebP encodes. Auto-orient (`.rotate()`) applied before stripping. |
| Cropping / object-fit | Cards: image fills width, `height:auto` (no crop) ([globals.css:512-516](../src/app/globals.css#L512)). Detail: `object-fit: contain`, `max-height: 82vh` ([globals.css:559-565](../src/app/globals.css#L559)). Lightbox: `object-fit: contain`, `max-height: min(72vh,920px)` ([globals.css:691-697](../src/app/globals.css#L691)). Nothing is cropped — all art shown whole. |

### Image-performance risks

- **Total payload ~34.7 MB** of webp across 171 files (2019 ≈16.5 MB, 2020 ≈9.6 MB, 2021 ≈4.9 MB, 2022 ≈3.7 MB). Largest single files ~1.0 MB (`personOnBeach-large.webp`, `Female_portrait-large.webp`). Not all shipped at once — `next/image` serves right-sized derivatives — but `-large` at quality 96 on detail pages is heavy on mobile.
- **No blur/placeholder** → visible pop-in on slower connections.
- Some `-large` variants are only 450–800px wide (2021, parts of 2020), so the lightbox "high-fidelity" view is **soft** for those works — a content limitation, not a code bug.

---

## 9. Existing animation and interaction stack

| Aspect | Finding |
| ------ | ------- |
| Animation libraries | **None.** No Framer Motion, GSAP, React Spring, Motion One, etc. `clsx` is the only UI helper dependency. |
| Page transitions | **None.** No `template.tsx`, no `next-view-transitions`, no route-change animation. Navigation is instant. |
| CSS transitions | Defined via `--transition-fast (180ms)` / `--transition-slow (420ms)` tokens ([globals.css:29-30](../src/app/globals.css#L29)). Applied to: skip-link reveal, nav hover, theme-toggle hover lift, `.btn:hover` translateY, artwork title colour, card interactions. |
| Keyframes | **None** — no `@keyframes` defined anywhere. |
| Scroll observers | **None.** No `IntersectionObserver`, no scroll-linked effects. |
| Hover effects | Button lift (`translateY(-2px)`), theme-toggle lift, nav background/border, title colour shift. All CSS, all cheap (transform/colour). |
| Menu animation | Mobile menu toggles `display` (`is-open` → `display:flex`) — **no transition** (display can't animate). Open/close is instant. |
| Modal / lightbox animation | Lightbox appears/disappears with **no enter/exit animation** (conditional render). Interaction richness is in behaviour (focus trap, keyboard nav, inert background), not motion. |
| Reduced-motion | ✅ Honoured globally — `@media (prefers-reduced-motion: reduce)` collapses all animation/transition durations to `0.01ms` and disables smooth scroll ([globals.css:787-794](../src/app/globals.css#L787)). |
| Shared-element / gesture capability | No current dependency provides it. Swipe/drag in the lightbox is **not** implemented (keyboard + button only). |

**Native vs. new dependency.** Everything the site does today is achievable with plain CSS + React state, and is. For the redesign:
- **Achievable natively (no new dep):** hover/press micro-interactions, menu/lightbox fade+scale (add CSS transitions on opacity/transform with a mounted state), reduced-motion gating, and **native CSS View Transitions** for cross-page and cross-fade choreography (Next 15 App Router supports the `next/experimental` / native `document.startViewTransition` path; progressive-enhancement friendly).
- **Would genuinely need a new dependency:** spring-physics choreography, gesture/drag (swipe-to-dismiss lightbox, pinch-zoom), complex orchestrated timelines, or FLIP shared-element transitions with fine control — these justify a library (e.g. Motion) **only if** the design brief calls for them. Do not add one by default.

---

## 10. Deployment, SEO and analytics

| Aspect | Finding |
| ------ | ------- |
| Host / config | Netlify via [netlify.toml](../netlify.toml). Build `npm run build`, publish `.next`, `NODE_VERSION=24`, plugin `@netlify/plugin-nextjs` (declared explicitly because an API-created git build didn't auto-engage it — see the file's header comment). |
| Build output | `.next` (App Router). No `output: 'export'` — this is a served Next app, not a static export, so the dynamic route and metadata routes work. |
| Redirects / rewrites | **None** defined (no `_redirects`, no `redirects()`/`rewrites()` in `next.config`). Routing is entirely file-based. |
| Dynamic-route handling | `/gallery/[year]/[artworkId]` prerendered for all 57 works via `generateStaticParams`; unmatched → `notFound()` → 404 page. |
| Forms | **None.** Netlify Forms not used. Enquiry is a `mailto:` link only. |
| Headers / caching | Security headers set for **all** paths in [next.config.ts:20-46](../next.config.ts#L20): CSP (same-origin, `'unsafe-inline'` for scripts/styles to cover hydration + no-flash + font inlining), `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, HSTS (2yr, preload). No custom `Cache-Control` (Netlify/Next defaults apply). |
| Sitemap | [src/app/sitemap.ts](../src/app/sitemap.ts) → `/sitemap.xml`: 5 static routes + 57 artwork URLs, with `changeFrequency`/`priority`. |
| Robots | [src/app/robots.ts](../src/app/robots.ts) → allow all, references sitemap + host. |
| Titles / descriptions | Root metadata + per-page `metadata` exports (About/CV/Contact/Gallery) and `generateMetadata` on the detail route. Title template `%s \| Peadar Jolliffe-Byrne` ([layout.tsx:24-56](../src/app/layout.tsx#L24)). |
| Open Graph / social | Global OG + Twitter `summary_large_image` in root metadata; dynamic OG image at [src/app/opengraph-image.tsx](../src/app/opengraph-image.tsx) (1200×630, gradient). Detail route overrides OG with the artwork's `image.large`. |
| Canonical URLs | `alternates.canonical` set per page (`/`, `/gallery`, `/about`, `/cv`, `/contact`); `metadataBase` from `siteUrl`. Detail route does **not** set an explicit canonical (inherits base). |
| Structured data | **None.** No JSON-LD (`VisualArtwork`, `Person`, `BreadcrumbList`) — an SEO opportunity for Phase 1. |
| Analytics / telemetry | **None.** No GA, Plausible, Netlify Analytics tag, or Vercel Analytics. CSP forbids third-party scripts by default. |
| Error monitoring | **None.** No Sentry/etc. No `error.tsx` boundary. |

**Environment variable names (values redacted):** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ENQUIRY_EMAIL`. Both are public by prefix; no secrets are present in the repo.

---

## 11. Accessibility baseline

Distinguishing **manual code inspection** (done here) from **automated tooling** (no axe/Lighthouse run was performed in this environment — see limitations).

| Aspect | Finding (manual, from source) |
| ------ | ------ |
| Heading structure | Generally sound: each page has one `<h1>` (`.headline`), sections use `<h2>`/`<h3>`. Home has `h1` then `h2 Collections` then `h3` per year — logical. Gallery: `h1` → per-year `h2` → card `h3`; Upland Folk injects an `h3` ("Series Context") between the year `h2` and card `h3`s — acceptable but worth reviewing for order. |
| Landmarks | `<header class="site-header">`, `<main id="main-content">`, `<nav aria-label="Primary">`. **No `<footer>`, no `<aside>`.** Pages use `<section>`/`<article>` semantically. |
| Keyboard navigation | Strong. Nav is real `<Link>`/`<button>`. Lightbox implements a full focus trap, Escape/Arrow handling, and restores focus to the trigger on close ([artwork-lightbox.tsx:27-117](../components/artwork-lightbox.tsx#L27)). Mobile menu closes on Escape ([site-header.tsx:31-42](../components/site-header.tsx#L31)). |
| Visible focus | Global `:focus-visible` outline (3px, `--focus-ring`, offset) ([globals.css:91-95](../src/app/globals.css#L91)); `.site-shell` suppresses its own outline (it's a skip target, not a control). |
| Skip link | ✅ `.skip-link` → `#main-content`, visually hidden until focused ([layout.tsx:73-75](../src/app/layout.tsx#L73), [globals.css:103-121](../src/app/globals.css#L103)). |
| Menu semantics | Toggle button has `aria-expanded`, `aria-controls="primary-navigation"`, dynamic `aria-label`. Active link uses `aria-current="page"`. |
| Form labels / errors | N/A — no forms. |
| Image alt text | All `next/image` have non-empty `alt`, but it is **templated** (`"{title} artwork"`), not descriptive of content. Decorative hero glow correctly `aria-hidden`. The two Upland Folk SVGs share alt "Upland Folk title graphic" (both light/dark rendered, one hidden per theme — a screen reader may still encounter the hidden one depending on `display:none` handling; `display:none` does remove it, so acceptable). |
| Colour contrast | Author has clearly tuned for AA: comments note the CTA gradient and `--link` were darkened to clear 4.5:1 ([globals.css:32-35,47-49](../src/app/globals.css#L32)). Not machine-verified here. `--text-muted` on card backgrounds should be spot-checked. |
| Target sizes | Nav toggle is 44×44 ([globals.css:202-204](../src/app/globals.css#L202)). `.btn` padding yields comfortable targets; `.btn-compact` and `.lightbox-nav` are smaller — verify ≥24px (WCAG 2.2 2.5.8) / ideally 44px on touch. |
| Hover-only information | None found — hover only changes styling, never reveals content. |
| Modal focus handling | Excellent (see keyboard row); background set `inert` and body scroll locked while open ([artwork-lightbox.tsx:79-100](../components/artwork-lightbox.tsx#L79)). |
| Reduced motion | ✅ Global reduce block ([globals.css:787](../src/app/globals.css#L787)). |
| Zoom / text resize | Fluid `clamp()` + `rem` units + `ch`-based prose widths → resizes gracefully; no fixed-px text blocks that would clip at 200% zoom. Sticky header could occlude content at very large zoom — worth a check. |

**Automated findings:** none produced in this session (no axe-core/Lighthouse in the toolchain; no headless browser run). Recommended for Phase 1 CI.

---

## 12. Performance baseline

**Production build result:** ✅ Success (exit 0). Next.js 15.5.20, compiled in ~5.5s, **68 static pages** generated (5 static routes + 57 artwork SSG pages + metadata routes + 404). No warnings or errors.

**Bundle sizes (from build output):**

| Route | Route size | First Load JS |
| ----- | ---------- | ------------- |
| `/` | 165 B | 106 kB |
| `/gallery` | 174 B | 111 kB |
| `/gallery/[year]/[artworkId]` | 861 B | 112 kB |
| `/about`, `/cv`, `/contact`, `/_not-found` | 140 B | 103 kB |
| metadata routes (`/robots.txt`, `/sitemap.xml`, `/opengraph-image`) | 140 B | 103 kB |
| **Shared by all** | — | **102 kB** |

Shared JS = 102 kB (chunks: 46.2 kB + 54.2 kB framework/react + ~2 kB). Per-route JS is negligible (≤861 B) — a direct consequence of the Server-Component-heavy design. This is a lean baseline; the redesign's JS budget headroom is good.



**Measurement caveats (stated plainly):**
- **No Lighthouse / Web-Vitals field data** was collected in this environment (no headless browser). Those numbers must come from a real Netlify preview + Lighthouse/PageSpeed run — do not treat any figure here as a lab measurement.
- Bundle sizes below are from the local production build output only.

**Static/structural observations (reliable without a browser):**
- **Largest JS dependencies (runtime):** `next` + `react`/`react-dom` dominate; app-level additions are tiny — `zustand` (state), `zod` (validation, runs at build/module load), `clsx` (bytes). No heavy client libraries.
- **Client components (hydration surface):** only `SiteHeader`, `ThemeToggle`, `ThemeSync`, `ArtworkLightbox`, `LightboxTrigger` are `"use client"`. Pages and cards are Server Components → small JS payload.
- **Fonts:** 2 Google families self-hosted via `next/font` (Sora, Spectral 400/500/700), `display:swap`, subset `latin`, no external requests → no render-blocking font CSS.
- **Image payload:** ~34.7 MB total on disk (see [§8](#8-image-pipeline)); per-page transfer is far lower thanks to responsive `sizes` + CDN resizing, but detail/lightbox `-large` at quality 90–96 is the main mobile-weight risk.
- **LCP candidate:** detail page = the `priority` hero `<Image>`; gallery = first in-view card image; home = text headline over the CSS glow (no image LCP). 
- **CLS risks:** low — all images carry explicit `width`/`height`; sticky header is fixed-height; no late-injected banners. Watch font-swap reflow on the serif `.headline`.
- **INP risks:** low — minimal JS, no scroll listeners; lightbox keydown handler is lightweight. Mobile menu toggles `display` (no layout thrash loop).
- **Main-thread animation risks:** none — all transitions are `transform`/opacity/colour; no JS animation loop, no `@keyframes`.

---

## 13. Technical risk register

| Risk | Evidence | Likelihood | Impact | Phase affected | Mitigation |
| ---- | -------- | ---------- | ------ | -------------- | ---------- |
| Redesign needs fields the schema lacks (description, series, tags, availability, multiple images) | [lib/content-schema.ts](../lib/content-schema.ts) has only 6 fields + one image | High | High | Content model / all page redesigns | Extend `artworkSchema` additively with optional fields; keep Zod validation; migrate `content/artworks.ts` in a typed step. |
| Enquiry email is a hard-coded personal Gmail fallback | [enquiry-button.tsx:5](../components/enquiry-button.tsx#L5) fallback `peadarjb@gmail.com` (matches the `.env.example` placeholder); if `NEXT_PUBLIC_ENQUIRY_EMAIL` is unset on Netlify, this personal address ships to production | Medium | High (wrong/unintended contact = lost enquiries) | Deployment / contact | Confirm the intended production address, set `NEXT_PUBLIC_ENQUIRY_EMAIL` in Netlify env, and update the fallback to match; consider a server-side form later. |
| Theme flash / hydration mismatch if no-flash script or `suppressHydrationWarning` is disturbed | [layout.tsx:59-71](../src/app/layout.tsx#L59), `ThemeToggle` mounted-guard [theme-toggle.tsx:14-17](../components/theme-toggle.tsx#L14) | Medium | Medium | Theme / rendering | Preserve the inline script + `data-theme` default + mounted-guard pattern verbatim when restyling. |
| No `prefers-color-scheme` default — first-time dark-mode users see light | [globals.css:38-63](../src/app/globals.css#L38); default `data-theme="light"` | Medium | Low | Theme | Optionally seed initial theme from system in the no-flash script (progressive enhancement). |
| Route transitions: adding View Transitions/animation could break history/scroll or double-hydrate | No transitions today ([§9](#9-existing-animation-and-interaction-stack)) | Medium | Medium | Route transitions / history | Add as progressive enhancement behind reduced-motion + feature detection; test back/forward + scroll restoration. |
| Image weight on mobile (large variants, no blur placeholder, some soft sources) | ~34.7 MB total; quality 90–96 on `-large`; several 450–800px sources ([§8](#8-image-pipeline)) | Medium | Medium | Image loading / performance | Add `placeholder="blur"`, re-check `sizes`, consider lower detail quality, regenerate higher-res sources where originals exist. |
| Lightbox lacks touch gestures; instant (unanimated) open on mobile | [artwork-lightbox.tsx](../components/artwork-lightbox.tsx) | Low | Low | Mobile UX | Add swipe/close gestures only if brief requires; keep keyboard parity. |
| Accessibility regressions during restyle (contrast, target size, focus) | AA-tuned tokens + focus styles today ([§11](#11-accessibility-baseline)) | Medium | High | Accessibility | Re-verify contrast when re-valuing tokens; keep `:focus-visible`, skip link, focus trap; add automated axe checks to CI. |
| Deployment: plugin must stay engaged or every route 404s | [netlify.toml](../netlify.toml) header comment documents a prior 404 incident | Low | High | Deployment / redirects | Keep `[[plugins]] @netlify/plugin-nextjs` explicit; verify on preview after any Netlify config change. |
| Data placeholder `"Not recorded"` surfaces in UI | `2020-3-figures` ([artworks.ts:503-504](../content/artworks.ts#L503)) | Low | Low | Content | Backfill real medium/dimensions or handle placeholder in the view. |
| Templated alt text weakens SEO/a11y | All 57 works `"{title} artwork"` | Low | Medium | Content / a11y | Author descriptive alt text as part of the content pass. |

---

## 14. Phase 1 constraints and opportunities

**Reuse (these are solid — build on them):**
- The **three-layer CSS custom-property token system** ([globals.css:1-63](../src/app/globals.css#L1)) — already primitive→semantic→component. Extend, don't replace.
- **Data + query layer** ([content/artworks.ts](../content/artworks.ts), [lib/artwork-queries.ts](../lib/artwork-queries.ts), Zod schema) — typed, tested, validated.
- **Theme system** (Zustand persist + `data-theme` + no-flash script) — robust and hydration-safe.
- **Lightbox accessibility scaffolding** — focus trap, inert, keyboard nav, scroll lock. Reskin the chrome, keep the behaviour.
- **`next/image` + Netlify Image CDN** delivery; **`next/font`** self-hosting.
- **CI** ([.github/workflows/ci.yml](../.github/workflows/ci.yml)) runs lint/typecheck/test/build on both branches — wire new checks here.

**Avoid / do not disturb:**
- Do not switch styling frameworks — no need for Tailwind/CSS-in-JS; the global-stylesheet + token approach is sufficient and low-risk.
- Do not add `output: 'export'` — it would break the dynamic route and metadata routes.
- Do not remove the inline no-flash script or `suppressHydrationWarning`.
- Do not weaken the CSP without cause; adding third-party scripts (analytics, fonts) means updating [next.config.ts](../next.config.ts#L6) deliberately.
- Do not add an animation library "because it's popular" (see [§9](#9-existing-animation-and-interaction-stack)).

**Safest place for an isolated design laboratory:** a new route segment **`src/app/design-lab/`** (a folder that does not exist yet). It is naturally excluded from navigation because nav items are a hard-coded list in [site-header.tsx:11-17](../components/site-header.tsx#L11) — a new route simply won't appear. It also stays out of `sitemap.ts`/`robots` unless explicitly added.

**Recommended token-file location:** introduce a dedicated `src/app/tokens.css` (or `styles/tokens.css`) imported before `globals.css`, holding the primitive+semantic layers, so Phase-1 experiments can override tokens without editing the large `globals.css`. Alternatively keep tokens in `globals.css` and add a `design-lab.css` scoped to the lab route.

**Can `/design-lab` be excluded from production navigation?** Yes — trivially, as above. To also exclude it from the *build/sitemap*, gate the route on an env flag (`if (process.env.NEXT_PUBLIC_ENABLE_DESIGN_LAB !== 'true') notFound()`) and omit it from `sitemap.ts`.

**Container queries practical?** Yes. The layout already leans on intrinsic sizing (`auto-fit`/`minmax`, `clamp()`); cards are self-contained and would benefit from `@container` for card-internal responsiveness. Browser support is broad in 2026. Low risk to adopt in the lab first.

**Native View Transitions as progressive enhancement?** Yes, recommended. No animation library exists to conflict, reduced-motion is already respected globally, and Next 15 App Router supports the native path. Gate behind feature detection + `prefers-reduced-motion` so unsupported browsers get instant navigation (today's behaviour).

**Recommended animation approach for THIS repo:** stay **CSS-first**. Add small, token-driven `transition`s for enter/exit (opacity + transform) using a mounted-state pattern for the lightbox and mobile menu; adopt **native CSS View Transitions** for page/cross-fade choreography. Reach for a JS animation library **only** if the design brief demands spring physics, gesture/drag, or FLIP shared-element control — none of which the current UX needs.

**Outstanding questions (cannot be answered from source):**
1. Correct production enquiry email, and whether a real contact form (Netlify Forms / server action) is wanted instead of `mailto:`.
2. Whether higher-resolution originals exist for the soft 2021 / low-res 2020 works (affects lightbox fidelity).
3. Intended production domain (to finalise `NEXT_PUBLIC_SITE_URL`, canonicals, OG).
4. Whether descriptions, series metadata, availability/pricing, exhibition history, and multiple images per work will be added (drives the schema extension in [§13](#13-technical-risk-register)).
5. Desired analytics/consent posture (affects CSP and whether any third-party script is permitted).
6. Real vs. auto-generated alt text ownership for the 57 works.

---

### Audit metadata
- Files created by this audit: `docs/phase-0-audit.md`, `docs/phase-0-manifest.json`.
- No production source, routes, data, styles, or configuration were modified.
- Commands run: `git` inspection, `npm run typecheck` (pass), `npm run lint` (pass), `npm run test` (pass), `npm run build` (result in [§12](#12-performance-baseline)). No temporary files remain.
</content>
</invoke>
