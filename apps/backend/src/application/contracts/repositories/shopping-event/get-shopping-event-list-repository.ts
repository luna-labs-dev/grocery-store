import type { ShoppingEvent, ShoppingEventStatus } from '@/domain';

export interface GetShoppingEventListRepositoryParams {
  status?: ShoppingEventStatus;
  familyId: string;
  period?: {
    start: Date;
    end: Date;
  };
  pageIndex: number;
  pageSize: number;
  orderBy: 'createdAt';
  orderDirection: 'desc' | 'asc';
}

export type CountShoppingEventListRepositoryParams = Pick<
  GetShoppingEventListRepositoryParams,
  'familyId' | 'status' | 'period'
>;

export interface GetShoppingEventListRepository {
  count: (params: CountShoppingEventListRepositoryParams) => Promise<number>;
  getAll: (
    params: GetShoppingEventListRepositoryParams,
  ) => Promise<ShoppingEvent[]>;
}
