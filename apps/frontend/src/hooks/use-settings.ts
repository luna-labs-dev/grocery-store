import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { UISettings } from '@/infrastructure/storage/settings-storage';

interface SettingsState extends UISettings {
  setHapticsEnabled: (enabled: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      hapticsEnabled: true,
      animationsEnabled: true,
      reducedMotion: false,

      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    }),
    {
      name: 'grocery-store:ui-settings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
