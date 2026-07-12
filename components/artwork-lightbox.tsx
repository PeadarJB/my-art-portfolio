"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { EnquiryButton } from "@/components/enquiry-button";
import { useLightboxStore } from "@/lib/store/lightbox-store";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function ArtworkLightbox() {
  const activeIndex = useLightboxStore((state) => state.activeIndex);
  const close = useLightboxStore((state) => state.close);
  const isOpen = useLightboxStore((state) => state.isOpen);
  const items = useLightboxStore((state) => state.items);
  const next = useLightboxStore((state) => state.next);
  const previous = useLightboxStore((state) => state.previous);

  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const current = items[activeIndex];

  // Keyboard: Escape closes, arrows navigate, Tab is trapped inside the dialog.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowRight") {
        next();
        return;
      }
      if (event.key === "ArrowLeft") {
        previous();
        return;
      }
      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) {
          return;
        }
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((element) => element.offsetParent !== null);
        if (focusable.length === 0) {
          event.preventDefault();
          dialog.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && (active === first || active === dialog)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [close, isOpen, next, previous]);

  // Lock body scroll and make the rest of the page inert while open.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const backgrounded = Array.from(
      document.querySelectorAll<HTMLElement>(".site-header, .site-shell")
    );
    for (const element of backgrounded) {
      element.setAttribute("inert", "");
    }

    return () => {
      document.body.style.overflow = priorOverflow;
      for (const element of backgrounded) {
        element.removeAttribute("inert");
      }
    };
  }, [isOpen]);

  // Move focus into the dialog on open; restore it to the trigger on close.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const frame = window.requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      restoreFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen || !current) {
    return null;
  }

  return (
    <div
      className="lightbox-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          close();
        }
      }}
    >
      <div
        className="lightbox-shell"
        role="dialog"
        aria-modal="true"
        aria-label={`${current.title} full-screen artwork viewer`}
        ref={dialogRef}
        tabIndex={-1}
      >
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
              quality={90}
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
            <Link
              className="btn btn-secondary"
              href={`/gallery/${current.year}/${current.id}`}
              onClick={close}
            >
              View detail page
            </Link>
            <EnquiryButton title={current.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
