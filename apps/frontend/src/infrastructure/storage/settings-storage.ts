const STORAGE_KEY = 'grocery-store:ui-settings';

export interface UISettings {
  hapticsEnabled: boolean;
  animationsEnabled: boolean;
  reducedMotion: boolean;
}

const DEFAULT_SETTINGS: UISettings = {
  hapticsEnabled: true,
  animationsEnabled: true,
  reducedMotion: false,
};

export const settingsStorage = {
  getSettings: (): UISettings => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  setSettings: (settings: Partial<UISettings>): void => {
    const current = settingsStorage.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  },
};
