/**
 * Homepage curation.
 *
 * This file decides WHICH existing artworks appear on the homepage and in which
 * role. It deliberately does NOT duplicate artwork records or touch the artwork
 * Zod schema — every entry is a lightweight reference (year + id) that is
 * resolved through the existing query helper. A reference to a work that does
 * not exist throws at module load, so a bad id fails `npm run build`,
 * `npm run test` and `npm run dev` clearly rather than rendering a blank slot.
 *
 * To re-curate the homepage later, edit the references below. The selected
 * works chosen here (and the rationale) are documented in
 * `docs/phase-2-homepage-and-shell.md`.
 */
import { yearlyCollectionSummaries } from "@/content/artworks";
import { getArtworkByYearAndId } from "@/lib/artwork-queries";
import type { Artwork } from "@/lib/content-schema";

export type HomepageWorkRole = "anchor" | "supporting" | "vertical" | "landscape";

export type ArtworkRef = {
  year: number;
  artworkId: string;
};

export type HomepageSelection = ArtworkRef & {
  role: HomepageWorkRole;
};

// --------------------------------------------------------------------------
// Curation — edit here.
// --------------------------------------------------------------------------

/**
 * Opening hero. A transparent Upland Folk work with an artist-made frame that
 * reads strongly at large scale and sits naturally on warm paper.
 * (Remnants of the Wild Hunt — 2022, 1000×1486, highest-resolution 2022 file.)
 */
export const heroWork: ArtworkRef = {
  year: 2022,
  artworkId: "2022-remnants-of-the-wild-hunt",
};

/**
 * Featured Upland Folk exhibition preview (local soot environment). Distinct
 * from the hero. Series identity uses the existing Upland Folk title graphic
 * and the existing series-context copy; only transparent works are shown.
 */
export const featuredSeries = {
  principal: { year: 2022, artworkId: "2022-escape-from-the-cave" } satisfies ArtworkRef,
  supporting: [
    { year: 2022, artworkId: "2022-cycle-of-the-goddess" },
    { year: 2022, artworkId: "2022-dawn" },
  ] satisfies ArtworkRef[],
};

/**
 * Selected works — a curated reading across the archive.
 *
 * Deliberately drawn from 2019–2020 (clean flat scans) rather than 2021, whose
 * source assets are low-resolution environmental photographs. Year variation
 * across the whole homepage is covered by the 2022 hero + featured series and
 * the full archive index. Roles drive the desktop composition:
 *   - anchor / supporting → "anchor and satellites" band
 *   - vertical / landscape → "vertical conversation" band
 */
export const selectedWorks: HomepageSelection[] = [
  { year: 2019, artworkId: "2019-dismal-day-on-the-beach", role: "anchor" }, // landscape, largest work
  { year: 2019, artworkId: "2019-clouds", role: "supporting" }, // quiet / pale
  { year: 2020, artworkId: "2020-female-portrait", role: "supporting" }, // graphite, monochrome
  { year: 2019, artworkId: "2019-jungle-at-nighttime", role: "vertical" }, // dark / saturated
  { year: 2020, artworkId: "2020-self-portrait", role: "vertical" }, // figurative, mid-tone
  { year: 2020, artworkId: "2020-imagined-landscape-2", role: "landscape" }, // bright watercolour
];

/**
 * Archive index ordering. The homepage archive index reuses the existing
 * year-descending collection summaries (year, count, story) verbatim, so no
 * separate ordering is required. Exposed here as the single import surface for
 * the homepage.
 */
export const archiveSummaries = yearlyCollectionSummaries;

// --------------------------------------------------------------------------
// Resolution — runs at module load so a bad reference fails fast and clearly.
// --------------------------------------------------------------------------

export function resolveArtwork(ref: ArtworkRef): Artwork {
  const work = getArtworkByYearAndId(ref.year, ref.artworkId);
  if (!work) {
    throw new Error(
      `Homepage curation references an artwork that does not exist: ` +
        `${ref.year}/${ref.artworkId}. Reconcile content/homepage.ts with content/artworks.ts.`,
    );
  }
  return work;
}

export type ResolvedSelection = HomepageSelection & { work: Artwork };

export const resolvedHeroWork: Artwork = resolveArtwork(heroWork);

export const resolvedFeaturedSeries = {
  principal: resolveArtwork(featuredSeries.principal),
  supporting: featuredSeries.supporting.map(resolveArtwork),
};

export const resolvedSelectedWorks: ResolvedSelection[] = selectedWorks.map((selection) => ({
  ...selection,
  work: resolveArtwork(selection),
}));
