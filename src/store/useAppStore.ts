import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DateTime } from 'luxon';

export type Theme = 'light' | 'dark' | 'gold-glass' | 'high-contrast';

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  use24HourFormat: boolean;
  toggleTimeFormat: () => void;
  favorites: string[];
  addFavorite: (tz: string) => void;
  removeFavorite: (tz: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
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
