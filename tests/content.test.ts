import { describe, expect, it } from "vitest";

import { artworksByYearDescending } from "@/content/artworks";
import { cvSections } from "@/content/site";
import { artworkCollectionSchema } from "@/lib/content-schema";

const allWorks = artworksByYearDescending.flatMap((collection) => collection.works);

describe("artwork content", () => {
  it("every collection matches the Zod schema", () => {
    for (const collection of artworksByYearDescending) {
      expect(() => artworkCollectionSchema.parse(collection)).not.toThrow();
    }
  });

  it("has unique artwork ids", () => {
    const ids = allWorks.map((work) => work.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("names every series (navigation is series-name-first)", () => {
    const names = Object.fromEntries(
      artworksByYearDescending.map((collection) => [collection.year, collection.name])
    );
    expect(names).toEqual({
      2022: "Upland Folk",
      2021: "Oil Pastels",
      2020: "Works on Paper",
      2019: "Early Works",
    });
    for (const collection of artworksByYearDescending) {
      expect(collection.description.length).toBeGreaterThan(0);
    }
  });

  it("uses well-formed webp variant paths and positive dimensions", () => {
    for (const work of allWorks) {
      for (const key of ["small", "medium", "large"] as const) {
        expect(work.image[key]).toMatch(/^\/images\/\d{4}\/.+-(small|medium|large)\.webp$/);
      }
      expect(work.image.width).toBeGreaterThan(0);
      expect(work.image.height).toBeGreaterThan(0);
    }
  });

  it("has no metre/centimetre unit typo in dimensions (regression: '32m x 26cm')", () => {
    for (const work of allWorks) {
      expect(work.dimensions).not.toMatch(/\dm x/);
    }
  });

  it("does not leak legacy-archive placeholder text", () => {
    for (const work of allWorks) {
      expect(work.medium).not.toMatch(/not specified in legacy archive/i);
      expect(work.dimensions).not.toMatch(/not specified in legacy archive/i);
    }
  });
});

describe("cv content", () => {
  it("includes every legacy CV section", () => {
    const titles = cvSections.map((section) => section.title);
    for (const expected of [
      "Education",
      "Solo Exhibitions",
      "Group Exhibitions",
      "Awards",
      "Residencies",
      "Collections",
      "Workshops and Projects",
    ]) {
      expect(titles).toContain(expected);
    }
  });

  it("has at least one item in every section", () => {
    for (const section of cvSections) {
      expect(section.items.length).toBeGreaterThan(0);
    }
  });
});
