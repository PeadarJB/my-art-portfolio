import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Artist statement and background for Peadar Jolliffe-Byrne, whose painting and drawing practice draws on narrative, memory, and cultural heritage.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <section className="page prose-page">
      <header className="page-header">
        <p className="eyebrow">About</p>
        <h1 className="headline">Artist Statement</h1>
      </header>

      <div className="prose">
        <p>
          Born in Zimbabwe to Irish parents and shaped by life in South Africa, Ireland, and
          Mexico, Peadar Jolliffe-Byrne develops painting and drawing works grounded in narrative,
          memory, and symbolic form.
        </p>
        <p>
          The practice combines colourful psychological energy with professional rigor, drawing on
          both fine art training and cultural heritage research.
        </p>
        <p>
          This rebuilt portfolio foregrounds clarity, speed, and immersive viewing while preserving
          the material and emotional depth of the works.
        </p>
      </div>
    </section>
  );
}
