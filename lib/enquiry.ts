/**
 * Single source of truth for the enquiry destination and mailto link. Every
 * enquiry surface (caption bars, footer, contact page) resolves the address
 * here so the hard-coded fallback lives in exactly one place.
 *
 * `NEXT_PUBLIC_ENQUIRY_EMAIL` should be set per environment (Netlify). The
 * fallback is only used when the variable is unset. See the Phase 0 risk
 * register — the production address must be confirmed and set in Netlify env.
 */
const DEFAULT_ENQUIRY_EMAIL = "peadarjb@gmail.com";

export function getEnquiryEmail(): string {
  return process.env.NEXT_PUBLIC_ENQUIRY_EMAIL ?? DEFAULT_ENQUIRY_EMAIL;
}

export function buildEnquiryHref(title?: string): string {
  const subject = title ? `Artwork enquiry: ${title}` : "Artwork enquiry";
  return `mailto:${getEnquiryEmail()}?subject=${encodeURIComponent(subject)}`;
}
