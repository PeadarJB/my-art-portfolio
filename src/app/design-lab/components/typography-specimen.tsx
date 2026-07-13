import { realCopy } from "../lab-content";

type FontSystem = {
  id: string;
  name: string;
  summary: string;
  displayFont: string;
  uiFont: string;
  accentFont?: string;
  strengths: string[];
  weaknesses: string[];
};

// System A reuses the production font CSS variables (--font-serif = Spectral,
// --font-sans = Sora) already set on <body> by the root layout, so nothing new
// is loaded for it. Systems B/C use the lab fonts from the nested layout.
const systems: FontSystem[] = [
  {
    id: "A",
    name: "System A — Existing baseline",
    summary: "Spectral (display) + Sora (interface). The current production pairing.",
    displayFont: "var(--font-serif), Georgia, serif",
    uiFont: "var(--font-sans), system-ui, sans-serif",
    strengths: [
      "Zero migration cost — already shipping.",
      "Spectral is warm and literary; Sora is clean at small sizes.",
    ],
    weaknesses: [
      "Sora's geometric roundness reads a little 'app/tech', slightly against the monograph tone.",
      "Spectral display weight is lighter; less authoritative at very large hero sizes.",
    ],
  },
  {
    id: "B",
    name: "System B — Recommended",
    summary: "Newsreader (display) + Manrope (interface). Editorial gravity, quiet UI.",
    displayFont: "var(--lab-font-display)",
    uiFont: "var(--lab-font-ui)",
    strengths: [
      "Newsreader has real editorial authority and a genuine italic for artwork titles.",
      "Manrope is humanist and understated — metadata recedes, art leads.",
      "Strong glyph coverage for Irish/Spanish accents (Dún, Clare, México).",
    ],
    weaknesses: [
      "Newsreader optical sizing needs testing at the largest hero clamp.",
      "Two new families to self-host (still same-origin via next/font).",
    ],
  },
  {
    id: "C",
    name: "System C — Expressive series treatment",
    summary:
      "System B base + Instrument Serif used ONLY for a single large series/exhibition title.",
    displayFont: "var(--lab-font-display)",
    uiFont: "var(--lab-font-ui)",
    accentFont: "var(--lab-font-accent)",
    strengths: [
      "Instrument Serif gives 'Upland Folk' a distinct exhibition-poster voice.",
      "Reserving it for one title keeps the system disciplined.",
    ],
    weaknesses: [
      "Easy to overuse — must be a hard rule: series titles only.",
      "Only ships a 400 weight; not for body or small sizes.",
    ],
  },
];

function SpecimenRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="lab-scale-row">
      <p className="lab-meta">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function SystemBlock({ system }: { system: FontSystem }) {
  const { displayFont, uiFont, accentFont } = system;
  return (
    <div className="lab-specimen">
      <p className="lab-specimen-label">{system.name}</p>
      <p className="lab-note" style={{ marginBottom: "1.5rem" }}>
        {system.summary}
      </p>

      {system.id === "C" && accentFont ? (
        <SpecimenRow label="Series title (Instrument Serif)">
          <span className="lab-accent-title" style={{ fontFamily: accentFont }}>
            {realCopy.seriesTitle}
          </span>
        </SpecimenRow>
      ) : null}

      <SpecimenRow label="Desktop display">
        <span className="lab-hero" style={{ fontFamily: displayFont }}>
          {realCopy.wordmark}
        </span>
      </SpecimenRow>

      <SpecimenRow label="Mobile display (constrained)">
        <div style={{ maxWidth: "390px" }}>
          <span
            className="lab-display"
            style={{ fontFamily: displayFont, fontSize: "clamp(3.25rem, 14vw, 4.25rem)" }}
          >
            {realCopy.seriesTitle}
          </span>
        </div>
      </SpecimenRow>

      <SpecimenRow label="Page title">
        <span className="lab-page-title" style={{ fontFamily: displayFont }}>
          {realCopy.tagline}
        </span>
      </SpecimenRow>

      <SpecimenRow label="Section heading">
        <span className="lab-section-title" style={{ fontFamily: displayFont }}>
          Selected Works, 2019–2022
        </span>
      </SpecimenRow>

      <SpecimenRow label="Artwork title (incl. longest)">
        <div className="lab-stack-tight">
          <span className="lab-artwork-title" style={{ fontFamily: displayFont }}>
            {realCopy.titles.typical}
          </span>
          <span className="lab-artwork-title" style={{ fontFamily: displayFont }}>
            {realCopy.titles.longest}
          </span>
          <span className="lab-artwork-title" style={{ fontFamily: displayFont }}>
            {realCopy.titles.shortest}
          </span>
        </div>
      </SpecimenRow>

      <SpecimenRow label="Editorial body (60–66 char measure)">
        <p className="lab-body" style={{ fontFamily: uiFont }}>
          {realCopy.statement}
        </p>
      </SpecimenRow>

      <SpecimenRow label="Interface copy">
        <span className="lab-ui-text" style={{ fontFamily: uiFont }}>
          Home · Works · About · CV · Enquire — {realCopy.placeNames[0]},{" "}
          {realCopy.placeNames[4]}
        </span>
      </SpecimenRow>

      <SpecimenRow label="Metadata / caption">
        <div className="lab-stack-tight">
          <span className="lab-meta" style={{ fontFamily: uiFont }}>
            Oil on board in artist made frame · 71.5cm × 40.5cm · 2022
          </span>
          <span className="lab-meta" style={{ fontFamily: uiFont }}>
            {realCopy.cvEntry}
          </span>
        </div>
      </SpecimenRow>

      <div className="lab-grid-2" style={{ marginTop: "1.5rem" }}>
        <div>
          <p className="lab-meta">Strengths</p>
          <ul className="lab-ui-text">
            {system.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="lab-meta">Weaknesses</p>
          <ul className="lab-ui-text">
            {system.weaknesses.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function TypographySpecimen() {
  return (
    <section className="lab-section" id="typography" aria-labelledby="typography-h">
      <p className="lab-eyebrow">01 — Typography</p>
      <h2 className="lab-section-title" id="typography-h">
        Type systems, side by side
      </h2>
      <p className="lab-note" style={{ marginBlock: "1rem 2rem" }}>
        Each system is shown with real project strings: the wordmark, tagline, series
        title, three real artwork titles (including the longest,{" "}
        <em>{realCopy.titles.longest}</em>), real medium/dimensions, a verbatim artist
        statement, and a CV entry with Irish and Spanish glyphs. Fallback behaviour is
        exercised by the font stacks; all use <code>display: swap</code>.
      </p>
      <div className="lab-stack">
        {systems.map((system) => (
          <SystemBlock key={system.id} system={system} />
        ))}
      </div>
    </section>
  );
}
