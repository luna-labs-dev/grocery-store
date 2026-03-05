import type { ShoppingEvent, ShoppingEventStatus } from '../../entities';

export interface GetShoppingEventListParams {
  groupId: string;
  status?: ShoppingEventStatus;
  period?: {
    start: Date;
    end: Date;
  };
  pageIndex: number;
  pageSize: number;
  orderBy: string;
  orderDirection: 'ASC' | 'DESC';
}

export interface GetShoppingEventListResult {
  total: number;
  shoppingEvents: ShoppingEvent[];
}

export interface GetShoppingEventList {
  execute(
    params: GetShoppingEventListParams,
  ): Promise<GetShoppingEventListResult>;
}
