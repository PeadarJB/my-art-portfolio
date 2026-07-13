import { describe, expect, it } from "vitest";

import { artworksByYearDescending } from "@/content/artworks";
import {
  archiveSummaries,
  featuredSeries,
  heroWork,
  resolveArtwork,
  resolvedFeaturedSeries,
  resolvedSelectedWorks,
  selectedWorks,
  type ArtworkRef,
} from "@/content/homepage";

function allCuratedRefs(): ArtworkRef[] {
  return [
    heroWork,
    featuredSeries.principal,
    ...featuredSeries.supporting,
    ...selectedWorks.map(({ year, artworkId }) => ({ year, artworkId })),
  ];
}

describe("homepage curation", () => {
  it("every configured reference resolves to a real artwork", () => {
    for (const ref of allCuratedRefs()) {
      expect(() => resolveArtwork(ref)).not.toThrow();
    }
  });

  it("resolves the hero, featured series and selected works at module load", () => {
    expect(resolvedFeaturedSeries.principal.id).toBe(featuredSeries.principal.artworkId);
    expect(resolvedFeaturedSeries.supporting.length).toBe(featuredSeries.supporting.length);
    expect(resolvedSelectedWorks.length).toBe(selectedWorks.length);
    for (const { work, artworkId } of resolvedSelectedWorks) {
      expect(work.id).toBe(artworkId);
    }
  });

  it("throws a clear error for a missing artwork reference", () => {
    expect(() => resolveArtwork({ year: 2022, artworkId: "not-a-real-id" })).toThrowError(
      /does not exist/i,
    );
  });

  it("has no duplicate works across the whole curation", () => {
    const keys = allCuratedRefs().map((ref) => `${ref.year}/${ref.artworkId}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("curates four to seven selected works", () => {
    expect(selectedWorks.length).toBeGreaterThanOrEqual(4);
    expect(selectedWorks.length).toBeLessThanOrEqual(7);
  });

  it("uses only known layout roles and includes at least one anchor", () => {
    const validRoles = new Set(["anchor", "supporting", "vertical", "landscape"]);
    for (const selection of selectedWorks) {
      expect(validRoles.has(selection.role)).toBe(true);
    }
    expect(selectedWorks.some((selection) => selection.role === "anchor")).toBe(true);
  });

  it("mixes artwork orientations across selected works", () => {
    const orientations = new Set(
      resolvedSelectedWorks.map(({ work }) =>
        work.image.width >= work.image.height ? "landscape" : "portrait",
      ),
    );
    expect(orientations.size).toBeGreaterThan(1);
  });

  it("archive index years and counts match the artwork collections", () => {
    const expected = artworksByYearDescending.map((collection) => ({
      year: collection.year,
      count: collection.works.length,
    }));
    const actual = archiveSummaries.map((summary) => ({
      year: summary.year,
      count: summary.count,
    }));
    expect(actual).toEqual(expected);
    for (const summary of archiveSummaries) {
      expect(summary.count).toBeGreaterThan(0);
    }
  });
});
