import { resolvedSelectedWorks, type ResolvedSelection } from "@/content/homepage";
import { HomeArtworkFigure } from "@/components/home/artwork-figure";

const SIZES_BY_ROLE: Record<ResolvedSelection["role"], string> = {
  anchor: "(max-width: 860px) 92vw, 52vw",
  supporting: "(max-width: 860px) 92vw, 26vw",
  vertical: "(max-width: 860px) 92vw, 30vw",
  landscape: "(max-width: 860px) 92vw, 32vw",
};

/**
 * Curated selected-work sequence composed from the approved design-lab recipes:
 * an "anchor and satellites" band (anchor + supporting works) and a "vertical
 * conversation" band (vertical works + a landscape breather). Composition is
 * asymmetrical CSS Grid with intentional blank space; the artwork block is the
 * primary link (no card backgrounds, no repeated "View detail" buttons). DOM
 * order follows the curation order so the mobile reading order stays logical.
 */
export function SelectedWorkGrid() {
  const anchor = resolvedSelectedWorks.find((item) => item.role === "anchor");
  const supporting = resolvedSelectedWorks.filter((item) => item.role === "supporting");
  const verticals = resolvedSelectedWorks.filter((item) => item.role === "vertical");
  const landscape = resolvedSelectedWorks.find((item) => item.role === "landscape");

  const anchorBand = [anchor, ...supporting].filter(Boolean) as ResolvedSelection[];
  const verticalBand = [...verticals, landscape].filter(Boolean) as ResolvedSelection[];

  return (
    <section className="home-selected" aria-labelledby="home-selected-heading">
      <h2 id="home-selected-heading" className="home-selected-heading">
        Selected works
      </h2>

      <div className="home-anchor-band">
        {anchorBand.map(({ work, role }) => (
          <HomeArtworkFigure
            key={work.id}
            work={work}
            variant="medium"
            sizes={SIZES_BY_ROLE[role]}
            className={`home-selected-item role-${role}`}
          />
        ))}
      </div>

      <div className="home-vertical-band">
        {verticalBand.map(({ work, role }) => (
          <HomeArtworkFigure
            key={work.id}
            work={work}
            variant="medium"
            sizes={SIZES_BY_ROLE[role]}
            className={`home-selected-item role-${role}`}
          />
        ))}
      </div>
    </section>
  );
}
