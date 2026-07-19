import Link from "next/link";
import clsx from "clsx";

import { HomeCarousel } from "@/components/home-carousel";
import { IntroSplash } from "@/components/intro-splash";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { artworksByYearDescending } from "@/content/artworks";

const UPLAND_FOLK_YEAR = 2022;

/**
 * V2 homepage:
 *   1. Intro splash (once per session).
 *   2. First fold — header + full-bleed randomized hero carousel.
 *   3. Chapter menu — one full-width row per series (Upland Folk in soot).
 *   4. Footer.
 */
export default function HomePage() {
  return (
    <>
      <IntroSplash />
      <div className="viewport-fold">
        <SiteHeader />
        <main id="main-content" className="fold-main">
          <h1 className="sr-only">Peadar Jolliffe-Byrne — selected works 2019–2022</h1>
          <HomeCarousel />
        </main>
      </div>

      <section className="chapters" aria-label="Series chapters">
        {artworksByYearDescending.map((collection) => (
          <Link
            key={collection.year}
            href={`/gallery?y=${collection.year}`}
            className={clsx("chapter-row", {
              "is-soot": collection.year === UPLAND_FOLK_YEAR,
            })}
          >
            <span className="chapter-name">{collection.name}</span>
            <span className="chapter-desc">{collection.description}</span>
            <span className="chapter-count">
              {collection.year} · {collection.works.length} works
            </span>
            <span className="chapter-enter">Enter →</span>
          </Link>
        ))}
      </section>

      <SiteFooter variant="home" />
    </>
  );
}
