import type { Artwork } from "@/lib/content-schema";
import { ArtworkCard } from "@/components/artwork-card";

type GalleryGridProps = {
  works: Artwork[];
};

export function GalleryGrid({ works }: GalleryGridProps) {
  return (
    <div className="gallery-grid">
      {works.map((work) => (
        <ArtworkCard key={work.id} work={work} />
      ))}
    </div>
  );
}
