import Image from "next/image";

import type { Artwork } from "@/lib/content-schema";
import { gradeContrast } from "../contrast";
import { paletteWorks } from "../lab-content";

const swatches = [
  { name: "paper", hex: "#f2eee6", group: "Editorial light" },
  { name: "paper-raised", hex: "#f8f5ef", group: "Editorial light" },
  { name: "ink", hex: "#191714", group: "Editorial light" },
  { name: "graphite", hex: "#595550", group: "Editorial light" },
  { name: "muted", hex: "#6f6a64", group: "Editorial light" },
  { name: "line", hex: "#cfc7bb", group: "Editorial light" },
  { name: "soot", hex: "#171412", group: "Atmospheric dark" },
  { name: "bone", hex: "#eee8de", group: "Atmospheric dark" },
  { name: "dark-muted", hex: "#bdb4a8", group: "Atmospheric dark" },
  { name: "cadmium", hex: "#b74034", group: "Accent" },
  { name: "ultramarine", hex: "#31578a", group: "Accent" },
  { name: "mineral", hex: "#4e6551", group: "Accent" },
  { name: "ochre", hex: "#b98328", group: "Accent" },
];

// Foreground/background pairs to grade. Ratios are CALCULATED at render time by
// the local WCAG utility — never asserted by hand.
const combos: { label: string; fg: string; bg: string; note?: string }[] = [
  { label: "ink on paper", fg: "#191714", bg: "#f2eee6" },
  { label: "graphite on paper", fg: "#595550", bg: "#f2eee6" },
  { label: "muted on paper", fg: "#6f6a64", bg: "#f2eee6" },
  { label: "ink on pure white", fg: "#191714", bg: "#ffffff" },
  { label: "bone on soot", fg: "#eee8de", bg: "#171412" },
  { label: "dark-muted on soot", fg: "#bdb4a8", bg: "#171412" },
  { label: "cadmium on paper", fg: "#b74034", bg: "#f2eee6" },
  { label: "ultramarine on paper", fg: "#31578a", bg: "#f2eee6" },
  { label: "mineral on paper", fg: "#4e6551", bg: "#f2eee6" },
  {
    label: "ochre on paper",
    fg: "#b98328",
    bg: "#f2eee6",
    note: "normal-size text use is gated on this result",
  },
  { label: "white on cadmium (filled action)", fg: "#ffffff", bg: "#b74034" },
  { label: "cadmium on soot (series accent)", fg: "#b74034", bg: "#171412" },
  { label: "ochre on soot (series accent)", fg: "#b98328", bg: "#171412" },
];

function GroundPlates({ works }: { works: Artwork[] }) {
  return (
    <div className="lab-grid-3" style={{ marginTop: "1rem" }}>
      {works.map((work) => (
        <figure className="lab-plate" key={work.id}>
          <Image
            src={work.image.small}
            alt={work.image.alt}
            width={work.image.width}
            height={work.image.height}
            sizes="(max-width: 768px) 45vw, 220px"
            quality={80}
          />
          <figcaption>
            <span className="lab-caption-title">{work.title}</span>
            <span className="lab-caption-meta">
              {work.medium} · {work.dimensions}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function PaletteSpecimen() {
  return (
    <section className="lab-section" id="palette" aria-labelledby="palette-h">
      <p className="lab-eyebrow">03 — Palette</p>
      <h2 className="lab-section-title" id="palette-h">
        Neutral grounds, restrained accents
      </h2>
      <p className="lab-note" style={{ marginBlock: "1rem 2rem" }}>
        The interface stays neutral so the artwork supplies the colour. Accents appear
        one at a time, never together. Every text/background pair below is labelled with
        its <strong>calculated</strong> WCAG ratio.
      </p>

      {/* Swatches */}
      <div className="lab-specimen">
        <p className="lab-specimen-label">Prototype tokens</p>
        <div className="lab-swatches">
          {swatches.map((s) => (
            <div className="lab-swatch" key={s.name}>
              <div className="lab-swatch-chip" style={{ background: s.hex }} />
              <div className="lab-swatch-meta">
                <div className="lab-swatch-name">--lab-{s.name}</div>
                <div className="lab-swatch-hex">
                  {s.hex} · {s.group}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contrast table */}
      <div className="lab-specimen">
        <p className="lab-specimen-label">Calculated contrast (WCAG 2.x)</p>
        <ul className="lab-contrast-list">
          {combos.map((c) => {
            const grade = gradeContrast(c.fg, c.bg);
            return (
              <li className="lab-contrast-item" key={c.label}>
                <span
                  className="lab-contrast-sample"
                  style={{ color: c.fg, background: c.bg }}
                >
                  {c.label}
                </span>
                <span className="lab-badge" data-grade={grade.label}>
                  {grade.ratio.toFixed(2)}:1 · {grade.label}
                </span>
                {c.note ? <span className="lab-meta">({c.note})</span> : null}
              </li>
            );
          })}
        </ul>
        <p className="lab-note" style={{ marginTop: "1rem" }}>
          Ochre fails normal-size AA on paper, so it is reserved for large display marks
          or graphic fills only — never body or metadata text. Cadmium is the safe
          general accent; on soot it stays vivid without shouting.
        </p>
      </div>

      {/* Grounds */}
      <div className="lab-specimen" data-lab-env="editorial">
        <p className="lab-specimen-label">Warm paper (editorial default)</p>
        <GroundPlates works={paletteWorks} />
      </div>

      <div className="lab-specimen" data-lab-env="white">
        <p className="lab-specimen-label">Pure white gallery (comparison)</p>
        <GroundPlates works={paletteWorks} />
      </div>

      <div className="lab-specimen lab-room" data-lab-env="atmospheric">
        <p className="lab-specimen-label">Soot (atmospheric series room)</p>
        <GroundPlates works={paletteWorks.slice(0, 3)} />
      </div>

      <div className="lab-grid-2">
        <div className="lab-specimen" data-lab-env="editorial">
          <p className="lab-specimen-label">Paper — subtle texture ON</p>
          <div className="lab-ground" data-texture="on" data-lab-env="editorial">
            <GroundPlates works={paletteWorks.slice(0, 2)} />
          </div>
        </div>
        <div className="lab-specimen" data-lab-env="editorial">
          <p className="lab-specimen-label">Paper — texture OFF (default)</p>
          <div className="lab-ground" data-texture="off" data-lab-env="editorial">
            <GroundPlates works={paletteWorks.slice(0, 2)} />
          </div>
        </div>
      </div>
      <p className="lab-note">
        Texture is off by default. When enabled it is a near-invisible tonal grain
        (opacity ≈ 0.01–0.014) intended only to stop large paper fields feeling flat on
        high-density screens.
      </p>
    </section>
  );
}
