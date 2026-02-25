import type { Either } from '../../core';
import type { Market } from '../../entities';
import type { MarketNotFoundError, UnexpectedError } from '../errors';

export type GetMarketByIdErrors = UnexpectedError | MarketNotFoundError;

export interface GetMarketByIdParams {
  marketId: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}
export interface GetMarketById {
  execute: (
    params: GetMarketByIdParams,
  ) => Promise<Either<GetMarketByIdErrors, Market>>;
}
