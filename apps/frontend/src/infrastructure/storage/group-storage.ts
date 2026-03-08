const STORAGE_KEY = 'grocery-store:active-group-id';

export const groupStorage = {
  getActiveGroupId: (): string | null => {
    return localStorage.getItem(STORAGE_KEY);
  },

  setActiveGroupId: (groupId: string): void => {
    localStorage.setItem(STORAGE_KEY, groupId);
    // Explicitly dispatch a storage event for cross-tab or same-tab synchronization if needed
    window.dispatchEvent(new Event('storage'));
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
