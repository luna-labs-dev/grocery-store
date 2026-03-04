import { z } from 'zod';

export const cartCommonRequestParamsSchema = z.object({
  shoppingEventId: z.uuid(),
});

export const addProductToCartRequestSchema = z.object({
  name: z.string().min(1),
  amount: z.number().gt(0),
  price: z.number().gt(0),
  wholesaleMinAmount: z.number().gt(0).optional(),
  wholesalePrice: z.number().gt(0).optional(),
});

export const addProductToCartResponseSchema = z.object({
  id: z.uuid(),
  addedAt: z.date(),
});

export const mutateProductInCartRequestParamsSchema =
  cartCommonRequestParamsSchema.extend({
    productId: z.uuid(),
  });

export const updateProductInCartRequestSchema = z.object({
  name: z.string().min(1),
  amount: z.number().gt(0),
  price: z.number().gt(0),
  wholesaleMinAmount: z.number().gt(0).optional(),
  wholesalePrice: z.number().gt(0).optional(),
});
