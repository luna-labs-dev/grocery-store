import type { Entity } from '@/domain';

export interface Product extends Entity {
  name: string;
  amount: number;
  wholesaleMinAmount?: number;
  price: number;
  wholesalePrice?: number;
  totalRetailPrice: number;
  totalWholesalePrice?: number;
  totalDifference?: number;
  addedAt: Date;
}

export interface AddProductToCartInputParams
  extends Pick<Product, 'name' | 'amount' | 'price'> {
  wholesaleMinAmount?: number;
  wholesalePrice?: number;
}

export interface AddProductToCartParams {
  shoppingEventId: string;
  params: AddProductToCartInputParams;
}

export interface UpdateProductInCartParams extends AddProductToCartParams {
  productId: string;
}

export interface RemoveProductFromCartParams {
  shoppingEventId: string;
  productId: string;
}

export interface AddProductToCartSuccessResult
  extends Pick<Product, 'id' | 'addedAt'> {}
