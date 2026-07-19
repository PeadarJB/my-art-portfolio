import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";

/**
 * WCAG 2.1 A/AA axe audits across every screen of the V2 redesign, including
 * both the white gallery and the Upland Folk soot room.
 */

async function auditViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  // Map to a readable summary so a failure names the rule + count, not a wall
  // of nested nodes.
  return results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.length,
  }));
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("pjb-intro-seen", "1");
  });
});

const screens: Array<{ name: string; path: string; ready?: string }> = [
  { name: "homepage", path: "/", ready: ".chapter-row" },
  { name: "gallery — Upland Folk soot room", path: "/gallery", ready: ".series-intro" },
  { name: "gallery — white room", path: "/gallery?y=2021", ready: ".caption-bar" },
  {
    name: "artwork detail — soot room",
    path: "/gallery/2022/2022-dawn",
    ready: ".caption-bar",
  },
  {
    name: "artwork detail — white room",
    path: "/gallery/2019/2019-clouds",
    ready: ".caption-bar",
  },
  { name: "about", path: "/about" },
  { name: "cv", path: "/cv" },
  { name: "contact", path: "/contact" },
];

for (const screen of screens) {
  test(`no violations: ${screen.name}`, async ({ page }) => {
    await page.goto(screen.path);
    if (screen.ready) {
      await page.locator(screen.ready).first().waitFor();
    }
    expect(await auditViolations(page)).toEqual([]);
  });
}
