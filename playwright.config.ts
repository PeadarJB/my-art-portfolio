import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end / browser checks for the global shell and homepage.
 *
 * These run against a real production server (`next start`) so they exercise the
 * true CSP, headers and static output — not a dev build. Locally, start the
 * server yourself (`npm run build` once, then the tests reuse it); in CI the
 * server is started fresh. Browser binaries live in the Playwright cache
 * (`%LOCALAPPDATA%/ms-playwright`), outside the OneDrive-synced repo.
 */
const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
