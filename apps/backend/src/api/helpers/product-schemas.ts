import { z } from 'zod';

/**
 * Common product item structure used in various responses
 */
export const productItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
});

/**
 * Scan Product
 */
export const scanProductParamsSchema = z.object({
  barcode: z.string().min(1).describe('Product barcode (EAN/UPC)'),
});

export const scanProductResponseSchema = z.object({
  barcode: z.string(),
  matchType: z.enum(['LOCAL', 'EXTERNAL', 'VARIABLE_WEIGHT', 'NOT_FOUND']),
  product: z
    .object({
      id: z.string().optional(),
      name: z.string(),
      brand: z.string().optional().nullable(),
      imageUrl: z.string().url().optional().nullable(),
      canonicalProductId: z.string().optional(),
    })
    .optional(),
  variableWeight: z
    .object({
      productCode: z.string(),
      weight: z.number().optional(),
      price: z.number().optional(),
    })
    .optional(),
});

/**
 * Manual Search
 */
export const manualSearchQuerySchema = z.object({
  q: z.string().min(2).describe('Search query (name or brand)'),
});

export const manualSearchResponseSchema = z.object({
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      brand: z.string().optional().nullable(),
      imageUrl: z.string().url().optional().nullable(),
      canonicalProductId: z.string(),
    }),
  ),
});
