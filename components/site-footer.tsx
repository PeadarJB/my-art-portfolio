import Link from "next/link";

import { buildEnquiryHref } from "@/lib/enquiry";
import { siteName } from "@/lib/site";

const footerNav = [
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

/**
 * Restrained, editorial global footer. Full-width surface with a hairline top
 * divider; content aligns to the same capped canvas as the header and page.
 * Newsreader artist name, Manrope utility links, an enquiry link built from the
 * existing enquiry configuration, and a copyright year computed at
 * build/render time. No filled panel, no gradient, no invented representation,
 * address or social links. Colours resolve from the semantic tokens, so it
 * adapts to both the paper and soot themes.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/" className="site-footer-name">
            {siteName}
          </Link>
          <p className="site-footer-tag">Selected works, 2019–2022</p>
        </div>

        <nav className="site-footer-nav" aria-label="Footer">
          {footerNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <a href={buildEnquiryHref()}>Enquiries</a>
        </nav>

        <p className="site-footer-legal">
          © {year} {siteName}
        </p>
      </div>
    </footer>
  );
}
