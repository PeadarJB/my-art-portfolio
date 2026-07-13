"use client";

import { useState } from "react";
import Image from "next/image";

import { picks } from "../lab-content";

export function MotionSpecimen() {
  // Bumping this key remounts the animated subtree so CSS entrance animations
  // replay on demand (no animation library, no JS-driven tween).
  const [replay, setReplay] = useState(0);
  const [env, setEnv] = useState<"editorial" | "atmospheric">("editorial");

  return (
    <section className="lab-section" id="motion" aria-labelledby="motion-h">
      <p className="lab-eyebrow">08 — Motion</p>
      <h2 className="lab-section-title" id="motion-h">
        Controlled, tactile, CSS-only
      </h2>
      <p className="lab-note" style={{ marginBlock: "1rem 1.5rem" }}>
        Opacity and transform only; entrance distance ≤ 24px; no perpetual motion, no
        scroll hijacking, no pre-navigation delay, ≤ 6 staggered items. Turn on{" "}
        <em>Reduce motion</em> in your OS to see spatial movement collapse to a short
        fade.
      </p>

      <div className="lab-row" style={{ marginBottom: "1.5rem" }}>
        <button
          type="button"
          className="lab-btn"
          onClick={() => setReplay((r) => r + 1)}
        >
          Replay entrances
        </button>
        <div className="lab-switch" role="group" aria-label="Environment">
          <button
            type="button"
            aria-pressed={env === "editorial"}
            onClick={() => setEnv("editorial")}
          >
            Editorial
          </button>
          <button
            type="button"
            aria-pressed={env === "atmospheric"}
            onClick={() => setEnv("atmospheric")}
          >
            Atmospheric
          </button>
        </div>
      </div>

      <div key={replay} className="lab-anim-grid">
        {/* Image mask / clip-path reveal */}
        <div className="lab-specimen">
          <p className="lab-specimen-label">Image mask reveal (clip-path)</p>
          <figure className="lab-plate" data-anim="mask">
            <Image
              src={picks.square.work.image.medium}
              alt={picks.square.work.image.alt}
              width={picks.square.work.image.width}
              height={picks.square.work.image.height}
              sizes="(max-width: 700px) 90vw, 260px"
            />
          </figure>
        </div>

        {/* Text fade + short upward entrance */}
        <div className="lab-specimen">
          <p className="lab-specimen-label">Text fade &amp; rise (≤ 24px)</p>
          <div data-stagger>
            <p className="lab-eyebrow">Series</p>
            <p className="lab-artwork-title">Upland Folk</p>
            <p className="lab-body">Eight paintings, one room.</p>
          </div>
        </div>

        {/* Hover enlargement 1–2% */}
        <div className="lab-specimen">
          <p className="lab-specimen-label">Hover enlarge 1.5% (transform)</p>
          <figure className="lab-plate lab-hover-zoom" tabIndex={0}>
            <Image
              src={picks.pale.work.image.medium}
              alt={picks.pale.work.image.alt}
              width={picks.pale.work.image.width}
              height={picks.pale.work.image.height}
              sizes="(max-width: 700px) 90vw, 260px"
            />
          </figure>
        </div>

        {/* Animated underline */}
        <div className="lab-specimen">
          <p className="lab-specimen-label">Animated underline</p>
          <p>
            <a className="lab-underline" href="#motion" style={{ fontSize: "1.25rem" }}>
              Hover or focus me
            </a>
          </p>
        </div>

        {/* Overlay entrance */}
        <div className="lab-specimen">
          <p className="lab-specimen-label">Overlay entrance (fade + 2% scale)</p>
          <div className="lab-lightbox" data-anim="overlay" style={{ minHeight: "10rem" }}>
            <div className="lab-lightbox-bar">
              <span className="lab-meta" style={{ color: "inherit" }}>
                Overlay
              </span>
            </div>
            <div className="lab-lightbox-body">
              <p className="lab-ui-text" style={{ textAlign: "center", opacity: 0.7 }}>
                enters on open
              </p>
            </div>
          </div>
        </div>

        {/* Environment cross-fade */}
        <div className="lab-specimen">
          <p className="lab-specimen-label">Editorial → atmospheric cross-fade</p>
          <div
            className="lab-env-demo"
            data-lab-env={env}
            style={{
              padding: "1.5rem",
              borderRadius: "var(--lab-radius-overlay)",
              minHeight: "8rem",
              display: "grid",
              placeItems: "center",
            }}
          >
            <p className="lab-artwork-title">Entering the exhibition</p>
          </div>
        </div>
      </div>

      <p className="lab-note" style={{ marginTop: "1.5rem" }}>
        <strong>Shared-element transition:</strong> native CSS View Transitions are the
        recommended path (a <code>view-transition-name</code> is applied on this route
        under <code>prefers-reduced-motion: no-preference</code> only, and removed when
        reduce is set). It is a progressive enhancement — unsupported browsers simply
        navigate instantly, matching today&apos;s behaviour. No route-wide production
        transition is enabled in this phase.
      </p>
    </section>
  );
}
