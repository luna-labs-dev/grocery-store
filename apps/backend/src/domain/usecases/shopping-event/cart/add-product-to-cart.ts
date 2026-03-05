import type { Product } from '../../../entities';

export interface AddProductToCartParams {
  userId: string;
  groupId: string;
  shoppingEventId: string;
  name: string;
  amount: number;
  wholesaleMinAmount?: number;
  price: number;
  wholesalePrice?: number;
}

export interface AddProductToCart {
  execute(params: AddProductToCartParams): Promise<Product>;
}
