import type { Metadata } from "next";
import { Instrument_Serif, Manrope, Newsreader } from "next/font/google";

import "./design-lab.css";

/**
 * Experimental fonts for the design laboratory ONLY. They are loaded in this
 * nested layout so they never touch the production font setup in
 * src/app/layout.tsx. `display: swap` is preserved per the brief.
 */
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

// The laboratory must never be indexed or appear in search.
export const metadata: Metadata = {
  title: "Design Laboratory (private)",
  robots: { index: false, follow: false },
};

export default function DesignLabLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${newsreader.variable} ${manrope.variable} ${instrumentSerif.variable} design-lab`}
    >
      {children}
    </div>
  );
}
