import Image from "next/image";
import Link from "next/link";

import type { Artwork } from "@/lib/content-schema";
import { EnquiryButton } from "@/components/enquiry-button";

type ArtworkCardProps = {
  work: Artwork;
};

export function ArtworkCard({ work }: ArtworkCardProps) {
  const detailHref = `/gallery/${work.year}/${work.id}`;

  return (
    <article className="artwork-card">
      <Link className="artwork-image-shell" href={detailHref}>
        <Image
          src={work.image.medium}
          alt={work.image.alt}
          className="artwork-image"
          loading="lazy"
          width={work.image.width}
          height={work.image.height}
          sizes="(max-width: 900px) 100vw, (max-width: 1300px) 50vw, 33vw"
          quality={82}
        />
      </Link>
      <h3>
        <Link className="artwork-title-link" href={detailHref}>
          {work.title}
        </Link>
      </h3>
      <p>{work.medium}</p>
      <p className="meta">
        {work.dimensions} · {work.year}
      </p>
      <div className="artwork-actions">
        <Link className="btn btn-secondary btn-compact" href={detailHref}>
          View detail
        </Link>
        <EnquiryButton title={work.title} />
      </div>
    </article>
  );
}
