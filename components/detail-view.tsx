"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { buildEnquiryHref } from "@/lib/enquiry";
import { siteName } from "@/lib/site";
import type { Artwork } from "@/lib/content-schema";

const UPLAND_FOLK_YEAR = 2022;

type DetailViewProps = {
  work: Artwork;
  previous: Artwork | null;
  next: Artwork | null;
  index: number;
  total: number;
};

/**
 * V2 artwork detail: a 100dvh expanded plate. Prev/next click zones (25%
 * widths) and arrow keys move through the same year's works, wrapping at the
 * ends; Upland Folk works render in the soot room.
 */
export function DetailView({ work, previous, next, index, total }: DetailViewProps) {
  const router = useRouter();
  const dark = work.year === UPLAND_FOLK_YEAR;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && next) {
        router.push(`/gallery/${next.year}/${next.id}`);
      }
      if (event.key === "ArrowLeft" && previous) {
        router.push(`/gallery/${previous.year}/${previous.id}`);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [router, previous, next]);

  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <div className={clsx("room viewer-page", { "is-soot": dark })}>
      <header className="site-header">
        <Link className="header-back" href={`/gallery?y=${work.year}`}>
          ← {dark ? `${work.year} — Upland Folk` : `${work.year} collection`}
        </Link>
        <Link href="/" className="brand" aria-label={`${siteName}, home`}>
          {siteName}
        </Link>
        <Link className="header-close" href="/gallery" aria-label="Close and return to gallery">
          ×
        </Link>
      </header>

      <main id="main-content" className="viewer-main">
        <h1 className="sr-only">
          {work.title}, {work.year}
        </h1>

        <div className="stage is-detail">
          <div className="stage-plate has-soot-shadow" key={work.id}>
            <Image
              src={work.image.large}
              alt={work.image.alt}
              fill
              sizes="100vw"
              quality={96}
              priority
            />
          </div>
          {previous ? (
            <Link
              className="stage-zone is-prev"
              aria-label="Previous work"
              href={`/gallery/${previous.year}/${previous.id}`}
            >
              ‹
            </Link>
          ) : null}
          {next ? (
            <Link
              className="stage-zone is-next"
              aria-label="Next work"
              href={`/gallery/${next.year}/${next.id}`}
            >
              ›
            </Link>
          ) : null}
        </div>

        <div className="caption-bar is-detail">
          <span className="caption-counter">
            {pad(index + 1)} / {pad(total)}
          </span>
          <span className="caption-line">
            <i className="caption-title">{work.title}</i>, {work.year} — {work.medium},{" "}
            {work.dimensions}
          </span>
          <a className="caption-action is-accent" href={buildEnquiryHref(work.title)}>
            Enquire
          </a>
        </div>
      </main>
    </div>
  );
}
