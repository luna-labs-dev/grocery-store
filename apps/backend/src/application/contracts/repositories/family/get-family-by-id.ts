import type { Family } from '@/domain';

export interface GetFamilyByIdRepositoryParams {
  familyId: string;
}

export interface GetFamilyByIdRepository {
  getById: (
    params: GetFamilyByIdRepositoryParams,
  ) => Promise<Family | undefined>;
}
