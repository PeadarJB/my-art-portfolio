/**
 * Central site identity. `NEXT_PUBLIC_SITE_URL` should be set per environment
 * (Netlify preview subdomain for now, custom domain at launch). The fallback is
 * only used when the variable is unset so builds never crash on a bad URL.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://peadar-jolliffe-byrne.netlify.app";

export const siteName = "Peadar Jolliffe-Byrne";

export const siteTitle = "Peadar Jolliffe-Byrne | Art Portfolio";

export const siteDescription =
  "Colour-driven contemporary painting portfolio with selected works, artist CV, and direct enquiry.";
