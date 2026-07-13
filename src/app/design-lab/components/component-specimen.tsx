"use client";

import { useState } from "react";

const filters = ["All", "2022", "2021", "2020", "2019", "Upland Folk"];

export function ComponentSpecimen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("All");
  const [view, setView] = useState<"salon" | "index">("salon");
  const [email, setEmail] = useState("");

  const emailInvalid = email.length > 0 && !email.includes("@");

  return (
    <section className="lab-section" id="components" aria-labelledby="components-h">
      <p className="lab-eyebrow">06 — Interface</p>
      <h2 className="lab-section-title" id="components-h">
        Controls: quiet, squared, keyboard-visible
      </h2>
      <p className="lab-note" style={{ marginBlock: "1rem 2rem" }}>
        No 999px pills, no gradient buttons, no content-card shadows, no all-uppercase
        controls. Every control shows a visible keyboard focus ring (Tab through them).
        Small marks keep a ~44×44px hit area.
      </p>

      {/* Wordmark + desktop nav */}
      <div className="lab-specimen">
        <p className="lab-specimen-label">Wordmark &amp; desktop navigation</p>
        <div className="lab-row" style={{ justifyContent: "space-between" }}>
          <span className="lab-wordmark">
            Peadar Jolliffe-Byrne <small>Painter</small>
          </span>
          <nav className="lab-nav" aria-label="Specimen navigation">
            <a className="lab-underline" href="#components">
              Works
            </a>
            <a className="lab-underline" href="#components">
              Series
            </a>
            <a className="lab-underline" href="#components">
              About
            </a>
            <a className="lab-underline" href="#components">
              CV
            </a>
            <a className="lab-link-directional" href="#components">
              Enquire <span className="lab-arrow" aria-hidden="true">→</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Mobile menu concept */}
      <div className="lab-specimen">
        <p className="lab-specimen-label">Full-screen mobile menu concept</p>
        <button
          type="button"
          className="lab-btn lab-btn-quiet"
          aria-expanded={menuOpen}
          aria-controls="lab-mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? "Close menu" : "Open menu"}
        </button>
        {menuOpen ? (
          <div
            id="lab-mobile-menu"
            data-anim="fade-up"
            style={{
              marginTop: "1rem",
              padding: "1.5rem",
              border: "1px solid var(--lab-border)",
              borderRadius: "var(--lab-radius-overlay)",
              background: "var(--lab-bg-raised)",
            }}
          >
            <ul className="lab-stack" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {["Works", "Series", "About", "CV", "Enquire"].map((item) => (
                <li key={item}>
                  <a
                    className="lab-underline"
                    href="#components"
                    style={{ fontFamily: "var(--lab-font-display)", fontSize: "1.75rem" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* Links + actions */}
      <div className="lab-specimen">
        <p className="lab-specimen-label">Links &amp; actions</p>
        <div className="lab-cluster">
          <a className="lab-underline" href="#components">
            Animated underline link
          </a>
          <a className="lab-link-directional" href="#components">
            Directional link <span className="lab-arrow" aria-hidden="true">→</span>
          </a>
          <button type="button" className="lab-btn">
            Send enquiry
          </button>
          <button type="button" className="lab-btn lab-btn-quiet">
            Secondary
          </button>
        </div>
      </div>

      {/* Filters + Salon/Index switch */}
      <div className="lab-specimen">
        <p className="lab-specimen-label">Filter control &amp; Salon / Index switch</p>
        <div className="lab-row" style={{ justifyContent: "space-between" }}>
          <div className="lab-filters" role="group" aria-label="Filter works">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                className="lab-chip"
                aria-pressed={active === f}
                onClick={() => setActive(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="lab-switch" role="group" aria-label="View mode">
            <button
              type="button"
              aria-pressed={view === "salon"}
              onClick={() => setView("salon")}
            >
              Salon
            </button>
            <button
              type="button"
              aria-pressed={view === "index"}
              onClick={() => setView("index")}
            >
              Index
            </button>
          </div>
        </div>
        <p className="lab-meta" style={{ marginTop: "1rem" }}>
          Active filter: {active} · View: {view}
        </p>
      </div>

      {/* Caption + metadata block */}
      <div className="lab-specimen">
        <p className="lab-specimen-label">Artwork caption &amp; metadata block</p>
        <div className="lab-grid-2">
          <div>
            <p className="lab-caption-title" style={{ fontStyle: "italic" }}>
              Defiance of King Puck
            </p>
            <p className="lab-caption-meta">
              Oil on board in artist made frame · 67cm × 52.5cm · 2022
            </p>
          </div>
          <dl className="lab-stack-tight">
            <div className="lab-row" style={{ gap: "0.5rem" }}>
              <dt className="lab-meta" style={{ minWidth: "6rem" }}>
                Medium
              </dt>
              <dd className="lab-ui-text" style={{ margin: 0 }}>
                Oil on board in artist made frame
              </dd>
            </div>
            <div className="lab-row" style={{ gap: "0.5rem" }}>
              <dt className="lab-meta" style={{ minWidth: "6rem" }}>
                Dimensions
              </dt>
              <dd className="lab-ui-text" style={{ margin: 0 }}>
                67cm × 52.5cm
              </dd>
            </div>
            <div className="lab-row" style={{ gap: "0.5rem" }}>
              <dt className="lab-meta" style={{ minWidth: "6rem" }}>
                Year
              </dt>
              <dd className="lab-ui-text" style={{ margin: 0 }}>
                2022
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Form */}
      <div className="lab-specimen">
        <p className="lab-specimen-label">Form input, textarea &amp; validation</p>
        <form
          className="lab-stack"
          onSubmit={(e) => e.preventDefault()}
          noValidate
        >
          <div className="lab-field">
            <label htmlFor="lab-email">Email</label>
            <input
              id="lab-email"
              className="lab-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={emailInvalid}
              aria-describedby={emailInvalid ? "lab-email-error" : undefined}
              placeholder="you@example.com"
            />
            {emailInvalid ? (
              <span className="lab-error" id="lab-email-error" role="alert">
                Please include an @ in the email address.
              </span>
            ) : null}
          </div>
          <div className="lab-field">
            <label htmlFor="lab-message">Message</label>
            <textarea id="lab-message" className="lab-textarea" rows={4} />
          </div>
          <div>
            <button type="submit" className="lab-btn">
              Send enquiry
            </button>
          </div>
        </form>
      </div>

      {/* Lightbox chrome concept */}
      <div className="lab-specimen">
        <p className="lab-specimen-label">
          Lightbox chrome concept <span className="lab-flag">visual only — production lightbox untouched</span>
        </p>
        <div className="lab-lightbox">
          <div className="lab-lightbox-bar">
            <span className="lab-meta" style={{ color: "inherit" }}>
              03 / 08 — Upland Folk
            </span>
            <button type="button" className="lab-icon-btn" aria-label="Close viewer">
              ✕
            </button>
          </div>
          <div className="lab-lightbox-body">
            <button type="button" className="lab-icon-btn" aria-label="Previous artwork">
              ←
            </button>
            <p className="lab-ui-text" style={{ textAlign: "center", opacity: 0.7 }}>
              [ artwork area ]
            </p>
            <button type="button" className="lab-icon-btn" aria-label="Next artwork">
              →
            </button>
          </div>
        </div>
      </div>

      {/* Footer concept */}
      <div className="lab-specimen">
        <p className="lab-specimen-label">Footer concept</p>
        <footer className="lab-footer">
          <div>
            <span className="lab-wordmark" style={{ fontSize: "1.1rem" }}>
              Peadar Jolliffe-Byrne
            </span>
            <p className="lab-meta">Painting, objects and imagined landscapes</p>
          </div>
          <nav className="lab-stack-tight" aria-label="Footer">
            <a className="lab-underline" href="#components">
              Works
            </a>
            <a className="lab-underline" href="#components">
              About
            </a>
            <a className="lab-underline" href="#components">
              Enquire
            </a>
          </nav>
          <p className="lab-meta">© 2019–2022 · Selected works archive</p>
        </footer>
      </div>
    </section>
  );
}
