import type { Either } from '../../core';
import type { Market } from '../../entities';
import type { UnexpectedError } from '../errors';

export interface GetMarketListParams {
  search?: string;
  pageIndex: number;
  pageSize: number;
  orderBy: 'createdAt';
  orderDirection: 'desc' | 'asc';
}

type GetMarketListPossibleErrors = UnexpectedError;

export interface GetMarketListResult {
  total: number;
  markets: Market[];
}

export interface GetMarketList {
  execute: (
    params: GetMarketListParams,
  ) => Promise<Either<GetMarketListPossibleErrors, GetMarketListResult>>;
}
