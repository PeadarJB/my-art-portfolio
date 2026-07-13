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

## Lighthouse CI (Web Vitals)

Lighthouse CI (`@lhci/cli`) measures performance / accessibility / best-practices
/ SEO and the core metrics (LCP, CLS, TBT). It fills the Web-Vitals gap noted in
the Phase 0 audit.

- **Config:** `lighthouserc.cjs`. It audits `/`, `/gallery` and one artwork detail
  page, 3 runs each, and asserts a budget: accessibility is a hard gate
  (`error`, ≥0.95); performance/best-practices/SEO and the individual metrics are
  `warn` (this is an image-led portfolio — mobile image weight and a slow network
  run shouldn't fail the pipeline, but the numbers are still surfaced). Reports
  upload to `temporary-public-storage` (a public report URL per run; no server or
  secret needed).
- **URL:** reads `LHCI_TARGET_URL`. In CI that's the Netlify deploy URL, so
  Lighthouse measures the **real preview** (Netlify Image CDN + headers). With no
  env var it targets a local `next start`.

```bash
# Local run against the local production build:
npm run build
npm run lighthouse

# Local run against a specific deployed URL (e.g. a Netlify preview):
LHCI_TARGET_URL=https://deploy-preview-XX--your-site.netlify.app npm run lighthouse
```

### CI — `.github/workflows/lighthouse.yml`

Triggered by `deployment_status`: when Netlify finishes a deploy and reports it to
GitHub, the job runs `npx lhci autorun` against
`deployment_status.environment_url` (the live deploy).

**Two prerequisites/gotchas:**

1. **Netlify → GitHub connection.** The repo must be connected via the Netlify
   GitHub App with Deploy Previews enabled, so `deployment_status` events fire. If
   your Netlify site is not GitHub-App-connected (the Phase 0 note about an
   API-created build suggests confirming this), the workflow won't trigger — in
   that case switch it to the token-based pattern (a `wait-for-netlify` action +
   `NETLIFY_AUTH_TOKEN`/site-ID secrets) or run `npm run lighthouse` with an
   explicit `LHCI_TARGET_URL` from another job.
2. **Default-branch activation.** `deployment_status` workflows run the copy of
   the file on the **default branch (`master`)**. This workflow will not run on
   the PR that introduces it; it activates once merged to `master`, then runs on
   every subsequent deploy.

### Local execution note (this machine)

`@lhci/cli` could not be run locally in the OneDrive-synced working copy: node
throws `UNKNOWN … read (errno -4094)` while requiring the freshly-installed
Lighthouse dependency files — the known OneDrive read-lock during sync (see the
project memory), not a config problem. The config was validated independently
(loads, resolves the three URLs and the seven assertions) and `next start` is
known-good (the Playwright suite drives it). Lighthouse therefore runs in CI
(Linux, unaffected) against the Netlify preview — which is also the only place a
real preview URL exists. To run locally, let OneDrive finish syncing
`node_modules` first (or use a non-synced checkout).

## Not included (deliberately)

- Visual-regression snapshots — Playwright's `toHaveScreenshot` is available if
  wanted; left out for now to avoid baseline churn across OSes.
