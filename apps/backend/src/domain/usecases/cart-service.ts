import type { Product } from '@/domain';
import type { RequesterContext } from '@/domain/core/requester-context';

export interface AddProductToCartParams {
  shoppingEventId: string;
  name: string;
  barcode?: string;
  amount: number;

  wholesaleMinAmount?: number;
  price: number;
  wholesalePrice?: number;
}

export interface ManualSearchRequest {
  query: string;
}

export interface ManualSearchResponse {
  products: {
    id: string;
    name: string;
    brand?: string;
    imageUrl?: string;
  }[];
}

export interface RemoveProductFromCartParams {
  shoppingEventId: string;
  productId: string;
}

export interface UpdateProductInCartParams {
  shoppingEventId: string;
  productId: string;
  name?: string;
  amount?: number;
  wholesaleMinAmount?: number;
  price?: number;
  wholesalePrice?: number;
}

export interface ScanProductRequest {
  barcode: string;
}

export interface ScanProductResponse {
  product: {
    id: string;
    name: string;
    brand?: string;
    imageUrl?: string;
    price?: number;
  } | null;
  matchType: 'INTERNAL' | 'EXTERNAL' | 'NONE';
}

export interface ICartService {
  addProductToCart(
    ctx: RequesterContext,
    params: AddProductToCartParams,
  ): Promise<Product>;
  manualSearch(
    ctx: RequesterContext,
    params: ManualSearchRequest,
  ): Promise<ManualSearchResponse>;
  removeProductFromCart(
    ctx: RequesterContext,
    params: RemoveProductFromCartParams,
  ): Promise<void>;
  updateProductInCart(
    ctx: RequesterContext,
    params: UpdateProductInCartParams,
  ): Promise<Product>;
  scanProduct(params: ScanProductRequest): Promise<ScanProductResponse>;
}
