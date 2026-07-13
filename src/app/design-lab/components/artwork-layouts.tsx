import Image from "next/image";

import type { Artwork } from "@/lib/content-schema";
import { picks, prototypeCopy, realCopy, uplandFolkTitleGraphic } from "../lab-content";

function Plate({
  work,
  sizes,
  className,
  priority = false,
}: {
  work: Artwork;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={`lab-plate ${className ?? ""}`}>
      <Image
        src={work.image.large}
        alt={work.image.alt}
        width={work.image.width}
        height={work.image.height}
        sizes={sizes}
        quality={82}
        priority={priority}
      />
      <figcaption>
        <span className="lab-caption-title">{work.title}</span>
        <span className="lab-caption-meta">
          {work.medium} · {work.dimensions} · {work.year}
        </span>
      </figcaption>
    </figure>
  );
}

const layoutTokens = [
  ["--lab-gutter", "clamp(1.25rem, 4vw, 6rem)", "Fluid outer gutter"],
  ["--lab-canvas-max", "106rem", "Wide artwork canvas"],
  ["--lab-reading-max", "64ch", "Narrow editorial measure"],
  ["--lab-section-gap", "clamp(3.5rem, 8vw, 9rem)", "Section spacing"],
  ["--lab-art-gap", "clamp(1rem, 3vw, 3rem)", "Artwork gaps"],
  ["--lab-radius-image", "0", "Images are unframed by radius"],
  ["--lab-radius-control", "0.2rem", "Controls only"],
  ["--lab-line-width", "1px", "Hairline borders"],
  ["--lab-shadow-content", "none", "No content-card shadows"],
  ["--lab-shadow-overlay", "0 1rem 3rem rgb(0 0 0 / 0.16)", "Overlay elevation only"],
];

export function ArtworkLayouts() {
  return (
    <section className="lab-section" id="layouts" aria-labelledby="layouts-h">
      <p className="lab-eyebrow">04 / 05 — Spacing &amp; artwork composition</p>
      <h2 className="lab-section-title" id="layouts-h">
        Editorial spacing and three artwork recipes
      </h2>

      {/* Layout tokens */}
      <div className="lab-specimen">
        <p className="lab-specimen-label">Locally-scoped layout tokens</p>
        <div className="lab-ruler" style={{ marginBottom: "1.5rem" }}>
          <div className="lab-ruler-bar" style={{ width: "min(64ch, 100%)" }} />
          <p className="lab-meta">Reading measure — 64ch (target 60–66 characters)</p>
        </div>
        <dl className="lab-decision-inline">
          {layoutTokens.map(([name, value, desc]) => (
            <div className="lab-scale-row" key={name}>
              <code className="lab-meta">{name}</code>
              <span className="lab-ui-text">
                <strong>{value}</strong> — {desc}
              </span>
            </div>
          ))}
        </dl>
        <p className="lab-note" style={{ marginTop: "1rem" }}>
          No card system: images sit directly on the ground with hairline rules and
          captions outside the image. Elevation is reserved for overlays (lightbox,
          menu), never for content.
        </p>
      </div>

      {/* Recipe A */}
      <div className="lab-specimen lab-recipe">
        <p className="lab-specimen-label">
          Recipe A — Anchor &amp; satellites <span className="lab-flag">container query</span>
        </p>
        <div className="lab-anchor-grid">
          <Plate
            work={picks.landscape.work}
            className="lab-anchor lab-hover-zoom"
            sizes="(max-width: 700px) 92vw, 60vw"
          />
          <Plate work={picks.pale.work} sizes="(max-width: 700px) 92vw, 28vw" />
          <div className="lab-void" aria-hidden="true" />
          <Plate work={picks.square.work} sizes="(max-width: 700px) 92vw, 28vw" />
        </div>
        <p className="lab-note" style={{ marginTop: "1rem" }}>
          One large anchor (~two-thirds), two satellites, one deliberate empty region.
          Captions sit outside the image; no card backgrounds. The grid reshapes on the
          block&apos;s own width via a container query, with a media-query fallback.
        </p>
      </div>

      {/* Recipe B */}
      <div className="lab-specimen lab-recipe">
        <p className="lab-specimen-label">Recipe B — Vertical conversation</p>
        <div className="lab-conversation">
          <Plate
            work={picks.portrait.work}
            className="lab-conv-large"
            sizes="(max-width: 700px) 92vw, 46vw"
          />
          <Plate
            work={picks.dark.work}
            className="lab-conv-small"
            sizes="(max-width: 700px) 92vw, 30vw"
          />
          <Plate
            work={picks.landscape.work}
            className="lab-conv-wide"
            sizes="(max-width: 700px) 92vw, 50vw"
          />
        </div>
        <p className="lab-note" style={{ marginTop: "1rem" }}>
          Two portraits at different scales share a baseline; a landscape enters beneath.
          On mobile the order is a clear single column (large → small → wide).
        </p>
      </div>

      {/* Recipe C — exhibition plate, atmospheric */}
      <div className="lab-specimen lab-recipe lab-room" data-lab-env="atmospheric">
        <p className="lab-specimen-label">
          Recipe C — Exhibition plate (atmospheric / Upland Folk)
        </p>
        <div style={{ marginBottom: "1.5rem" }}>
          {/* Real Upland Folk title graphic stands in for a series/room title. */}
          <Image
            src={uplandFolkTitleGraphic.dark}
            alt={uplandFolkTitleGraphic.alt}
            width={1001}
            height={379}
            style={{ width: "min(28rem, 80%)", height: "auto" }}
          />
        </div>
        <div className="lab-exhibition">
          <Plate
            work={picks.saturated.work}
            className="lab-exhibition-lead"
            sizes="(max-width: 760px) 92vw, 52vw"
          />
          <div className="lab-exhibition-text">
            <p className="lab-body">{prototypeCopy.seriesStanding}</p>
            <p className="lab-meta" style={{ marginTop: "1rem" }}>
              {realCopy.cvEntryAlt}
            </p>
          </div>
          <Plate work={picks.square.work} sizes="(max-width: 760px) 92vw, 40vw" />
        </div>
        <p className="lab-note" style={{ marginTop: "1rem" }}>
          A principal artwork, a narrow contextual column (prototype copy, clearly
          labelled — no invented facts), and a supporting work, on a soot ground with a
          soft vignette so it reads as an exhibition room.{" "}
          <strong>No installation photograph exists in the repository</strong>, so the
          real Upland Folk title graphic supplies the room&apos;s identity instead.
        </p>
      </div>

      {/* Art-directed crop demonstration */}
      <div className="lab-specimen">
        <p className="lab-specimen-label">Art-directed crop (the only place cropping is allowed)</p>
        <div className="lab-grid-2">
          <div className="lab-crop">
            <span className="lab-crop-tag">CROP · 3:2 · art-directed</span>
            <Image
              src={picks.landscape.work.image.large}
              alt={`${picks.landscape.work.title} (detail crop)`}
              width={picks.landscape.work.image.width}
              height={picks.landscape.work.image.height}
              sizes="(max-width: 700px) 92vw, 40vw"
            />
          </div>
          <Plate
            work={picks.landscape.work}
            sizes="(max-width: 700px) 92vw, 40vw"
          />
        </div>
        <p className="lab-note" style={{ marginTop: "1rem" }}>
          Left is an intentional, labelled crop. Right preserves the full aspect ratio —
          the default everywhere else.
        </p>
      </div>
    </section>
  );
}
