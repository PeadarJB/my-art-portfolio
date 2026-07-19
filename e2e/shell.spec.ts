import { test, expect, type Page } from "@playwright/test";

/**
 * Browser checks for the V2 gallery redesign: white ground, soot room for
 * Upland Folk, slideshow-first gallery, hero carousel, and the once-per-session
 * intro splash.
 */

const SOOT = "rgb(23, 20, 18)"; // #171412
const WHITE = "rgb(255, 255, 255)";

// Most tests skip the intro splash by pretending it has already played.
async function skipIntro(page: Page): Promise<void> {
  await page.addInitScript(() => {
    sessionStorage.setItem("pjb-intro-seen", "1");
  });
}

test.describe("intro splash", () => {
  test("plays once per session on the homepage, then never again", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".intro-splash")).toBeVisible();
    await expect(page.locator(".intro-splash")).toBeHidden({ timeout: 6000 });

    await page.reload();
    await expect(page.locator(".intro-splash")).toBeHidden();
  });

  test("is not shown under reduced motion", async ({ browser }) => {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator(".intro-splash")).toBeHidden();
    await expect(page.locator(".site-header .brand")).toBeVisible();
    await page.close();
  });
});

test.describe("homepage", () => {
  test.beforeEach(async ({ page }) => {
    await skipIntro(page);
  });

  test("shows brand and primary navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".site-header .brand")).toHaveText("Peadar Jolliffe-Byrne");
    for (const label of ["Gallery", "About", "CV", "Contact"]) {
      await expect(page.locator(".site-nav").getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("hero carousel loads with a zero-padded counter over the full archive", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator(".home-viewer .caption-counter")).toHaveText(/^\d{2} \/ 57$/, {
      timeout: 10_000,
    });
  });

  test("chapter menu lists all four series with deep links", async ({ page }) => {
    await page.goto("/");
    const rows = page.locator(".chapter-row");
    await expect(rows).toHaveCount(4);

    const expected = [
      { name: "Upland Folk", href: "/gallery?y=2022" },
      { name: "Oil Pastels", href: "/gallery?y=2021" },
      { name: "Works on Paper", href: "/gallery?y=2020" },
      { name: "Early Works", href: "/gallery?y=2019" },
    ];
    for (const [index, chapter] of expected.entries()) {
      await expect(rows.nth(index).locator(".chapter-name")).toHaveText(chapter.name);
      await expect(rows.nth(index)).toHaveAttribute("href", chapter.href);
    }
  });

  test("the Upland Folk chapter row is the only soot row", async ({ page }) => {
    await page.goto("/");
    const sootRows = page.locator(".chapter-row.is-soot");
    await expect(sootRows).toHaveCount(1);
    await expect(sootRows.locator(".chapter-name")).toHaveText("Upland Folk");
  });
});

test.describe("gallery", () => {
  test.beforeEach(async ({ page }) => {
    await skipIntro(page);
  });

  test("opens on the Upland Folk chapter in the soot room with the series intro", async ({
    page,
  }) => {
    await page.goto("/gallery");
    await expect(page.locator(".viewer-page")).toHaveCSS("background-color", SOOT);
    await expect(page.locator(".caption-counter")).toHaveText("Series");
    await expect(page.locator(".series-intro")).toBeVisible();
  });

  test("arrow keys step from the intro slide into the numbered works", async ({ page }) => {
    await page.goto("/gallery");
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(".caption-counter")).toHaveText("01 / 08");
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(".caption-counter")).toHaveText("Series");
  });

  test("deep links select the chapter and the room turns white", async ({ page }) => {
    await page.goto("/gallery?y=2020");
    await expect(page.locator(".viewer-page")).toHaveCSS("background-color", WHITE);
    await expect(page.locator(".subbar-muted")).toHaveText("2020 · 15 works");
    await expect(page.locator(".caption-counter")).toHaveText("01 / 15");
  });

  test("chapter tabs crossfade between soot and white rooms", async ({ page }) => {
    await page.goto("/gallery");
    await expect(page.locator(".viewer-page")).toHaveCSS("background-color", SOOT);

    await page.getByRole("button", { name: "Oil Pastels" }).click();
    await expect(page.locator(".viewer-page")).toHaveCSS("background-color", WHITE, {
      timeout: 5000,
    });
    await expect(page.locator(".subbar-muted")).toHaveText("2021 · 10 works");
  });

  test("See All opens the sheet view and a cell returns to the slideshow", async ({ page }) => {
    await page.goto("/gallery?y=2022");
    await page.getByRole("button", { name: "See All" }).click();
    const cells = page.locator(".sheet-cell");
    await expect(cells).toHaveCount(8);

    await cells.nth(2).click();
    await expect(page.locator(".caption-counter")).toHaveText("03 / 08");
  });
});

test.describe("artwork detail", () => {
  test.beforeEach(async ({ page }) => {
    await skipIntro(page);
  });

  test("renders the expanded plate with counter, caption and enquiry", async ({ page }) => {
    await page.goto("/gallery/2022/2022-dawn");
    await expect(page.locator(".viewer-page")).toHaveCSS("background-color", SOOT);
    await expect(page.locator(".caption-counter")).toHaveText("02 / 08");
    await expect(page.locator(".header-back")).toHaveText(/2022 — Upland Folk/);
    await expect(page.locator(".caption-action")).toHaveText("Enquire");
  });

  test("arrow keys navigate to the neighbouring work routes", async ({ page }) => {
    await page.goto("/gallery/2022/2022-dawn");
    // Sync on the counter before each keypress so the new route's key
    // listeners are attached (guards against pressing during a transition).
    await expect(page.locator(".caption-counter")).toHaveText("02 / 08");

    await page.keyboard.press("ArrowRight");
    await page.waitForURL("**/gallery/2022/2022-escape-from-the-cave");
    await expect(page.locator(".caption-counter")).toHaveText("03 / 08");

    await page.keyboard.press("ArrowLeft");
    await page.waitForURL("**/gallery/2022/2022-dawn");
    await expect(page.locator(".caption-counter")).toHaveText("02 / 08");
  });

  test("white room for non-Upland-Folk years", async ({ page }) => {
    await page.goto("/gallery/2019/2019-clouds");
    await expect(page.locator(".viewer-page")).toHaveCSS("background-color", WHITE);
    await expect(page.locator(".header-back")).toHaveText(/2019 collection/);
  });
});

test.describe("layout guards", () => {
  test.beforeEach(async ({ page }) => {
    await skipIntro(page);
  });

  for (const width of [390, 768, 1440, 1920]) {
    test(`no horizontal scroll on the homepage at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  test("gallery and detail pages fit the viewport without vertical scroll", async ({ page }) => {
    for (const path of ["/gallery?y=2021", "/gallery/2020/2020-self-portrait"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollHeight - document.documentElement.clientHeight
      );
      expect(overflow, `${path} should not scroll vertically`).toBeLessThanOrEqual(1);
    }
  });
});
