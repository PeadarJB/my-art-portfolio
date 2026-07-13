import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";

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

test.describe("homepage accessibility (axe)", () => {
  test("no violations in the paper (light) theme", async ({ page }) => {
    await page.goto("/");
    expect(await auditViolations(page)).toEqual([]);
  });

  test("no violations in the soot (dark) theme", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "portfolio-ui",
        JSON.stringify({ state: { theme: "dark" }, version: 0 }),
      );
    });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await auditViolations(page)).toEqual([]);
  });
});
