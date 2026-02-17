import type { Either } from '../../core';
import type { ShoppingEvent } from '../../entities';
import type { MarketNotFoundError, UnexpectedError } from '../errors';

export type StartShoppingEventErrors = UnexpectedError & MarketNotFoundError;

export interface StartShoppingEventParams {
  user: string;
  familyId: string;
  marketId: string;
}

export interface StartShoppingEvent {
  execute: (
    params: StartShoppingEventParams,
  ) => Promise<Either<StartShoppingEventErrors, ShoppingEvent>>;
}
