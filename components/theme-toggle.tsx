"use client";

import { useMemo } from "react";

import { useUIStore } from "@/lib/store/ui-store";

export function ThemeToggle() {
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  const label = useMemo(() => (theme === "dark" ? "Switch to light" : "Switch to dark"), [theme]);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
