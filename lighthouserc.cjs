/**
 * Lighthouse CI configuration.
 *
 * Runs against a real deployed URL when `LHCI_TARGET_URL` is set (the CI job
 * passes the Netlify deploy-preview URL), and against a local `next start`
 * otherwise, so the same budget can be checked locally and on Netlify.
 *
 * Local:  npm run build && npm run lighthouse
 * CI:     LHCI_TARGET_URL=<netlify-preview-url> npx lhci autorun
 */
const rawBase = process.env.LHCI_TARGET_URL || "http://localhost:3000";
const base = rawBase.replace(/\/$/, "");
const isLocal = base.includes("localhost") || base.includes("127.0.0.1");

module.exports = {
  ci: {
    collect: {
      // Only self-host a server for local runs; against a Netlify preview we
      // audit the already-deployed URL.
      ...(isLocal
        ? {
            startServerCommand: "npm run start",
            startServerReadyPattern: "Ready",
            startServerReadyTimeout: 120000,
          }
        : {}),
      url: [
        `${base}/`,
        `${base}/gallery`,
        `${base}/gallery/2022/2022-remnants-of-the-wild-hunt`,
      ],
      numberOfRuns: 3,
    },
    assert: {
      // Accessibility is held to a hard threshold (the homepage already has zero
      // axe violations in both themes). Performance/best-practices/SEO and the
      // individual metrics are warnings: this is an image-led portfolio, so
      // mobile image weight can move the perf score, and we don't want a slow
      // network run to fail the pipeline — the numbers are still surfaced.
      assertions: {
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:performance": ["warn", { minScore: 0.7 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.9 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 4000 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],
      },
    },
    upload: {
      // No LHCI server or secrets required; prints a public report URL per run.
      target: "temporary-public-storage",
    },
  },
};
