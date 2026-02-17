import type { Either } from '../../core';
import type { ShoppingEvent, ShoppingEventStatus } from '../../entities';
import type { UnexpectedError } from '../errors';

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

export type GetShoppingEventListErrors = UnexpectedError;

export interface GetShoppingEventListResult {
  total: number;
  shoppingEvents: ShoppingEvent[];
}

export interface GetShoppingEventList {
  execute: (
    params: GetShoppingEventListParams,
  ) => Promise<Either<GetShoppingEventListErrors, GetShoppingEventListResult>>;
}
