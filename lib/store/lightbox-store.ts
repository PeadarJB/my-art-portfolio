import { create } from "zustand";

import type { Artwork } from "@/lib/content-schema";

type LightboxState = {
  activeIndex: number;
  isOpen: boolean;
  items: Artwork[];
  open: (items: Artwork[], startId: string) => void;
  close: () => void;
  next: () => void;
  previous: () => void;
  setIndex: (index: number) => void;
};

export const useLightboxStore = create<LightboxState>()((set, get) => ({
  activeIndex: 0,
  isOpen: false,
  items: [],
  open: (items, startId) => {
    const startIndex = Math.max(
      0,
      items.findIndex((item) => item.id === startId)
    );
    set({ items, activeIndex: startIndex, isOpen: items.length > 0 });
  },
  close: () => set({ isOpen: false, items: [], activeIndex: 0 }),
  next: () => {
    const { items, activeIndex } = get();
    if (items.length === 0) {
      return;
    }
    const nextIndex = (activeIndex + 1) % items.length;
    set({ activeIndex: nextIndex });
  },
  previous: () => {
    const { items, activeIndex } = get();
    if (items.length === 0) {
      return;
    }
    const nextIndex = (activeIndex - 1 + items.length) % items.length;
    set({ activeIndex: nextIndex });
  },
  setIndex: (index) => {
    const { items } = get();
    if (items.length === 0) {
      return;
    }
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    set({ activeIndex: clamped });
  },
}));
