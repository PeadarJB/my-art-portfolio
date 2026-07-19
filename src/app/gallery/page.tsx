import type { Metadata } from "next";

import { GalleryView } from "@/components/gallery-view";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Slideshow-first browsing of the complete archive: Upland Folk, Oil Pastels, Works on Paper, and Early Works, 2019–2022.",
  alternates: { canonical: "/gallery" },
};

type GalleryPageProps = {
  searchParams: Promise<{ y?: string }>;
};

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const { y } = await searchParams;
  const initialYear = y ? Number(y) : undefined;

  return <GalleryView initialYear={Number.isFinite(initialYear) ? initialYear : undefined} />;
}
