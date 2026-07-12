import { describe, expect, it } from "vitest";

import { artworksByYearDescending } from "@/content/artworks";
import {
  getArtworkByYearAndId,
  getArtworkNeighbors,
  getArtworkRouteParams,
  getYearArtworks,
} from "@/lib/artwork-queries";

const firstCollection = artworksByYearDescending[0];
const sampleYear = firstCollection.year;
const sampleWork = firstCollection.works[0];

describe("artwork-queries", () => {
  it("getYearArtworks returns works for a known year and [] for an unknown one", () => {
    expect(getYearArtworks(sampleYear).length).toBeGreaterThan(0);
    expect(getYearArtworks(1234)).toEqual([]);
  });

  it("getArtworkByYearAndId finds a known work and returns null otherwise", () => {
    expect(getArtworkByYearAndId(sampleYear, sampleWork.id)?.id).toBe(sampleWork.id);
    expect(getArtworkByYearAndId(sampleYear, "does-not-exist")).toBeNull();
  });

  it("getArtworkRouteParams returns one entry per work with a string year", () => {
    const params = getArtworkRouteParams();
    const total = artworksByYearDescending.flatMap((collection) => collection.works).length;
    expect(params.length).toBe(total);
    expect(params.every((p) => typeof p.year === "string" && p.artworkId.length > 0)).toBe(true);
  });

  it("getArtworkNeighbors wraps around within a year", () => {
    const works = getYearArtworks(sampleYear);
    const neighbors = getArtworkNeighbors(sampleYear, works[0].id);
    expect(neighbors.total).toBe(works.length);
    expect(neighbors.index).toBe(0);
    if (works.length > 1) {
      expect(neighbors.next?.id).toBe(works[1].id);
      expect(neighbors.previous?.id).toBe(works[works.length - 1].id);
    }
  });
});
