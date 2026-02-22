import type { Market } from '@/domain';

export interface GetMarketListRepositoryParams {
  search?: string;
  location?: {
    latitude: number;
    longitude: number;
  };

  pageIndex: number;
  pageSize: number;
  orderBy: 'createdAt' | 'distance';
  orderDirection: 'desc' | 'asc';
}

export type CountMarketListRepositoryParams = Pick<
  GetMarketListRepositoryParams,
  'search' | 'location'
>;

export interface GetMarketsByProximityRepositoryParams {
  latitude: number;
  longitude: number;
}

export interface GetMarketListRepository {
  count: (params: CountMarketListRepositoryParams) => Promise<number>;
  getAll: (params: GetMarketListRepositoryParams) => Promise<Market[]>;
  getByProximity: (
    params: GetMarketsByProximityRepositoryParams,
  ) => Promise<Market[] | undefined>;
}
