"use client";

import { useEffect, useState } from "react";

import { useUIStore } from "@/lib/store/ui-store";

export function ThemeToggle() {
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  // The persisted store may resolve to "dark" on the client while the server
  // rendered the default "light". Render the default until mounted so the
  // button's label does not cause a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const effectiveTheme = mounted ? theme : "light";
  const label = effectiveTheme === "dark" ? "Switch to light" : "Switch to dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {effectiveTheme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
