import type { Either } from '../../core';
import type { Market } from '../../entities';
import type { MarketListSearchError, UnexpectedError } from '../errors';

export interface GetMarketListParams {
  search?: string;
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  expand?: boolean;
  pageIndex: number;
  pageSize: number;
  orderBy: 'createdAt' | 'distance';
  orderDirection: 'desc' | 'asc';
}

export type GetMarketListPossibleErrors =
  | UnexpectedError
  | MarketListSearchError;

export interface GetMarketListResult {
  total: number;
  markets: Market[];
}

export interface GetMarketList {
  execute: (
    params: GetMarketListParams,
  ) => Promise<Either<GetMarketListPossibleErrors, GetMarketListResult>>;
}
