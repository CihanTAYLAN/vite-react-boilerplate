import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

import { safeStorage } from "@/lib/storage";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const themeStorage: StateStorage = {
  getItem: (name) => safeStorage.getItem(name),
  setItem: (name, value) => {
    safeStorage.setItem(name, value);
  },
  removeItem: (name) => {
    safeStorage.removeItem(name);
  },
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    {
      name: "ui-theme",
      storage: createJSONStorage(() => themeStorage),
    },
  ),
);
