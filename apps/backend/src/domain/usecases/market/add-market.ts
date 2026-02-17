import type { Either } from '../../core';
import type { Market } from '../../entities';
import type { MarketAlreadyExistsError, UnexpectedError } from '../errors';

export type AddMarketErrors = UnexpectedError & MarketAlreadyExistsError;

export interface AddMarketParams {
  marketName: string;
  user: string;
}

export interface AddMarket {
  execute: (
    request: AddMarketParams,
  ) => Promise<Either<AddMarketErrors, Market>>;
}
