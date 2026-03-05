import type { ShoppingEvent, ShoppingEventStatus } from '@/domain';

export interface GetShoppingEventListRepositoryParams {
  status?: ShoppingEventStatus;
  groupId: string;
  period?: {
    start: Date;
    end: Date;
  };
  pageIndex: number;
  pageSize: number;
  orderBy: string;
  orderDirection: 'ASC' | 'DESC';
}

export type CountShoppingEventListRepositoryParams = Pick<
  GetShoppingEventListRepositoryParams,
  'groupId' | 'status' | 'period'
>;

export interface GetShoppingEventListRepository {
  count: (params: CountShoppingEventListRepositoryParams) => Promise<number>;
  getAll: (
    params: GetShoppingEventListRepositoryParams,
  ) => Promise<ShoppingEvent[]>;
}
