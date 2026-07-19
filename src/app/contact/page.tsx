import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildEnquiryHref, getEnquiryEmail } from "@/lib/enquiry";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Enquire about collecting, exhibiting, or commissioning work by Peadar Jolliffe-Byrne.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const email = getEnquiryEmail();

  return (
    <div className="page-shell">
      <SiteHeader />
      <div className="subbar has-rule-below">
        <h1 className="subbar-label">Contact</h1>
        <span className="subbar-muted">Studio Enquiries</span>
      </div>

      <main id="main-content" className="contact-main">
        <div className="contact-block">
          <p className="lead">
            For collection, exhibition, and commission enquiries, send a message with the
            artwork title and your location.
          </p>
          <a className="contact-email" href={buildEnquiryHref()}>
            {email}
          </a>
          <p className="contact-meta">
            Enquiries go directly to the artist and are usually answered within a few days.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
