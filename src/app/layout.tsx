import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";

import { ArtworkLightbox } from "@/components/artwork-lightbox";
import { SiteHeader } from "@/components/site-header";
import { ThemeSync } from "@/components/theme-sync";
import { siteDescription, siteName, siteTitle, siteUrl } from "@/lib/site";

import "./globals.css";

// Editorial display face. Only the roman weights the production interface uses
// are loaded (no italic file) to minimise payload and layout shift.
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-newsreader",
  display: "swap",
});

// Interface / body face for navigation, metadata, controls and utility text.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName }],
  keywords: [
    "Peadar Jolliffe-Byrne",
    "contemporary art",
    "Irish artist",
    "painting",
    "art portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName,
    title: siteTitle,
    description: siteDescription,
    url: "/",
    locale: "en_IE",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

// Applied before paint so a stored dark theme does not flash light on load.
const themeInitScript = `(function(){try{var t='light';var raw=localStorage.getItem('portfolio-ui');if(raw){var s=JSON.parse(raw);if(s&&s.state&&(s.state.theme==='dark'||s.state.theme==='light')){t=s.state.theme;}}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${newsreader.variable} ${manrope.variable}`}>
        <ThemeSync />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="site-shell">
          {children}
        </main>
        <ArtworkLightbox />
      </body>
    </html>
  );
}
