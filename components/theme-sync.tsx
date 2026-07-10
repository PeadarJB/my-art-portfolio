"use client";

import { useEffect } from "react";

import { useUIStore } from "@/lib/store/ui-store";

export function ThemeSync() {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
