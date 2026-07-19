import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cvSections } from "@/content/site";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Curriculum vitae for Peadar Jolliffe-Byrne: education, solo and group exhibitions, awards, residencies, collections, and projects.",
  alternates: { canonical: "/cv" },
};

// Splits "2017-2018: MSc …" into a muted tabular year column and the entry
// text. Rows without a year prefix (e.g. "OPW Collection.") span in full.
function splitItem(item: string): { when: string; what: string } {
  const match = item.match(/^([\d\-–]+):\s*(.*)$/);
  return match ? { when: match[1], what: match[2] } : { when: "", what: item };
}

export default function CVPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <div className="subbar has-rule-below">
        <h1 className="subbar-label">CV</h1>
        <span className="subbar-muted">Curriculum Vitae</span>
      </div>

      <main id="main-content" className="cv-main">
        {cvSections.map((section) => (
          <section key={section.title} className="cv-section">
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item) => {
                const { when, what } = splitItem(item);
                return (
                  <li key={item}>
                    <span className="cv-year">{when}</span>
                    <span>{what}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}
