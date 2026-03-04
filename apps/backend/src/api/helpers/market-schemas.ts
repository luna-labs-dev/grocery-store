import { z } from 'zod';

export const getMarketListRequestSchema = z.object({
  search: z.string().optional(),
  pageIndex: z.coerce.number().min(0).default(0),
  pageSize: z.coerce.number().min(1).max(50).default(10),
  orderBy: z.enum(['createdAt', 'distance']).default('distance'),
  orderDirection: z.enum(['desc', 'asc']).default('asc'),
  location: z
    .object({
      latitude: z.coerce.number(),
      longitude: z.coerce.number(),
    })
    .optional(),
  expand: z
    .union([z.boolean(), z.string()])
    .transform((val) => val === 'true' || val === true)
    .optional(),
});

export const marketItemResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  formattedAddress: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  distance: z.number().optional(),
  createdAt: z.date(),
  lastUpdatedAt: z.date(),
});

export type MarketDto = z.infer<typeof marketItemResponseSchema>;

export const marketListResponseSchema = z.object({
  total: z.number(),
  items: z.array(marketItemResponseSchema),
});

export const getMarketByIdRequestSchema = z.object({
  marketId: z.uuid(),
});

export const getMarketByIdQuerystringSchema = z.object({
  location: z
    .object({
      latitude: z.coerce.number(),
      longitude: z.coerce.number(),
    })
    .optional(),
});
