import type { Family } from '@/domain';

export interface UpdateFamilyRepository {
  update: (family: Family) => Promise<void>;
}
