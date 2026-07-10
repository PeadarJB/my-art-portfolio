"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { EnquiryButton } from "@/components/enquiry-button";
import { useLightboxStore } from "@/lib/store/lightbox-store";

export function ArtworkLightbox() {
  const activeIndex = useLightboxStore((state) => state.activeIndex);
  const close = useLightboxStore((state) => state.close);
  const isOpen = useLightboxStore((state) => state.isOpen);
  const items = useLightboxStore((state) => state.items);
  const next = useLightboxStore((state) => state.next);
  const previous = useLightboxStore((state) => state.previous);

  const current = items[activeIndex];

  const adjacentSources = useMemo(() => {
    if (!current || items.length < 2) {
      return [];
    }

    const prevIndex = (activeIndex - 1 + items.length) % items.length;
    const nextIndex = (activeIndex + 1) % items.length;

    return [items[prevIndex]?.image.large, items[nextIndex]?.image.large].filter(
      (source): source is string => Boolean(source)
    );
  }, [activeIndex, current, items]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key === "ArrowRight") {
        next();
        return;
      }
      if (event.key === "ArrowLeft") {
        previous();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [close, isOpen, next, previous]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = priorOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    for (const source of adjacentSources) {
      const image = new window.Image();
      image.src = source;
    }
  }, [adjacentSources, isOpen]);

  if (!isOpen || !current) {
    return null;
  }

  return (
    <div
      className="lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`${current.title} full-screen artwork viewer`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          close();
        }
      }}
    >
      <div className="lightbox-shell">
        <div className="lightbox-topbar">
          <p className="lightbox-counter">
            {activeIndex + 1} / {items.length}
          </p>
          <button
            type="button"
            className="lightbox-close"
            onClick={close}
            aria-label="Close lightbox"
          >
            Close
          </button>
        </div>

        <div className="lightbox-frame">
          <button
            type="button"
            className="lightbox-nav lightbox-nav-prev"
            onClick={previous}
            aria-label="Previous artwork"
          >
            Prev
          </button>

          <div className="lightbox-image-wrap">
            <Image
              src={current.image.large}
              alt={current.image.alt}
              width={current.image.width}
              height={current.image.height}
              className="lightbox-image"
              quality={97}
              priority
              sizes="(max-width: 900px) 96vw, 90vw"
            />
          </div>

          <button
            type="button"
            className="lightbox-nav lightbox-nav-next"
            onClick={next}
            aria-label="Next artwork"
          >
            Next
          </button>
        </div>

        <div className="lightbox-meta">
          <div>
            <h3>{current.title}</h3>
            <p>{current.medium}</p>
            <p className="meta">
              {current.dimensions} · {current.year}
            </p>
          </div>
          <div className="lightbox-actions">
            <Link className="btn btn-secondary" href={`/gallery/${current.year}/${current.id}`} onClick={close}>
              View detail page
            </Link>
            <EnquiryButton title={current.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
