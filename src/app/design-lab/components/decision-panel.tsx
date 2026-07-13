const decisions: { term: string; value: string; detail: string }[] = [
  {
    term: "Font pairing",
    value: "System B — Newsreader + Manrope",
    detail:
      "Editorial authority with a quiet UI; real italic for artwork titles. Adopt System C's Instrument Serif for series titles ONLY.",
  },
  {
    term: "Default background",
    value: "Warm paper (--lab-paper #f2eee6)",
    detail: "Softer and more gallery-like than pure white; keep pure white as an alternate.",
  },
  {
    term: "Series-dark background",
    value: "Soot (--lab-soot #171412) with soft vignette",
    detail: "An exhibition room, not a colour-inverted dark mode.",
  },
  {
    term: "Accent strategy",
    value: "Cadmium as primary; one accent at a time",
    detail:
      "Ultramarine/mineral situational; ochre for large/graphic marks only (fails normal-text AA on paper). Never all at once.",
  },
  {
    term: "Radius & shadow",
    value: "Square images (radius 0); ~0.2rem on controls; shadows on overlays only",
    detail: "No 999px pills, no gradient buttons, no content-card shadows.",
  },
  {
    term: "Layout recipes",
    value: "Anchor+satellites, Vertical conversation, Exhibition plate",
    detail: "CSS Grid + container queries; full aspect ratios by default; labelled crops only.",
  },
  {
    term: "Motion intensity",
    value: "Low–moderate, tactile, CSS-only",
    detail:
      "≤24px entrances, ≤6 staggered items, hover 1.5%, overlays fade+scale; native View Transitions as progressive enhancement.",
  },
];

const openItems = [
  "Final call between warm paper and pure white as the default ground (needs eyes on real screens).",
  "Confirm the dark/pale/saturated artwork categorisations against the actual paintings.",
  "Whether Instrument Serif's single 400 weight is enough for series titles at hero scale.",
  "Exact accent role for ultramarine vs mineral once real page compositions exist.",
  "Whether a true installation photograph can be sourced (none exists in the repo today).",
];

export function DecisionPanel() {
  return (
    <section className="lab-section" id="decision" aria-labelledby="decision-h">
      <div className="lab-decision">
        <p className="lab-eyebrow">Design-review summary</p>
        <h2 className="lab-section-title" id="decision-h">
          Recommendation panel
        </h2>
        <p className="lab-note" style={{ marginTop: "0.75rem" }}>
          A read-only summary of what this laboratory recommends — not a preference UI.
        </p>
        <dl>
          {decisions.map((d) => (
            <div key={d.term} style={{ display: "contents" }}>
              <dt>{d.term}</dt>
              <dd>
                <strong>{d.value}</strong> — {d.detail}
              </dd>
            </div>
          ))}
        </dl>
        <div style={{ marginTop: "2rem" }}>
          <p className="lab-meta" style={{ marginBottom: "0.5rem" }}>
            Still requiring human visual judgement
          </p>
          <ul className="lab-ui-text">
            {openItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
