"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/** Избранные игры + пользовательские предпочтения (persist в localStorage).
 *  TODO(backend): синхронизировать с таблицей profiles/preferences. */

interface PrefsState {
  favorites: string[];
  recent: string[];
  oddsFormat: "decimal" | "american";
  hideStats: boolean;
  cookieChoice: "accepted" | "essential" | null;
  ageConfirmed: boolean;
  toggleFavorite: (slug: string) => void;
  pushRecent: (slug: string) => void;
  setOddsFormat: (f: "decimal" | "american") => void;
  setHideStats: (v: boolean) => void;
  setCookieChoice: (v: "accepted" | "essential") => void;
  confirmAge: () => void;
}

export const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      favorites: [],
      recent: [],
      oddsFormat: "decimal",
      hideStats: false,
      cookieChoice: null,
      ageConfirmed: false,

      toggleFavorite: (slug) =>
        set((s) => ({
          favorites: s.favorites.includes(slug)
            ? s.favorites.filter((x) => x !== slug)
            : [...s.favorites, slug],
        })),
      pushRecent: (slug) =>
        set((s) => ({
          recent: [slug, ...s.recent.filter((x) => x !== slug)].slice(0, 12),
        })),
      setOddsFormat: (oddsFormat) => set({ oddsFormat }),
      setHideStats: (hideStats) => set({ hideStats }),
      setCookieChoice: (cookieChoice) => set({ cookieChoice }),
      confirmAge: () => set({ ageConfirmed: true }),
    }),
    { name: "cc-prefs", storage: createJSONStorage(() => localStorage) },
  ),
);
