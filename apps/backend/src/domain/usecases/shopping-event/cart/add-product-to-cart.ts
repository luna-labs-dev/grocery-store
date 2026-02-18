import type { Either } from '../../../core';
import type { Product } from '../../../entities';
import type { ShoppingEventNotFoundError, UnexpectedError } from '../../errors';

export type AddProductToCartErrors = UnexpectedError &
  ShoppingEventNotFoundError;

export interface AddProductToCartParams {
  user: string;
  familyId: string;
  shoppingEventId: string;
  name: string;
  amount: number;
  wholesaleMinAmount?: number;
  price: number;
  wholesalePrice?: number;
}

export interface AddProductToCart {
  execute: (
    params: AddProductToCartParams,
  ) => Promise<Either<AddProductToCartErrors, Product>>;
}
