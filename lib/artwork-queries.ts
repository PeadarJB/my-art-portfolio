import { artworksByYearDescending } from "@/content/artworks";
import type { Artwork } from "@/lib/content-schema";

export type ArtworkRouteParams = {
  artworkId: string;
  year: string;
};

export type ArtworkNeighbors = {
  index: number;
  next: Artwork | null;
  previous: Artwork | null;
  total: number;
};

export function getYearArtworks(year: number): Artwork[] {
  const collection = artworksByYearDescending.find((candidate) => candidate.year === year);
  return collection?.works ?? [];
}

export function getArtworkByYearAndId(year: number, artworkId: string): Artwork | null {
  const works = getYearArtworks(year);
  return works.find((work) => work.id === artworkId) ?? null;
}

export function getArtworkNeighbors(year: number, artworkId: string): ArtworkNeighbors {
  const works = getYearArtworks(year);
  const index = works.findIndex((work) => work.id === artworkId);
  const safeIndex = index < 0 ? 0 : index;

  return {
    index: safeIndex,
    next: works.length > 1 ? works[(safeIndex + 1) % works.length] : null,
    previous: works.length > 1 ? works[(safeIndex - 1 + works.length) % works.length] : null,
    total: works.length,
  };
}

export function getArtworkRouteParams(): ArtworkRouteParams[] {
  return artworksByYearDescending.flatMap((collection) =>
    collection.works.map((work) => ({
      artworkId: work.id,
      year: String(collection.year),
    }))
  );
}
