import type { ShoppingEvent, ShoppingEventStatus } from '../../entities';

export interface GetShoppingEventListParams {
  familyId: string;
  status?: ShoppingEventStatus;
  period?: {
    start: Date;
    end: Date;
  };
  pageIndex: number;
  pageSize: number;
  orderBy: 'createdAt';
  orderDirection: 'desc' | 'asc';
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
