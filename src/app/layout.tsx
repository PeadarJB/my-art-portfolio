import type { Metadata } from "next";
import { Sora, Spectral } from "next/font/google";

import { ArtworkLightbox } from "@/components/artwork-lightbox";
import { SiteHeader } from "@/components/site-header";
import { ThemeSync } from "@/components/theme-sync";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Peadar Jolliffe-Byrne | Art Portfolio",
    template: "%s | Peadar Jolliffe-Byrne",
  },
  description:
    "Colour-driven contemporary painting portfolio with selected works, artist CV, and direct enquiry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head />
      <body className={`${sora.variable} ${spectral.variable}`}>
        <ThemeSync />
        <SiteHeader />
        <main className="site-shell">{children}</main>
        <ArtworkLightbox />
      </body>
    </html>
  );
}
