import { ArtworkLayouts } from "./components/artwork-layouts";
import { ComponentSpecimen } from "./components/component-specimen";
import { DecisionPanel } from "./components/decision-panel";
import { MotionSpecimen } from "./components/motion-specimen";
import { PaletteSpecimen } from "./components/palette-specimen";
import { TypographySpecimen } from "./components/typography-specimen";

const typeScale: { role: string; range: string; token: string; sample: string }[] = [
  { role: "Hero display", range: "52 → 144px", token: "--lab-type-hero", sample: "Upland Folk" },
  { role: "Page title", range: "42 → 96px", token: "--lab-type-page", sample: "Selected Works" },
  { role: "Section heading", range: "30 → 64px", token: "--lab-type-section", sample: "2019–2022" },
  { role: "Artwork title", range: "20 → 36px", token: "--lab-type-artwork", sample: "Defiance of King Puck" },
  { role: "Editorial body", range: "17 → 21px", token: "--lab-type-body", sample: "Narrative, memory, symbolic form." },
  { role: "Interface text", range: "15 → 17px", token: "--lab-type-ui", sample: "Works · About · CV · Enquire" },
  { role: "Metadata", range: "12 → 14px", token: "--lab-type-meta", sample: "Oil on board · 67cm × 52.5cm · 2022" },
];

const sections = [
  ["decision", "Recommendation"],
  ["typography", "01 Typography"],
  ["scale", "02 Type scale"],
  ["palette", "03 Palette"],
  ["layouts", "04/05 Layout"],
  ["components", "06 Interface"],
  ["theme", "07 Environments"],
  ["motion", "08 Motion"],
  ["responsive", "09 Responsive"],
];

