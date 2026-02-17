import type { Market } from '@/domain';

export interface GetMarketByCodeRepositoryParams {
  code: string;
}

export interface GetMarketByCodeRepository {
  getByCode: (
    params: GetMarketByCodeRepositoryParams,
  ) => Promise<Market | undefined>;
}
