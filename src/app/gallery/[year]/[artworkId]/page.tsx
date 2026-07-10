import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EnquiryButton } from "@/components/enquiry-button";
import { LightboxTrigger } from "@/components/lightbox-trigger";
import {
  getArtworkByYearAndId,
  getArtworkNeighbors,
  getArtworkRouteParams,
  getYearArtworks,
} from "@/lib/artwork-queries";

type ArtworkDetailPageProps = {
  params: Promise<{
    artworkId: string;
    year: string;
  }>;
};

export function generateStaticParams() {
  return getArtworkRouteParams();
}

export async function generateMetadata({
  params,
}: ArtworkDetailPageProps): Promise<Metadata> {
  const resolved = await params;
  const year = Number(resolved.year);
  const work = getArtworkByYearAndId(year, resolved.artworkId);

  if (!work) {
    return {
      title: "Artwork Not Found",
    };
  }

  return {
    title: `${work.title} (${work.year})`,
    description: `${work.medium}. ${work.dimensions}.`,
    openGraph: {
      title: `${work.title} | Peadar Jolliffe-Byrne`,
      description: `${work.medium}. ${work.dimensions}.`,
      images: [work.image.large],
    },
  };
}

export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const resolved = await params;
  const year = Number(resolved.year);

  if (!Number.isFinite(year)) {
    notFound();
  }

  const work = getArtworkByYearAndId(year, resolved.artworkId);
  if (!work) {
    notFound();
  }

  const yearWorks = getYearArtworks(year);
  const neighbors = getArtworkNeighbors(year, resolved.artworkId);

  return (
    <section className="page detail-page">
      <header className="page-header">
        <p className="eyebrow">Artwork Detail</p>
        <h1 className="headline">{work.title}</h1>
        <p className="lede">{work.medium}</p>
      </header>

      <div className="detail-top-actions">
        <Link className="btn btn-secondary" href={`/gallery#year-${work.year}`}>
          Back to {work.year} collection
        </Link>
        <LightboxTrigger
          items={yearWorks}
          startId={work.id}
          className="btn btn-primary"
          label="Open high-fidelity lightbox"
        />
      </div>

      <div className="detail-image-shell">
        <Image
          src={work.image.large}
          alt={work.image.alt}
          width={work.image.width}
          height={work.image.height}
          className="detail-image"
          quality={96}
          priority
          sizes="(max-width: 900px) 95vw, 82vw"
        />
      </div>

      <section className="detail-meta-grid">
        <article className="detail-meta-card">
          <h2>Artwork Information</h2>
          <dl>
            <div>
              <dt>Title</dt>
              <dd>{work.title}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{work.year}</dd>
            </div>
            <div>
              <dt>Medium</dt>
              <dd>{work.medium}</dd>
            </div>
            <div>
              <dt>Dimensions</dt>
              <dd>{work.dimensions}</dd>
            </div>
          </dl>
        </article>

        <article className="detail-meta-card">
          <h2>Actions</h2>
          <div className="detail-action-list">
            <EnquiryButton title={work.title} />
            {neighbors.previous ? (
              <Link
                className="btn btn-secondary"
                href={`/gallery/${neighbors.previous.year}/${neighbors.previous.id}`}
              >
                Previous work
              </Link>
            ) : null}
            {neighbors.next ? (
              <Link className="btn btn-secondary" href={`/gallery/${neighbors.next.year}/${neighbors.next.id}`}>
                Next work
              </Link>
            ) : null}
            <p className="meta">
              {neighbors.index + 1} of {neighbors.total} in {work.year}
            </p>
          </div>
        </article>
      </section>
    </section>
  );
}
