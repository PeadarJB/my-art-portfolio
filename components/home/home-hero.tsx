import Link from "next/link";

import { resolvedHeroWork } from "@/content/homepage";
import { HomeArtworkFigure } from "@/components/home/artwork-figure";

/**
 * Opening hero: an editorial type column beside one principal artwork, with
 * significant negative space and no container card. The artwork appears in the
 * first viewport. Text is limited to the artist name, a factual date range, a
 * verbatim excerpt from the approved About statement, and a single route into
 * the work. Entrance motion is CSS-only (see globals.css `.home-hero`).
 */
export function HomeHero() {
  const work = resolvedHeroWork;

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero-text">
        <p className="eyebrow">Selected works · 2019–2022</p>
        <h1 id="home-hero-title" className="home-hero-name">
          Peadar Jolliffe-Byrne
        </h1>
        <p className="home-hero-lede">
          Painting and drawing works grounded in narrative, memory, and symbolic form.
        </p>
        <div className="home-hero-actions">
          <Link className="btn btn-primary" href="/gallery">
            Enter the gallery
          </Link>
        </div>
      </div>

      <div className="home-hero-art">
        <HomeArtworkFigure
          work={work}
          variant="large"
          priority
          sizes="(max-width: 720px) 88vw, (max-width: 1100px) 48vw, 40vw"
        />
      </div>
    </section>
  );
}
