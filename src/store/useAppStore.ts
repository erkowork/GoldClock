import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DateTime } from 'luxon';

export type Theme = 'light' | 'dark' | 'gold-glass' | 'midnight-neon' | 'rose-quartz' | 'emerald-forest' | 'editorial-serif' | 'high-contrast';
export type Language = 'de' | 'en';

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  use24HourFormat: boolean;
  toggleTimeFormat: () => void;
  favorites: string[];
  addFavorite: (tz: string) => void;
  removeFavorite: (tz: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'gold-glass',
      setTheme: (theme) => set({ theme }),
      language: 'de',
      setLanguage: (language) => set({ language }),
      use24HourFormat: true,
      toggleTimeFormat: () => set((state) => ({ use24HourFormat: !state.use24HourFormat })),
      favorites: ['America/New_York', 'Asia/Tokyo', 'Australia/Sydney'],
      addFavorite: (tz) => set((state) => ({ 
        favorites: state.favorites.includes(tz) ? state.favorites : [...state.favorites, tz] 
      })),
      removeFavorite: (tz) => set((state) => ({ 
        favorites: state.favorites.filter((f) => f !== tz) 
      })),
    }),
    {
      name: 'goldclock-storage',
    }
  )
);
