import { describe, expect, it } from "vitest";

import { artworksByYearDescending, totalWorkCount } from "@/content/artworks";
import { buildPlaylist, shuffle } from "@/lib/playlist";

/** Deterministic LCG so playlist tests are reproducible. */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

describe("shuffle", () => {
  it("returns a permutation without mutating the input", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const copy = input.slice();
    const result = shuffle(input, seededRandom(7));
    expect(input).toEqual(copy);
    expect(result.slice().sort((a, b) => a - b)).toEqual(copy);
  });
});

describe("hero carousel playlist", () => {
  const playlist = buildPlaylist(artworksByYearDescending, seededRandom(42));

  it("contains every work exactly once", () => {
    expect(playlist.length).toBe(totalWorkCount);
    const ids = playlist.map((entry) => entry.work.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("opens with one slide from each series in year-descending order", () => {
    const openingSeries = playlist.slice(0, 4).map((entry) => entry.year);
    expect(openingSeries).toEqual([2022, 2021, 2020, 2019]);
  });

  it("never repeats a series on consecutive slides until only one series remains", () => {
    // With pool sizes 8/10/15/24 the only legitimate same-series neighbours
    // are inside the single-pool tail (the largest series).
    const largestSeries = [...artworksByYearDescending].sort(
      (a, b) => b.works.length - a.works.length
    )[0].name;

    for (let i = 0; i < playlist.length - 1; i++) {
      if (playlist[i].seriesName === playlist[i + 1].seriesName) {
        expect(playlist[i].seriesName).toBe(largestSeries);
      }
    }
  });

  it("tags every entry with its series name and year", () => {
    for (const entry of playlist) {
      const collection = artworksByYearDescending.find((c) => c.year === entry.year);
      expect(collection).toBeDefined();
      expect(entry.seriesName).toBe(collection!.name);
      expect(collection!.works.some((work) => work.id === entry.work.id)).toBe(true);
    }
  });
});
