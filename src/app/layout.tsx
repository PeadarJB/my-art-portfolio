import type { Metadata } from "next";

import { CustomCursor } from "@/components/custom-cursor";
import { siteDescription, siteName, siteTitle, siteUrl } from "@/lib/site";

import "./globals.css";

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

// Runs before paint: repeat visitors get `data-intro-seen` on <html> so the
// homepage intro splash is display:none from the first frame; first-time
// visitors get the session flag set so the splash never replays this session.
const introInitScript = `(function(){try{if(sessionStorage.getItem('pjb-intro-seen')){document.documentElement.setAttribute('data-intro-seen','1')}else{sessionStorage.setItem('pjb-intro-seen','1')}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introInitScript }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
