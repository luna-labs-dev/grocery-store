import type { Product } from '../../../entities';

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
  execute(params: UpdateProductInCartParams): Promise<Product>;
}
