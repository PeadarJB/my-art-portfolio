import { ArchiveIndex } from "@/components/home/archive-index";
import { FeaturedSeries } from "@/components/home/featured-series";
import { HomeContact } from "@/components/home/home-contact";
import { HomeHero } from "@/components/home/home-hero";
import { HomeIntroduction } from "@/components/home/home-introduction";
import { SelectedWorkGrid } from "@/components/home/selected-work-grid";

/**
 * Homepage — the opening pages of an artist monograph followed by entry into a
 * small digital exhibition:
 *   1. Hero — the artist and a principal work.
 *   2. Introduction — the character of the practice.
 *   3. Featured Upland Folk — a local soot exhibition preview.
 *   4. Selected works — a curated asymmetrical reading of the archive.
 *   5. Archive index — a route into the complete archive.
 *   6. Closing enquiry invitation.
 *
 * All curation lives in `content/homepage.ts`; this file only composes sections.
 * Kept as a Server Component (no client-side state required).
 */
export default function HomePage() {
  return (
    <div className="home">
      <HomeHero />
      <HomeIntroduction />
      <FeaturedSeries />
      <SelectedWorkGrid />
      <ArchiveIndex />
      <HomeContact />
    </div>
  );
}