export default function DesignLabPage() {
  return (
    <div className="lab-canvas">
      <header className="lab-section" id="top">
        <p className="lab-eyebrow">Private · noindex — not linked from the site</p>
        <h1 className="lab-hero">The Animated Monograph</h1>
        <p className="lab-body" style={{ marginTop: "1.5rem" }}>
          A design laboratory for the portfolio redesign. Everything here is scoped under{" "}
          <code>.design-lab</code> and changes no production page. Artwork and metadata
          are real, pulled from the existing data layer; any non-schema copy is clearly
          labelled prototype text.
        </p>
        <nav className="lab-toc" aria-label="Sections">
          {sections.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <DecisionPanel />
      <hr className="lab-divider" />

      <TypographySpecimen />

      {/* §2 Type scale */}
      <section className="lab-section" id="scale" aria-labelledby="scale-h">
        <p className="lab-eyebrow">02 — Type scale</p>
        <h2 className="lab-section-title" id="scale-h">
          Fluid scale (clamp)
        </h2>
        <p className="lab-note" style={{ marginBlock: "1rem 1.5rem" }}>
          Resize the window to watch each step scale between its mobile and desktop
          bounds. Rendered in System B.
        </p>
        <div className="lab-specimen">
          {typeScale.map((t) => (
            <div className="lab-scale-row" key={t.token}>
              <div>
                <p className="lab-ui-text" style={{ fontWeight: 600 }}>
                  {t.role}
                </p>
                <p className="lab-meta">
                  {t.range} · <code>{t.token}</code>
                </p>
              </div>
              <div
                style={{
                  fontFamily:
                    t.token === "--lab-type-body" ||
                    t.token === "--lab-type-ui" ||
                    t.token === "--lab-type-meta"
                      ? "var(--lab-font-ui)"
                      : "var(--lab-font-display)",
                  fontSize: `var(${t.token})`,
                  lineHeight: 1.05,
                }}
              >
                {t.sample}
              </div>
            </div>
          ))}
        </div>
        <p className="lab-note" style={{ marginTop: "1rem" }}>
          Guards tested: balanced hero wrapping (<code>text-wrap: balance</code>), the
          longest real title, a 390px column, a 60–66ch reading measure, and font-swap
          fallback. Ultra-light weights over images are avoided.
        </p>
      </section>

      <PaletteSpecimen />
      <ArtworkLayouts />
      <ComponentSpecimen />

      {/* §7 Theme / environment model */}
      <section className="lab-section" id="theme" aria-labelledby="theme-h">
        <p className="lab-eyebrow">07 — Environments</p>
        <h2 className="lab-section-title" id="theme-h">
          Three environments, one system
        </h2>
        <p className="lab-note" style={{ marginBlock: "1rem 1.5rem" }}>
          The production light/dark store and no-flash script are untouched. This shows
          the <em>concept</em>: an editorial default, an atmospheric series room, and a
          user-selected dark appearance — demonstrated with scoped{" "}
          <code>data-lab-env</code> attributes only.
        </p>
        <div className="lab-grid-3">
          <div className="lab-specimen" data-lab-env="editorial">
            <p className="lab-specimen-label">Editorial (default)</p>
            <p className="lab-artwork-title">Selected Works</p>
            <p className="lab-body">Warm paper, ink text, art leads the colour.</p>
          </div>
          <div className="lab-specimen lab-room" data-lab-env="atmospheric">
            <p className="lab-specimen-label">Atmospheric (series)</p>
            <p className="lab-artwork-title">Upland Folk</p>
            <p className="lab-body">Soot ground, bone text, a single accent.</p>
          </div>
          <div className="lab-specimen" data-lab-env="dark">
            <p className="lab-specimen-label">Dark (user-selected)</p>
            <p className="lab-artwork-title">Selected Works</p>
            <p className="lab-body">Neutral dark for reading, not a room.</p>
          </div>
        </div>

        <div className="lab-specimen lab-room" data-lab-env="atmospheric" style={{ marginTop: "var(--lab-art-gap)" }}>
          <p className="lab-specimen-label">
            Possible Upland Folk palette — accents appear one at a time
          </p>
          <div className="lab-row">
            {[
              ["Soot", "#171412"],
              ["Bone", "#eee8de"],
              ["Cadmium", "#b74034"],
              ["Ochre", "#b98328"],
              ["Ultramarine", "#31578a"],
            ].map(([name, hex]) => (
              <div key={name} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    background: hex,
                    borderRadius: "var(--lab-radius-control)",
                    border: "1px solid rgb(255 255 255 / 0.2)",
                  }}
                />
                <p className="lab-meta" style={{ color: "var(--lab-bone)", marginTop: "0.35rem" }}>
                  {name}
                </p>
              </div>
            ))}
          </div>
          <p className="lab-note" style={{ marginTop: "1rem", color: "var(--lab-dark-muted)" }}>
            One accent per view. Here cadmium leads the room; ochre and ultramarine are
            held in reserve for individual works rather than shown simultaneously.
          </p>
        </div>
      </section>

      <MotionSpecimen />

      {/* §9 Responsive notes */}
      <section className="lab-section" id="responsive" aria-labelledby="responsive-h">
        <p className="lab-eyebrow">09 — Responsive</p>
        <h2 className="lab-section-title" id="responsive-h">
          390 / 768 / 1440
        </h2>
        <div className="lab-specimen">
          <ul className="lab-ui-text">
            <li>
              <strong>390px</strong> — single-column reading order, near-edge artwork
              inside the gutter, titles stay legible (hero clamps to ~52px), metadata is
              always visible (never hover-gated), controls keep ~44px targets.
            </li>
            <li>
              <strong>768px</strong> — recipes begin to split via container queries;
              satellites and conversation columns appear.
            </li>
            <li>
              <strong>1440px</strong> — full compositions on the 106rem canvas with
              generous section spacing and a 64ch editorial measure.
            </li>
          </ul>
          <p className="lab-note" style={{ marginTop: "1rem" }}>
            Compositions are rebuilt per breakpoint (container queries), not collapsed
            into an undifferentiated stack.
          </p>
        </div>
      </section>

      <hr className="lab-divider" />
      <p className="lab-meta">
        End of laboratory · production pages are unchanged · this route is{" "}
        <code>noindex, nofollow</code> and absent from navigation, sitemap and robots.
      </p>
    </div>
  );
}
