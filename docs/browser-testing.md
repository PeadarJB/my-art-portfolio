# Browser testing (Playwright + axe)

Automated end-to-end / accessibility checks for the global shell and homepage.
These run in a **real browser against the production server** (`next start`), so
they exercise the true CSP, security headers and static output — not a dev build.

They complement, they do not replace, the human visual review of composition and
"does it read as intentional" judgments (see
`docs/phase-2-homepage-and-shell.md` §17). Tooling catches regressions; taste
stays human.

## What is covered

`e2e/shell.spec.ts` — deterministic shell + homepage assertions:

- Exactly one `<h1>` (the artist name) and the expected `<h2>` sequence
  (Introduction → Upland Folk → Selected works → Archive → Enquiries).
- Exactly **one** preloaded hero image (the LCP candidate) and that it is the
  Wild Hunt hero.
- Archive index links to every gallery year anchor.
- **No horizontal scroll** at 390 / 768 / 1440 / 1920px — guards the full-bleed
  soot band (`.home-bleed` + `body { overflow-x: clip }`).
- **Ultra-wide alignment**: the header, page and footer share the same capped
  canvas column (same left edge and width) at 1920px.
- Theme: defaults to paper (light); applies the persisted dark (soot) theme at
  paint.
- Reduced motion: the hero is immediately visible (opacity 1, no entrance
  animation).

`e2e/a11y.spec.ts` — axe (`wcag2a/2aa/21a/21aa`) on the homepage in **both** the
paper and soot themes; asserts zero violations. Automated a11y catches the
mechanical issues (contrast, accessible names, landmarks, ARIA) — roughly
40–50% of the WCAG surface — not everything.

## Running locally

```bash
npm run build          # produce .next (the e2e server serves this)
npm run e2e:install    # one-time: download the Chromium binary
npm run test:e2e       # runs the checks; auto-starts `next start`
npm run test:e2e:ui    # optional interactive runner
```

The Playwright server config (`playwright.config.ts`) starts `next start` for
you and, locally, reuses an already-running server on port 3000.

## Project-specific gotchas

- **Theme does not switch via `emulateMedia({ colorScheme })`.** The site has no
  `prefers-color-scheme` default; the theme lives in
  `localStorage['portfolio-ui']` and is applied by the no-flash script. Seed it
  before navigation:

  ```ts
  await page.addInitScript(() =>
    localStorage.setItem("portfolio-ui", JSON.stringify({ state: { theme: "dark" }, version: 0 })),
  );
  ```

- **Reduced motion works via emulation** (`browser.newPage({ reducedMotion: "reduce" })`)
  because the site honours `prefers-reduced-motion`.

- **OneDrive / Windows:** Playwright caches browser binaries in
  `%LOCALAPPDATA%/ms-playwright`, outside the OneDrive-synced repo, so it avoids
  the native-binary/rapid-write issue that affects `sharp`. Visual snapshots (if
  added later) are OS/font-rendering-specific — pin any `toHaveScreenshot`
  baselines to the Linux CI runner, not a local Windows machine.

## CI

`.github/workflows/ci.yml` runs a separate **`e2e`** job (parallel to the
lint/typecheck/unit/build `verify` job): `npm ci` →
`npx playwright install --with-deps chromium` → `npm run build` →
`npm run test:e2e`, and uploads the HTML report as an artifact.
