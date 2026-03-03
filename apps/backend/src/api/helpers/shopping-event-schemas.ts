import { z } from 'zod';
import { marketItemResponseSchema } from './market-schemas';
import { validShoppingEventStatus } from '@/domain';

export const shoppingEventParamSchema = z.object({
  shoppingEventId: z.uuid(),
});

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

export const shoppingEventSummaryDtoSchema = z.object({
  id: z.uuid(),
  status: z.enum(validShoppingEventStatus),
  market: marketItemResponseSchema,
  totals: z.object({
    retailTotal: z.number(),
    wholesaleTotal: z.number(),
    paidValue: z.number().optional(),
    savingsValue: z.number().optional(),
    savingsPercentage: z.number().optional(),
    retailPaidDifferenceValue: z.number().optional(),
    wholesalePaidDifferenceValue: z.number().optional(),
    totalItemsDistinct: z.number(),
    totalItemsQuantity: z.number(),
    averagePricePerUnit: z.number(),
    highestPrice: z.number(),
    lowestPrice: z.number(),
  }),
  products: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      amount: z.number(),
      price: z.number(),
      wholesaleMinAmount: z.number().optional(),
      wholesalePrice: z.number().optional(),
      totalRetailPrice: z.number(),
      totalWholesalePrice: z.number(),
      totalDifference: z.number().optional(),
      addedAt: z.date(),
    }),
  ),
  elapsedTime: z.number().optional(),
  createdAt: z.date(),
  finishedAt: z.date().optional(),
  createdBy: z.string(),
});

export type ShoppingEventSummaryDto = z.infer<
  typeof shoppingEventSummaryDtoSchema
>;
