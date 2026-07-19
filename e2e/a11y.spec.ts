import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";

/**
 * WCAG 2.1 A/AA axe audits across every screen of the V2 redesign, including
 * both the white gallery and the Upland Folk soot room.
 */

async function auditViolations(page: Page) {
  // Freeze motion before scanning: axe blends semi-transparent text with the
  // ground, so a scan landing inside an entrance animation's easing tail
  // (~96% opacity) fails marginal pairs that pass at steady state. Contrast
  // is a steady-state property — audit the settled page.
  await page.addStyleTag({
    content:
      "*, *::before, *::after { animation: none !important; transition: none !important; }",
  });

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  // Map to a readable summary so a failure names the rule and the offending
  // selectors, not a wall of nested nodes.
  return results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.map(
      (node) => `${node.target.join(" ")} :: ${node.failureSummary?.replace(/\s+/g, " ")}`
    ),
  }));
}

// Audits run under reduced motion so entrance animations and the 600ms room
// crossfade settle instantly: axe measures steady-state colours, not a
// mid-transition blend frame. (All steady-state pairings pass AA; contrast
// during a crossfade frame is not a WCAG criterion.)
test.use({ reducedMotion: "reduce" });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("pjb-intro-seen", "1");
  });
});

const screens: Array<{ name: string; path: string; ready?: string }> = [
  // The hero plate mounts client-side; waiting for it means the audit covers
  // the populated carousel (first slide is 2022, i.e. the soot stage).
  { name: "homepage", path: "/", ready: ".hero-plate" },
  { name: "gallery — Upland Folk soot room", path: "/gallery", ready: ".series-intro" },
  { name: "gallery — white room", path: "/gallery?y=2021", ready: ".stage-plate" },
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
