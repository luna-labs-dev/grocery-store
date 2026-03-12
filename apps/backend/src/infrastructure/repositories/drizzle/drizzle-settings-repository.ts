import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { db } from './setup/connection';
import { settingsTable } from './setup/schema';
import type { SettingsRepository } from '@/application/contracts/repositories/settings-repository';

@injectable()
export class DrizzleSettingsRepository implements SettingsRepository {
  async getSetting<T>(groupId: string, key: string): Promise<T | undefined> {
    const result = await db
      .select({ value: settingsTable.value })
      .from(settingsTable)
      .where(
        and(eq(settingsTable.groupId, groupId), eq(settingsTable.key, key)),
      )
      .limit(1);

    if (result.length === 0) return undefined;
    return result[0].value as T;
  }

  async setSetting<T>(groupId: string, key: string, value: T): Promise<void> {
    await db
      .insert(settingsTable)
      .values({ groupId, key, value: value as unknown as string }) // Settings values are stored as strings or JSON
      .onConflictDoUpdate({
        target: [settingsTable.groupId, settingsTable.key],
        set: { value: value as unknown as string, updatedAt: new Date() },
      });
  }

  async getAllSettings(groupId: string): Promise<Record<string, unknown>> {
    const results = await db
      .select()
      .from(settingsTable)
      .where(eq(settingsTable.groupId, groupId));
    return results.reduce(
      (acc, row) => {
        acc[row.key] = row.value;
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }
}
