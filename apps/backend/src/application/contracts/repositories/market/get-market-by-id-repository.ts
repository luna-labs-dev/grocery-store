import type { Market } from '@/domain';

export interface GetMarketByIdRepositoryParams {
  id: string;
}

export interface GetMarketByIdRepository {
  getById: (
    params: GetMarketByIdRepositoryParams,
  ) => Promise<Market | undefined>;
}
