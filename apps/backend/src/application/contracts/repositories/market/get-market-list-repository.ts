import type { Market } from '@/domain';

export interface GetMarketListRepositoryParams {
  search?: string;
  pageIndex: number;
  pageSize: number;
  orderBy: 'createdAt';
  orderDirection: 'desc' | 'asc';
}

export type CountMarketListRepositoryParams = Pick<
  GetMarketListRepositoryParams,
  'search'
>;

export interface GetMarketListRepository {
  count: (params: CountMarketListRepositoryParams) => Promise<number>;
  getAll: (params: GetMarketListRepositoryParams) => Promise<Market[]>;
}
