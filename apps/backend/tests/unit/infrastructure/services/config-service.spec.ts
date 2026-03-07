import 'reflect-metadata';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import type { SettingsRepository } from '@/application/contracts/repositories/settings-repository';
import { ConfigService } from '@/infrastructure/services/config-service';

describe('ConfigService', () => {
  let configService: ConfigService;
  let settingsRepository: Mocked<SettingsRepository>;

  beforeEach(() => {
    settingsRepository = {
      getSetting: vi.fn(),
      setSetting: vi.fn(),
      getAllSettings: vi.fn(),
    } as any;
    configService = new ConfigService(settingsRepository);
  });

  const groupId = 'group-1';

  it('should return value from repository when available', async () => {
    settingsRepository.getSetting.mockResolvedValue(100);
    const result = await configService.getThreshold(
      groupId,
      'MIN_REPUTATION_FOR_VERIFICATION',
    );
    expect(result).toBe(100);
    expect(settingsRepository.getSetting).toHaveBeenCalledWith(
      groupId,
      'MIN_REPUTATION_FOR_VERIFICATION',
    );
  });

  it('should return fallback value when repository returns undefined', async () => {
    settingsRepository.getSetting.mockResolvedValue(undefined);
    const result = await configService.getThreshold(
      groupId,
      'MIN_REPUTATION_FOR_VERIFICATION',
    );
    expect(result).toBe(50);
  });

  it('should return 0 for unknown threshold key', async () => {
    settingsRepository.getSetting.mockResolvedValue(undefined);
    const result = await configService.getThreshold(groupId, 'UNKNOWN_KEY');
    expect(result).toBe(0);
  });
});
