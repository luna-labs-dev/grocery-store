export interface SettingsRepository {
  getSetting<T>(groupId: string, key: string): Promise<T | undefined>;
  setSetting<T>(groupId: string, key: string, value: T): Promise<void>;
  getAllSettings(groupId: string): Promise<Record<string, any>>;
}
