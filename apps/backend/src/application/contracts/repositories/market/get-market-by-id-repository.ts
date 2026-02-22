import type { Market } from '@/domain';

export interface GetMarketByIdRepositoryParams {
  id: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface GetMarketByIdRepository {
  getById: (
    params: GetMarketByIdRepositoryParams,
  ) => Promise<Market | undefined>;
}
