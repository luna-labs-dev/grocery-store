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
  items: {
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
  barcode: string;
  matchType: 'LOCAL' | 'EXTERNAL' | 'VARIABLE_WEIGHT' | 'NOT_FOUND';
  product?: {
    id: string;
    name: string;
    brand?: string;
    imageUrl?: string;
    canonicalProductId: string;
  };
  variableWeight?: {
    productCode: string;
    weight: number;
    price: number;
  };
}

export interface ICartService {
  addProductToCart(
    ctx: RequesterContext,
    params: AddProductToCartParams,
  ): Promise<Product>;
  removeProductFromCart(
    ctx: RequesterContext,
    params: RemoveProductFromCartParams,
  ): Promise<void>;
  updateProductInCart(
    ctx: RequesterContext,
    params: UpdateProductInCartParams,
  ): Promise<Product>;
  manualSearch(
    ctx: RequesterContext,
    params: ManualSearchRequest,
  ): Promise<ManualSearchResponse>;
  scanProduct(params: ScanProductRequest): Promise<ScanProductResponse>;
}
