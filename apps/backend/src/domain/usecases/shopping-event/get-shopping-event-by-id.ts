import type { Either } from '../../core';
import type { ShoppingEvent } from '../../entities';
import type { ShoppingEventNotFoundError, UnexpectedError } from '../errors';

export type GetShoppingEventByIdErrors =
  | UnexpectedError
  | ShoppingEventNotFoundError;

export interface GetShoppingEventByIdParams {
  familyId: string;
  shoppingEventId: string;
}

export interface GetShoppingEventById {
  execute: (
    params: GetShoppingEventByIdParams,
  ) => Promise<Either<GetShoppingEventByIdErrors, ShoppingEvent>>;
}
