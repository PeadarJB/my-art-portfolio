import type { Metadata } from "next";
import Image from "next/image";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getArtworkByYearAndId } from "@/lib/artwork-queries";
import { buildEnquiryHref } from "@/lib/enquiry";

export const metadata: Metadata = {
  title: "About",
  description:
    "Artist statement and background for Peadar Jolliffe-Byrne, whose painting and drawing practice draws on narrative, memory, and cultural heritage.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const selfPortrait = getArtworkByYearAndId(2020, "2020-self-portrait");

  return (
    <div className="page-shell">
      <SiteHeader />
      <div className="subbar has-rule-below">
        <h1 className="subbar-label">About</h1>
        <span className="subbar-muted">Artist Statement</span>
      </div>

      <main id="main-content" className="about-main">
        {selfPortrait ? (
          <figure className="about-figure">
            <Image
              src={selfPortrait.image.medium}
              alt="Self Portrait, gouache on paper, 2020"
              width={selfPortrait.image.width}
              height={selfPortrait.image.height}
              sizes="(max-width: 768px) 100vw, 420px"
              priority
            />
            <figcaption>
              <i>Self Portrait</i>, 2020 — gouache on paper, 32 × 26.5 cm
            </figcaption>
          </figure>
        ) : null}

        <div className="about-statement">
          <p className="lead">
            Born in Zimbabwe to Irish parents and shaped by life in South Africa, Ireland, and
            Mexico, Peadar Jolliffe-Byrne develops painting and drawing works grounded in
            narrative, memory, and symbolic form.
          </p>
          <p className="about-secondary">
            The practice combines colourful psychological energy with professional rigor,
            drawing on both fine art training and cultural heritage research.
          </p>
          <a className="accent-link" href={buildEnquiryHref()}>
            Studio enquiries →
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
