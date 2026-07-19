import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DetailView } from "@/components/detail-view";
import {
  getArtworkByYearAndId,
  getArtworkNeighbors,
  getArtworkRouteParams,
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

  const neighbors = getArtworkNeighbors(year, resolved.artworkId);

  return (
    <DetailView
      work={work}
      previous={neighbors.previous}
      next={neighbors.next}
      index={neighbors.index}
      total={neighbors.total}
    />
  );
}
