import type { Artwork, ArtworkCollection } from "@/lib/content-schema";

/**
 * Hero carousel playlist. Per the V2 design: on each visit, shuffle every
 * series' works independently, then interleave the series in the order given
 * (2022, 2021, 2020, 2019, repeat) so consecutive slides come from different
 * series for as long as more than one series still has works left.
 *
 * The random source is injectable so unit tests can run deterministically;
 * production callers use Math.random via the default.
 */
export type PlaylistEntry = {
  work: Artwork;
  year: number;
  seriesName: string;
};

export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function buildPlaylist(
  collections: readonly ArtworkCollection[],
  random: () => number = Math.random
): PlaylistEntry[] {
  const pools = collections.map((collection) =>
    shuffle(collection.works, random).map((work) => ({
      work,
      year: collection.year,
      seriesName: collection.name,
    }))
  );

  const playlist: PlaylistEntry[] = [];
  const longestPool = Math.max(0, ...pools.map((pool) => pool.length));
  for (let round = 0; round < longestPool; round++) {
    for (const pool of pools) {
      const entry = pool[round];
      if (entry) {
        playlist.push(entry);
      }
    }
  }
  return playlist;
}
