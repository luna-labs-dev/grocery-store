import type { Either } from '../../../core';
import type { Product } from '../../../entities';
import type {
  ProductNotFoundError,
  ShoppingEventNotFoundError,
  UnexpectedError,
} from '../../errors';

export type UpdateProductInCartErrors = UnexpectedError &
  ShoppingEventNotFoundError &
  ProductNotFoundError;

export interface UpdateProductInCartParams {
  familyId: string;
  shoppingEventId: string;
  productId: string;
  name: string;
  amount: number;
  wholesaleMinAmount?: number;
  price: number;
  wholesalePrice?: number;
}

export interface UpdateProductInCart {
  execute: (
    params: UpdateProductInCartParams,
  ) => Promise<Either<UpdateProductInCartErrors, Product>>;
}
