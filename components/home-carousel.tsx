"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import { artworksByYearDescending, totalWorkCount } from "@/content/artworks";
import { buildPlaylist, type PlaylistEntry } from "@/lib/playlist";

const UPLAND_FOLK_YEAR = 2022;
const AUTOPLAY_MS = 6000;

/**
 * Full-bleed randomized hero carousel. The playlist is built on the client
 * (shuffled per visit, series interleaved so consecutive slides come from
 * different series). Autoplay advances every 6s — disabled under reduced
 * motion — clicking the stage advances, and arrow keys navigate. When the
 * current work is Upland Folk the stage crossfades into the soot room.
 */
export function HomeCarousel() {
  const [playlist, setPlaylist] = useState<PlaylistEntry[] | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setPlaylist(buildPlaylist(artworksByYearDescending));
  }, []);

  const length = playlist?.length ?? 0;

  const step = useCallback(
    (delta: number) => {
      if (!length) {
        return;
      }
      setIndex((current) => (current + delta + length) % length);
    },
    [length]
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = setInterval(() => step(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [step]);

  const entry = playlist?.[index] ?? null;
  const dark = entry?.year === UPLAND_FOLK_YEAR;
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <div className={clsx("room home-viewer", { "is-soot": dark })}>
      <div className="subbar has-rule-below">
        <span>Selected Works</span>
        <span className="subbar-muted">2019–2022</span>
        <Link className="subbar-link" href="/gallery">
          See All
        </Link>
      </div>

      <button
        type="button"
        className="hero-stage"
        aria-label="Next work"
        onClick={() => step(1)}
      >
        {entry ? (
          <div className="hero-plate" key={entry.work.id}>
            <Image
              src={entry.work.image.large}
              alt={entry.work.image.alt}
              fill
              sizes="100vw"
              quality={90}
              priority={index === 0}
            />
          </div>
        ) : null}
      </button>

      <div className="caption-bar">
        <span className="caption-counter">
          {entry ? `${pad(index + 1)} / ${pad(totalWorkCount)}` : ""}
        </span>
        <span className="caption-line" aria-live="polite">
          {entry ? (
            <>
              <i className="caption-title">{entry.work.title}</i>, {entry.year} —{" "}
              <span className="caption-series">{entry.seriesName}</span>
            </>
          ) : null}
        </span>
        {entry ? (
          <Link
            className="caption-action is-accent"
            href={`/gallery/${entry.year}/${entry.work.id}`}
          >
            Expand
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
