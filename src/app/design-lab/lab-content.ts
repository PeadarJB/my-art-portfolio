/**
 * Design-lab content selection.
 *
 * Real artwork records are pulled through the existing data export
 * (`artworksByYearDescending`) and the existing query helper
 * (`getArtworkByYearAndId`). Records are NOT duplicated here — only referenced
 * by id, so the production data layer stays the single source of truth.
 *
 * Strings that describe fields the production schema does not have (e.g. a
 * per-work description or a series tagline) are clearly labelled PROTOTYPE COPY
 * and live only in this file. They are never written back to the Zod schema.
 */

import { getArtworkByYearAndId } from "@/lib/artwork-queries";
import type { Artwork } from "@/lib/content-schema";

function require_(year: number, id: string): Artwork {
  const work = getArtworkByYearAndId(year, id);
  if (!work) {
    // Fail loudly at build if a referenced id ever drifts, rather than
    // silently rendering a broken specimen.
    throw new Error(`design-lab: expected artwork ${id} (${year}) not found`);
  }
  return work;
}

export type LabPick = {
  /** Why this real work was chosen to demonstrate a design property. */
  reason: string;
  /** Selection categories the reviewer should confirm visually. */
  category: string;
  work: Artwork;
};

export const picks = {
  portrait: {
    category: "Portrait orientation",
    reason: "Tall 1000×1754 board; bold flat colour reads well at large display scale.",
    work: require_(2022, "2022-escape-from-the-cave"),
  },
  landscape: {
    category: "Landscape orientation",
    reason: "Wide 1000×635 canvas; the largest work (160cm × 240cm) — good anchor test.",
    work: require_(2019, "2019-dismal-day-on-the-beach"),
  },
  square: {
    category: "Approximately square",
    reason: "Near-square 1000×1036; artist-made cast frame is part of the object.",
    work: require_(2022, "2022-dawn"),
  },
  dark: {
    category: "Predominantly dark",
    reason: "Deep blue/black night jungle — stress test for the atmospheric environment.",
    work: require_(2019, "2019-jungle-at-nighttime"),
  },
  pale: {
    category: "Predominantly pale",
    reason: "Pale blue impasto on a near-white board — stress test for warm-paper vs pure-white grounds.",
    work: require_(2019, "2019-clouds"),
  },
  saturated: {
    category: "Highly saturated",
    reason: "Intense red/black/yellow; tests accent restraint beside strong artwork colour.",
    work: require_(2022, "2022-defiance-of-king-puck"),
  },
  sculpturalFrame: {
    category: "Artist-made sculptural frame (doubles with portrait pick)",
    reason: "Medium is recorded as 'Oil on board in artist made frame'; the moulded white frame with star finial and dripping base is part of the artwork.",
    work: require_(2022, "2022-escape-from-the-cave"),
  },
} satisfies Record<string, LabPick>;

/** Every distinct real work used in the lab, for the palette grid. */
export const paletteWorks: Artwork[] = [
  picks.portrait.work,
  picks.landscape.work,
  picks.square.work,
  picks.dark.work,
  picks.pale.work,
  picks.saturated.work,
];

/**
 * The only non-artwork image assets that exist in the repository are the two
 * Upland Folk title graphics. No installation / contextual photograph exists,
 * so the "Exhibition plate" recipe uses this title graphic plus a principal
 * artwork instead of inventing an install shot.
 */
export const uplandFolkTitleGraphic = {
  light: "/images/2022/UplandFolk-black-large.svg",
  dark: "/images/2022/UplandFolk-white-large.svg",
  alt: "Upland Folk title graphic",
} as const;

/** Real strings already present in the project, reused for glyph coverage. */
export const realCopy = {
  wordmark: "Peadar Jolliffe-Byrne",
  tagline: "Painting, objects and imagined landscapes",
  seriesTitle: "Upland Folk",
  /** Verbatim from the existing About page (src/app/about/page.tsx). */
  statement:
    "Born in Zimbabwe to Irish parents and shaped by life in South Africa, Ireland, and Mexico, Peadar Jolliffe-Byrne develops painting and drawing works grounded in narrative, memory, and symbolic form.",
  /** Verbatim CV entries (content/site.ts) — include accented glyphs. */
  cvEntry: "2016: Conference (IADT graduation show), IADT Dún Laoghaire, Dublin, IE.",
  cvEntryAlt: "2022: Upland Folk, Gimnasio de Arte y Cultura, Mexico City, MX.",
  /** Real place names present in the project (Irish + Spanish). */
  placeNames: ["Dún Laoghaire", "Co. Clare", "Portlaoise", "Gimnasio de Arte y Cultura", "Mexico City"],
  /** Three real titles incl. the longest available. */
  titles: {
    shortest: "Dawn",
    typical: "Defiance of King Puck",
    longest: "Indian Boy Breaking Rocks for the Rest of his Life",
  },
} as const;

/**
 * PROTOTYPE COPY — not real facts, not in the schema. Placeholder editorial
 * text used only to exercise the reading measure and caption blocks. Clearly
 * marked wherever it renders.
 */
export const prototypeCopy = {
  seriesStanding:
    "[PROTOTYPE COPY] An exhibition room holds a single series in one light. The wall recedes; the frame does the talking. This paragraph exists only to test editorial rhythm at a 60–66 character measure and is not artist-approved text.",
  captionNote: "[prototype note]",
} as const;
