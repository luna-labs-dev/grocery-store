import type { Product } from '@/domain';
import type { RequesterContext } from '@/domain/core/requester-context';
import type { ProductIdentity } from '@/domain/entities/product-identity';

export interface AddProductToCartParams {
  shoppingEventId: string;
  name: string;
  barcode?: string;
  amount: number;

  wholesaleMinAmount?: number;
  price: number;
  wholesalePrice?: number;
}

export interface ManualSearchResponse {
  items: ProductIdentity[];
  total: number;
}

export type ScanMatchType =
  | 'LOCAL'
  | 'EXTERNAL'
  | 'VARIABLE_WEIGHT'
  | 'NOT_FOUND';

export interface ScanProductResult {
  barcode: string;
  matchType: ScanMatchType;
  product?: {
    id?: string;
    name: string;
    brand?: string;
    imageUrl?: string;
    canonicalProductId?: string;
  };
  variableWeight?: {
    productCode: string;
    weight?: number;
    price?: number;
  };
  requiresPriceConfirmation: boolean;
  source: 'local' | 'external' | 'variable-weight' | 'none';
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

export interface ManualSearchRequest {
  query: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface ICartManager {
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
  scanProduct(params: ScanProductRequest): Promise<ScanProductResult>;
}
