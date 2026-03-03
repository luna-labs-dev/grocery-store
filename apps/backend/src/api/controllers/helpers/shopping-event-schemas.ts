import { z } from 'zod';
import { validShoppingEventStatus } from '@/domain';

export const startShoppingEventRequestSchema = z.object({
  marketId: z.string().max(320),
});

export const startShoppingEventResponseSchema = z.object({
  id: z.string(),
  market: z.string().optional(),
  status: z.string(),
  createdAt: z.date(),
});

export const endShoppingEventRequestSchema = z.object({
  shoppingEventId: z.uuid(),
  totalPaid: z.number().min(0),
});

export const getShoppingEventListRequestSchema = z.object({
  status: z.enum(validShoppingEventStatus).optional(),
  period: z
    .object({
      start: z.iso.datetime({
        offset: true,
      }),
      end: z.iso.datetime({
        offset: true,
      }),
    })
    .optional(),
  pageIndex: z.coerce.number().min(0).default(0),
  pageSize: z.coerce.number().min(1).max(50).default(10),
  orderBy: z.enum(['createdAt']).default('createdAt'),
  orderDirection: z.enum(['desc', 'asc']).default('desc'),
});

export const getShoppingEventListResponseSchema = z.object({
  total: z.number(),
  items: z.array(
    z.object({
      id: z.uuid(),
      status: z.string(),
      market: z.string().optional(),
      totals: z.object({
        retailTotal: z.number().optional(),
        wholesaleTotal: z.number().optional(),
        totalItemsDistinct: z.number().optional(),
        totalItemsQuantity: z.number().optional(),
        savingsPercentage: z.number().optional(),
      }),
      createdAt: z.date(),
    }),
  ),
});

export const getShoppingEventByIdRequestSchema = z.object({
  familyId: z.uuid(),
  shoppingEventId: z.uuid(),
});
