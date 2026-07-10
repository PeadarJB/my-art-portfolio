"use client";

import type { Artwork } from "@/lib/content-schema";
import { useLightboxStore } from "@/lib/store/lightbox-store";

type LightboxTriggerProps = {
  className?: string;
  label?: string;
  items: Artwork[];
  startId: string;
};

export function LightboxTrigger({
  className = "btn btn-secondary",
  label = "Open full view",
  items,
  startId,
}: LightboxTriggerProps) {
  const open = useLightboxStore((state) => state.open);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        open(items, startId);
      }}
    >
      {label}
    </button>
  );
}
