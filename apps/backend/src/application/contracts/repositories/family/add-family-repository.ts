import type { Either, Family } from '@/domain';

export interface AddFamilyRepository {
  add: (family: Family) => Promise<Either<void, void>>;
}
