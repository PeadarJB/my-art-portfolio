import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

type UIState = {
  navOpen: boolean;
  theme: Theme;
  setNavOpen: (next: boolean) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      navOpen: false,
      theme: "light",
      setNavOpen: (next) => set({ navOpen: next }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const current = get().theme;
        set({ theme: current === "light" ? "dark" : "light" });
      },
    }),
    {
      name: "portfolio-ui",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
