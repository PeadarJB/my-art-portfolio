import { EnquiryButton } from "@/components/enquiry-button";

export default function ContactPage() {
  return (
    <section className="page prose-page">
      <header className="page-header">
        <p className="eyebrow">Contact</p>
        <h1 className="headline">Studio Enquiries</h1>
      </header>

      <div className="contact-card">
        <p>
          For collection, exhibition, and commission enquiries, send a message with the artwork
          title and your location.
        </p>
        <EnquiryButton />
        <p className="meta">
          Placeholder email is currently configured. Update with your final studio address before
          launch.
        </p>
      </div>
    </section>
  );
}
