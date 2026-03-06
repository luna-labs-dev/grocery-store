import { inject, injectable } from 'tsyringe';
import type { SettingsRepository } from '@/application/contracts/repositories/settings-repository';
import type { IConfigService } from '@/application/contracts/services/config-service';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class ConfigService implements IConfigService {
  constructor(
    @inject(infra.settingsRepository)
    private readonly settingsRepository: SettingsRepository,
  ) {}

  public async getThreshold(groupId: string, key: string): Promise<number> {
    const dbValue = await this.settingsRepository.getSetting<number>(
      groupId,
      key,
    );
    if (dbValue !== undefined) return dbValue;

    switch (key) {
      case 'MIN_REPUTATION_FOR_VERIFICATION':
        return 50; // Fallback
      default:
        return 0;
    }
  }
}
