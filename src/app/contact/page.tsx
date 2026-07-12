import type { Metadata } from "next";

import { EnquiryButton } from "@/components/enquiry-button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Enquire about collecting, exhibiting, or commissioning work by Peadar Jolliffe-Byrne.",
  alternates: { canonical: "/contact" },
};

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
        <p className="meta">Enquiries go directly to the artist and are usually answered within a few days.</p>
      </div>
    </section>
  );
}
