"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

/**
 * Once-per-session intro splash (homepage only). The name animates from wide
 * letter-spacing into place over 1400ms (200ms delay), holds until t=2300ms,
 * fades out over 700ms and unmounts at t=3100ms.
 *
 * Replays are prevented without any flash: the root layout's inline script
 * stamps `data-intro-seen` on <html> before paint for repeat visitors (CSS
 * hides the splash entirely), and this component confirms the same flag on
 * mount so client-side navigations skip the timeline too. Reduced-motion
 * users never see it (CSS + the matchMedia check here).
 */
export function IntroSplash() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const alreadySeen = document.documentElement.hasAttribute("data-intro-seen");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (alreadySeen || reducedMotion) {
      setPhase("done");
      return;
    }

    const outTimer = setTimeout(() => setPhase("out"), 2300);
    const doneTimer = setTimeout(() => {
      // Marks the splash finished for client-side re-navigations to `/`.
      document.documentElement.setAttribute("data-intro-seen", "1");
      setPhase("done");
    }, 3100);

    return () => {
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") {
    return null;
  }

  return (
    <div className={clsx("intro-splash", { "is-out": phase === "out" })} aria-hidden="true">
      <span className="intro-splash-name">Peadar Jolliffe-Byrne</span>
    </div>
  );
}
