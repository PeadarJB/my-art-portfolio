import Link from "next/link";

import { yearlyCollectionSummaries } from "@/content/artworks";

export default function HomePage() {
  return (
    <section className="page page-home">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-grid">
        <p className="eyebrow">Artist Portfolio</p>
        <h1 className="headline">Colour. Myth. Memory. Contemporary painting practice.</h1>
        <p className="lede">
          A modern archive of selected works from 2019 to 2022, rebuilt for fast image
          delivery, immersive viewing, and direct collector enquiries.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/gallery">
            Enter Gallery
          </Link>
          <Link className="btn btn-secondary" href="/contact">
            Make an enquiry
          </Link>
        </div>
      </div>

      <section className="year-summary">
        <h2>Collections</h2>
        <div className="year-cards">
          {yearlyCollectionSummaries.map((summary) => (
            <article key={summary.year} className="year-card">
              <h3>{summary.year}</h3>
              <p>{summary.story}</p>
              <p className="meta">{summary.count} works</p>
              <Link className="inline-link" href={`/gallery#year-${summary.year}`}>
                View works
              </Link>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
