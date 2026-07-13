import { EnquiryButton } from "@/components/enquiry-button";

/**
 * Restrained closing invitation before the global footer. One clear action (the
 * existing enquiry behaviour) — no contact card, no oversized gradient button,
 * no competing calls to action. Copy is reused verbatim from the Contact page.
 */
export function HomeContact() {
  return (
    <section className="home-contact" aria-labelledby="home-contact-heading">
      <h2 id="home-contact-heading" className="home-contact-heading">
        Enquiries
      </h2>
      <p className="home-contact-copy">
        For collection, exhibition, and commission enquiries, send a message with the artwork
        title and your location.
      </p>
      <div className="home-contact-actions">
        <EnquiryButton />
      </div>
    </section>
  );
}
