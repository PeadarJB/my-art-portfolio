"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import { SiteHeader } from "@/components/site-header";
import { artworksByYearDescending } from "@/content/artworks";
import { buildEnquiryHref } from "@/lib/enquiry";

const UPLAND_FOLK_YEAR = 2022;

type GalleryViewProps = {
  initialYear?: number;
};

/**
 * V2 gallery: a full-viewport per-series slideshow with a scrollable sheet
 * ("See All") view. The Upland Folk chapter opens on a series-context intro
 * slide and turns the whole page into the soot room (600ms crossfade).
 * ArrowLeft/ArrowRight navigate; invisible prev/next click zones cover the
 * outer thirds of the stage.
 */
export function GalleryView({ initialYear }: GalleryViewProps) {
  const collections = artworksByYearDescending;
  const initialChapter = Math.max(
    0,
    collections.findIndex((collection) => collection.year === initialYear)
  );

  const [chapterIndex, setChapterIndex] = useState(initialChapter);
  const [slideIndex, setSlideIndex] = useState(0);
  const [mode, setMode] = useState<"slide" | "sheet">("slide");

  const chapter = collections[chapterIndex];
  const dark = chapter.year === UPLAND_FOLK_YEAR;
  // The Upland Folk chapter has an extra intro slide in front of its works.
  const slideCount = chapter.works.length + (dark ? 1 : 0);
  const isIntro = dark && slideIndex === 0;
  const workIndex = dark ? slideIndex - 1 : slideIndex;
  const work = isIntro ? null : chapter.works[workIndex];

  const step = useCallback(
    (delta: number) => {
      setSlideIndex((current) => (current + delta + slideCount) % slideCount);
    },
    [slideCount]
  );

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        step(1);
      }
      if (event.key === "ArrowLeft") {
        step(-1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [step]);

  const pickChapter = (index: number) => {
    setChapterIndex(index);
    setSlideIndex(0);
    // Keep the deep link current without a router round-trip.
    window.history.replaceState(null, "", `/gallery?y=${collections[index].year}`);
  };

  const openWork = (index: number) => {
    setSlideIndex(dark ? index + 1 : index);
    setMode("slide");
  };

  const pad = (value: number) => String(value).padStart(2, "0");
  const expandTarget = work ?? chapter.works[0];

  return (
    <div className={clsx("room viewer-page", { "is-soot": dark })}>
      <SiteHeader />

      <div className="subbar has-rule-below">
        <div className="chapter-tabs">
          {collections.map((candidate, index) => (
            <button
              key={candidate.year}
              type="button"
              className={clsx("chapter-tab", { "is-active": index === chapterIndex })}
              aria-pressed={index === chapterIndex}
              onClick={() => pickChapter(index)}
            >
              {candidate.name}
            </button>
          ))}
        </div>
        <span className="subbar-muted">
          {chapter.year} · {chapter.works.length} works
        </span>
        <button
          type="button"
          className="mode-toggle"
          onClick={() => setMode(mode === "slide" ? "sheet" : "slide")}
        >
          {mode === "slide" ? "See All" : "Slideshow"}
        </button>
      </div>

      <main id="main-content" className="viewer-main">
        <h1 className="sr-only">Gallery — {chapter.name}</h1>

        {mode === "slide" ? (
          <>
            <div className="stage is-gallery">
              {isIntro ? (
                <div
                  className="series-intro"
                  key="series-intro"
                  role="region"
                  aria-label="Upland Folk series context"
                  tabIndex={0}
                >
                  <Image
                    src="/images/2022/UplandFolk-white.png"
                    alt="Upland Folk title graphic"
                    width={700}
                    height={300}
                    className="series-intro-logo"
                    priority
                  />
                  <div className="series-intro-copy">
                    <span className="series-intro-label">Series Context</span>
                    <p>
                      Upland Folk is a series of eight paintings by Irish artist Peadar
                      Jolliffe-Byrne. The exhibition was made in response to research carried
                      out in 2021 during work on the UNESCO World Heritage Tentative List
                      application for the cultural landscape of the Burren, Co. Clare,
                      Ireland.
                    </p>
                    <p>
                      The Burren offers globally significant ecology, archaeology, and
                      landscape narratives, but one of its strongest qualities is the people
                      who live there. This series reflects that relationship between place,
                      memory, and contemporary identity.
                    </p>
                  </div>
                </div>
              ) : work ? (
                <div className="stage-plate has-soot-shadow" key={work.id}>
                  <Image
                    src={work.image.large}
                    alt={work.image.alt}
                    fill
                    sizes="100vw"
                    quality={90}
                    priority
                  />
                </div>
              ) : null}
              <button
                type="button"
                className="stage-zone is-prev"
                aria-label="Previous work"
                onClick={() => step(-1)}
              >
                ‹
              </button>
              <button
                type="button"
                className="stage-zone is-next"
                aria-label="Next work"
                onClick={() => step(1)}
              >
                ›
              </button>
            </div>

            <div className="caption-bar">
              <span className="caption-counter">
                {isIntro ? "Series" : `${pad(workIndex + 1)} / ${chapter.works.length}`}
              </span>
              <span className="caption-line">
                <i className="caption-title">{work ? work.title : chapter.name}</i>,{" "}
                {chapter.year} —{" "}
                {work
                  ? `${work.medium}, ${work.dimensions}`
                  : "series of eight paintings, the Burren, Co. Clare"}
              </span>
              <span className="caption-actions">
                <a
                  className="caption-action is-muted"
                  href={buildEnquiryHref(work ? work.title : "Upland Folk series")}
                >
                  Enquire
                </a>
                <Link
                  className="caption-action is-accent"
                  href={`/gallery/${chapter.year}/${expandTarget.id}`}
                >
                  Expand
                </Link>
              </span>
            </div>
          </>
        ) : (
          <div className="sheet">
            {chapter.works.map((sheetWork, index) => (
              <button
                key={sheetWork.id}
                type="button"
                className="sheet-cell"
                onClick={() => openWork(index)}
              >
                <Image
                  src={sheetWork.image.medium}
                  alt={sheetWork.image.alt}
                  width={sheetWork.image.width}
                  height={sheetWork.image.height}
                  sizes="(max-width: 640px) 45vw, (max-width: 1200px) 22vw, 300px"
                />
                <span className="sheet-caption">
                  <i>{sheetWork.title}</i> · {sheetWork.dimensions}
                </span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
