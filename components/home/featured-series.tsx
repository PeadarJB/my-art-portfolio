import Image from "next/image";
import Link from "next/link";

import { resolvedFeaturedSeries } from "@/content/homepage";
import { HomeArtworkFigure } from "@/components/home/artwork-figure";

/**
 * The homepage's first true atmospheric exhibition environment: a full-width
 * soot band whose content aligns to the capped canvas. It is a PREVIEW of
 * Upland Folk, not the standalone series page — a principal transparent work
 * plus two calm supporting works, the existing title graphic, and existing
 * series-context copy.
 *
 * The environment is LOCAL: `.home-featured` redefines the semantic colour
 * tokens to soot/bone (see globals.css), exactly like the lightbox. It never
 * reads or writes the global theme store, and it is always soot in both light
 * and dark themes. Because the band is always dark, only the white Upland Folk
 * title graphic is rendered (the theme-swap variant would show black-on-soot in
 * the light theme).
 */
export function FeaturedSeries() {
  const { principal, supporting } = resolvedFeaturedSeries;

  return (
    <section className="home-featured home-bleed" aria-labelledby="home-featured-heading">
      <div className="home-bleed-inner home-featured-inner">
        <div className="home-featured-intro">
          <h2 id="home-featured-heading" className="sr-only">
            Upland Folk
          </h2>
          <Image
            src="/images/2022/UplandFolk-white-large.svg"
            alt="Upland Folk title graphic"
            width={1001}
            height={379}
            className="home-featured-logo"
          />
          <p className="home-featured-context">
            Upland Folk is a series of eight paintings by Irish artist Peadar Jolliffe-Byrne.
            The exhibition was made in response to research carried out in 2021 during work on
            the UNESCO World Heritage Tentative List application for the cultural landscape of
            the Burren, Co. Clare, Ireland.
          </p>
          <Link className="inline-link" href="/gallery#year-2022">
            Explore the series
          </Link>
        </div>

        <div className="home-featured-plate">
          <HomeArtworkFigure
            work={principal}
            variant="large"
            sizes="(max-width: 860px) 78vw, 38vw"
            className="home-featured-principal"
          />
          <div className="home-featured-supporting">
            {supporting.map((work) => (
              <HomeArtworkFigure
                key={work.id}
                work={work}
                variant="medium"
                sizes="(max-width: 860px) 40vw, 18vw"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
