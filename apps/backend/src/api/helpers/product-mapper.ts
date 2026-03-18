import type { z } from 'zod';
import type {
  manualSearchResponseSchema,
  productItemSchema,
  scanProductResponseSchema,
} from '@/api/helpers/product-schemas';
import type {
  ManualSearchResponse as DomainSearchResponse,
  ScanProductResult,
} from '@/domain/usecases/cart-manager';

export type ProductItemResponse = z.infer<typeof productItemSchema>;
export type ScanProductResponse = z.infer<typeof scanProductResponseSchema>;
export type ManualSearchResponse = z.infer<typeof manualSearchResponseSchema>;

export const productMapper = {
  toScanResponse: (data: ScanProductResult): ScanProductResponse => ({
    barcode: data.barcode,
    matchType: data.matchType,

    product: data.product
      ? {
          id: data.product.id,
          name: data.product.name,
          brand: data.product.brand ?? null,
          imageUrl: data.product.imageUrl ?? null,
          canonicalProductId: data.product.canonicalProductId,
        }
      : undefined,

    variableWeight: data.variableWeight
      ? {
          productCode: data.variableWeight.productCode,
          weight: data.variableWeight.weight,
          price: data.variableWeight.price,
        }
      : undefined,
  }),

  toSearchResponse: (data: DomainSearchResponse): ManualSearchResponse => ({
    items: data.items.map((p) => ({
      id: p.id,
      name: p.name ?? 'Unknown',
      brand: p.brand ?? null,
      imageUrl: p.imageUrl ?? null,
      canonicalProductId: p.canonicalProductId,
    })),
    total: data.total,
    // Note: total is currently result.items.length in controller, we should probably have a real total
  }),
};
