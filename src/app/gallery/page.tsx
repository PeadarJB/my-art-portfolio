import { GalleryGrid } from "@/components/gallery-grid";
import { UplandFolkIntro } from "@/components/upland-folk-intro";
import { artworksByYearDescending } from "@/content/artworks";

export default function GalleryPage() {
  return (
    <section className="page page-gallery">
      <header className="page-header">
        <p className="eyebrow">Gallery</p>
        <h1 className="headline">Selected Works</h1>
        <p className="lede">
          Responsive image delivery with quality-first detail views. Enquiry CTA is available on
          every work card.
        </p>
      </header>

      {artworksByYearDescending.map(({ year, works }) => (
        <section key={year} id={`year-${year}`} className="year-section">
          <div className="year-section-header">
            <h2>{year}</h2>
            <p>{works.length} works</p>
          </div>
          {year === 2022 ? <UplandFolkIntro /> : null}
          <GalleryGrid works={works} />
        </section>
      ))}
    </section>
  );
}
