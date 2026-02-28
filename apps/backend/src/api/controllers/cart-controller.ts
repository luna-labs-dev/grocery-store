import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { FastifyController } from '../contracts/fastify-controller';
import {
  type AddProductToCart,
  getPossibleExceptionsSchemas,
  type RemoveProductFromCart,
  type UpdateProductInCart,
} from '@/domain';
import {
  ProductNotFoundException,
  ShoppingEventAlreadyEndedException,
  ShoppingEventNotFoundException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';
import type { FastifyTypedInstance } from '@/main/fastify';
import { clerkAuthorizationMiddleware } from '@/main/fastify/middlewares';

const { usecases } = injection;

export const cartCommonRequestParamsSchema = z.object({
  shoppingEventId: z.uuid(),
});

export const addProductToCartRequestSchema = z.object({
  familyId: z.uuid(),
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
  familyId: z.uuid(),
  name: z.string().min(1),
  amount: z.number().gt(0),
  price: z.number().gt(0),
  wholesaleMinAmount: z.number().gt(0).optional(),
  wholesalePrice: z.number().gt(0).optional(),
});

const removeProductFromCartRequestSchema = z.object({
  familyId: z.uuid(),
});

@injectable()
export class CartController extends FastifyController {
  /**
   *
   */
  constructor(
    @inject(usecases.addProductToCart)
    private readonly addProductToCart: AddProductToCart,
    @inject(usecases.updateProductInCart)
    private readonly updateProductInCart: UpdateProductInCart,
    @inject(usecases.removeProductFromCart)
    private readonly removeProductFromCart: RemoveProductFromCart,
  ) {
    super();
  }
  registerRoutes(app: FastifyTypedInstance) {
    app.addHook('preHandler', clerkAuthorizationMiddleware);

    app.post(
      '/add-product/:shoppingEventId',
      {
        schema: {
          tags: [this.prefix],
          description: 'Add a product to the cart',
          params: cartCommonRequestParamsSchema,
          body: addProductToCartRequestSchema,
          response: {
            200: addProductToCartResponseSchema,
            ...getPossibleExceptionsSchemas([
              new ShoppingEventNotFoundException(),
              new ShoppingEventAlreadyEndedException(),
            ]),
          },
        },
      },
      async (request, reply) => {
        const { userId } = request.auth;
        const { shoppingEventId } = request.params;
        const {
          familyId,
          name,
          amount,
          price,
          wholesaleMinAmount,
          wholesalePrice,
        } = request.body;
        const product = await this.addProductToCart.execute({
          userId,
          shoppingEventId,
          familyId,
          name,
          amount,
          price,
          wholesaleMinAmount,
          wholesalePrice,
        });

        reply.status(200).send(product);
      },
    );
    app.put(
      '/:shoppingEventId/update-product/:productId',
      {
        schema: {
          tags: [this.prefix],
          description: 'Update a product in the cart',
          params: mutateProductInCartRequestParamsSchema,
          body: updateProductInCartRequestSchema,
          response: {
            204: z.void().describe('No Content'),
            ...getPossibleExceptionsSchemas([
              new ShoppingEventNotFoundException(),
              new ShoppingEventAlreadyEndedException(),
              new ProductNotFoundException(),
            ]),
          },
        },
      },
      async (request, reply) => {
        const { shoppingEventId } = request.params;
        const { productId } = request.params;
        const {
          familyId,
          name,
          amount,
          price,
          wholesaleMinAmount,
          wholesalePrice,
        } = request.body;

        await this.updateProductInCart.execute({
          shoppingEventId,
          productId,
          familyId,
          name,
          amount,
          price,
          wholesaleMinAmount,
          wholesalePrice,
        });

        reply.status(204).send();
      },
    );
    app.delete(
      '/:shoppingEventId/remove-product/:productId',
      {
        schema: {
          tags: [this.prefix],
          description: 'Remove a product from the cart',
          params: mutateProductInCartRequestParamsSchema,
          body: removeProductFromCartRequestSchema,
          response: {
            204: z.void().describe('No Content'),
            ...getPossibleExceptionsSchemas([
              new ShoppingEventNotFoundException(),
              new ShoppingEventAlreadyEndedException(),
              new ProductNotFoundException(),
            ]),
          },
        },
      },
      async (request, reply) => {
        const { shoppingEventId, productId } = request.params;
        const { familyId } = request.body;

        await this.removeProductFromCart.execute({
          shoppingEventId,
          productId,
          familyId,
        });

        reply.status(204).send();
      },
    );
  }
}
