import { buildEnquiryHref, getEnquiryEmail } from "@/lib/enquiry";
import { siteName } from "@/lib/site";

type SiteFooterProps = {
  /**
   * The home footer sits under the chapter rows (which carry their own
   * bottom rules) so it has no top rule and slightly deeper padding; every
   * other page draws the hairline above the footer.
   */
  variant?: "default" | "home";
};

export function SiteFooter({ variant = "default" }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const email = getEnquiryEmail();

  return (
    <footer
      className={
        variant === "home" ? "site-footer is-home" : "site-footer has-rule-above"
      }
    >
      <span className="site-footer-copy">
        © {year} {siteName}
      </span>
      <a className="site-footer-enquiries" href={buildEnquiryHref()}>
        Enquiries — {email}
      </a>
    </footer>
  );
}
