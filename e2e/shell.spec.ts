import { test, expect, type Page } from "@playwright/test";

// Seed the persisted store BEFORE any page script so the no-flash script reads
// the dark theme at paint. The site has no `prefers-color-scheme` default, so
// `emulateMedia({ colorScheme })` alone does NOT switch the theme — the store
// must be seeded (or the toggle clicked).
async function seedDarkTheme(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem(
      "portfolio-ui",
      JSON.stringify({ state: { theme: "dark" }, version: 0 }),
    );
  });
}

const WIDTHS = [390, 768, 1440, 1920];

test.describe("homepage structure", () => {
  test("has exactly one h1 (the artist name)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Peadar Jolliffe-Byrne");
  });

  test("has the expected h2 section sequence", async ({ page }) => {
    await page.goto("/");
    const headings = await page.locator("main h2").allTextContents();
    expect(headings.map((text) => text.trim())).toEqual([
      "Introduction",
      "Upland Folk",
      "Selected works",
      "Archive",
      "Enquiries",
    ]);
  });

  test("preloads exactly one hero image (the LCP candidate)", async ({ page }) => {
    await page.goto("/");
    const preloads = page.locator('link[rel="preload"][as="image"]');
    await expect(preloads).toHaveCount(1);
    await expect(preloads).toHaveAttribute("imagesrcset", /WildHunt/i);
  });

  test("archive index links to each gallery year anchor", async ({ page }) => {
    await page.goto("/");
    for (const year of [2022, 2021, 2020, 2019]) {
      await expect(
        page.locator(`.archive-row-link[href="/gallery#year-${year}"]`),
      ).toHaveCount(1);
    }
  });
});

test.describe("full-bleed guard", () => {
  for (const width of WIDTHS) {
    test(`no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      // Allow sub-pixel rounding; a real full-bleed leak is tens of pixels.
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});

test.describe("ultra-wide alignment", () => {
  test("header, page and footer share the capped canvas column at 1920px", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    const header = await page.locator(".site-header-inner").boundingBox();
    const shell = await page.locator("main.site-shell").boundingBox();
    const footer = await page.locator(".site-footer-inner").boundingBox();
    expect(header && shell && footer).toBeTruthy();

    // All three capped containers align on the same left edge and width.
    expect(Math.abs(header!.x - shell!.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(footer!.x - shell!.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(header!.width - shell!.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(footer!.width - shell!.width)).toBeLessThanOrEqual(1);
  });
});

test.describe("theme", () => {
  test("defaults to the paper (light) theme", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("applies the persisted dark (soot) theme at paint", async ({ page }) => {
    await seedDarkTheme(page);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("motion", () => {
  test("hero is immediately visible under reduced motion", async ({ browser }) => {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    await page.goto("/");
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    const opacity = await h1.evaluate((el) => Number(getComputedStyle(el).opacity));
    expect(opacity).toBe(1);
    await page.close();
  });
});
