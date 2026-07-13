import Link from "next/link";

/**
 * Concise editorial introduction using existing approved About copy. A small
 * section label, one substantial Newsreader statement, a quieter Manrope
 * supporting paragraph, and a link to About. No card; reading measure held near
 * `--reading-max`. Deliberately avoids repeating the hero line.
 */
export function HomeIntroduction() {
  return (
    <section className="home-intro" aria-labelledby="home-intro-heading">
      <h2 id="home-intro-heading" className="section-eyebrow">
        Introduction
      </h2>
      <p className="home-intro-statement">
        The practice combines colourful psychological energy with professional rigor, drawing
        on both fine art training and cultural heritage research.
      </p>
      <p className="home-intro-support">
        Born in Zimbabwe to Irish parents and shaped by life in South Africa, Ireland, and
        Mexico, Peadar Jolliffe-Byrne develops painting and drawing works grounded in
        narrative, memory, and symbolic form.
      </p>
      <Link className="inline-link" href="/about">
        Read the full statement
      </Link>
    </section>
  );
}
