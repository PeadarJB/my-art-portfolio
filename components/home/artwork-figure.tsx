import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import type { Artwork } from "@/lib/content-schema";

type HomeArtworkFigureProps = {
  work: Artwork;
  /** `sizes` attribute for responsive delivery — required per surface. */
  sizes: string;
  /** Which pre-generated variant to point `next/image` at. */
  variant?: "medium" | "large";
  /** Only the above-the-fold hero should pass `priority`. */
  priority?: boolean;
  /** Show the quiet title/medium/dimensions caption below the artwork. */
  showCaption?: boolean;
  className?: string;
};

/**
 * Lightweight, card-free artwork presentation for the homepage. The whole block
 * is a single link to the work's detail page (no separate "View detail"
 * button); the artwork is the primary element and the caption is visually
 * quieter. Alt text always comes from the data. Colours resolve from the
 * semantic tokens, so the same component adapts to the paper page and to the
 * local soot environment of the featured series.
 */
export function HomeArtworkFigure({
  work,
  sizes,
  variant = "medium",
  priority = false,
  showCaption = true,
  className,
}: HomeArtworkFigureProps) {
  const detailHref = `/gallery/${work.year}/${work.id}`;

  return (
    <Link
      href={detailHref}
      className={clsx("home-figure", className)}
      aria-label={`${work.title} (${work.year}) — view artwork`}
    >
      <span className="home-figure-frame">
        <Image
          src={work.image[variant]}
          alt={work.image.alt}
          className="home-figure-image"
          width={work.image.width}
          height={work.image.height}
          sizes={sizes}
          quality={priority ? 90 : 82}
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />
      </span>
      {showCaption ? (
        <span className="home-figure-caption">
          <span className="home-figure-title">{work.title}</span>
          <span className="home-figure-meta">{work.medium}</span>
          <span className="home-figure-meta">
            {work.dimensions} · {work.year}
          </span>
        </span>
      ) : null}
    </Link>
  );
}
