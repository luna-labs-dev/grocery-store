import type { z } from 'zod';
import type {
  manualSearchResponseSchema,
  productItemSchema,
  scanProductResponseSchema,
} from '@/api/helpers/product-schemas';

export type ProductItemResponse = z.infer<typeof productItemSchema>;
export type ScanProductResponse = z.infer<typeof scanProductResponseSchema>;
export type ManualSearchResponse = z.infer<typeof manualSearchResponseSchema>;

export const productMapper = {
  toScanResponse: (data: ScanProductResponse): ScanProductResponse => ({
    barcode: data.barcode,
    matchType: data.matchType,

    product: data.product
      ? {
          id: data.product.id,
          name: data.product.name,
          brand: data.product.brand ?? null,
          imageUrl: data.product.imageUrl ?? null,
        }
      : undefined,

    variableWeight: data.variableWeight
      ? {
          productCode: 'TODO', // We need to decide where to get this if not in result
          weight: data.variableWeight.weight,
          price: data.variableWeight.price,
        }
      : undefined,
  }),

  toSearchResponse: (data: {
    products: {
      id: string;
      name: string;
      brand?: string;
      imageUrl?: string;
    }[];
    total: number;
    nextPageIndex?: number;
  }): ManualSearchResponse => ({
    items: data.products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand ?? null,
      imageUrl: p.imageUrl ?? null,
      canonicalProductId: p.id, // Assuming ID is canonical or placeholder
    })),
    total: data.total,
    nextPageIndex: data.nextPageIndex,
  }),
};
