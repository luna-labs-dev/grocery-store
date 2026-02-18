import type { Either } from '../../core';
import type { Market } from '../../entities';
import type { MarketNotFoundError, UnexpectedError } from '../errors';

export type UpdateMarketErrors = UnexpectedError & MarketNotFoundError;

export interface UpdateMarketParams {
  name: string;
  marketId: string;
}

export interface UpdateMarket {
  execute: (
    request: UpdateMarketParams,
  ) => Promise<Either<UpdateMarketErrors, Market>>;
}
