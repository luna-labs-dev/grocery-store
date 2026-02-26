import type { Family } from '@/domain';

export interface AddFamilyRepository {
  add: (family: Family) => Promise<void>;
}
