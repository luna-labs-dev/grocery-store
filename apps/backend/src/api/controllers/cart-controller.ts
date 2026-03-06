import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { FastifyController } from '../contracts/fastify-controller';
import {
  addProductToCartRequestSchema,
  addProductToCartResponseSchema,
  cartCommonRequestParamsSchema,
  mutateProductInCartRequestParamsSchema,
  updateProductInCartRequestSchema,
} from '../helpers';
import type { CartService } from '@/application';
import { getPossibleExceptionsSchemas } from '@/domain';
import {
  ProductNotFoundException,
  ShoppingEventAlreadyEndedException,
  ShoppingEventNotFoundException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';
import type { FastifyTypedInstance } from '@/main/fastify';
import {
  authMiddleware,
  groupBarrierMiddleware,
} from '@/main/fastify/middlewares';

const { usecases } = injection;

@injectable()
export class CartController extends FastifyController {
  constructor(
    @inject(usecases.cartService)
    private readonly cartService: CartService,
  ) {
    super();
  }

  registerRoutes(app: FastifyTypedInstance) {
    app.addHook('preHandler', authMiddleware);
    app.addHook('preHandler', groupBarrierMiddleware);

    app.post(
      '/add-product/:shoppingEventId',
      {
        schema: {
          tags: [this.prefix],
          description: 'Add a product to the cart',
          summary: 'Adicionar produto',
          operationId: 'addProductToCart',
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
        const { requesterContext } = request;
        const { shoppingEventId } = request.params;
        const { name, amount, price, wholesaleMinAmount, wholesalePrice } =
          request.body;

        const product = await this.cartService.addProductToCart(
          requesterContext,
          {
            shoppingEventId,
            name,
            amount,
            price,
            wholesaleMinAmount,
            wholesalePrice,
          },
        );

        reply.status(200).send({
          id: product.id,
          addedAt: product.addedAt,
        });
      },
    );

    app.put(
      '/:shoppingEventId/update-product/:productId',
      {
        schema: {
          tags: [this.prefix],
          description: 'Update a product in the cart',
          summary: 'Atualizar produto',
          operationId: 'updateProductInCart',
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
        const { requesterContext } = request;
        const { shoppingEventId, productId } = request.params;
        const { name, amount, price, wholesaleMinAmount, wholesalePrice } =
          request.body;

        await this.cartService.updateProductInCart(requesterContext, {
          shoppingEventId,
          productId,
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
          summary: 'Remover produto',
          operationId: 'removeProductFromCart',
          params: mutateProductInCartRequestParamsSchema,
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
        const { requesterContext } = request;

        await this.cartService.removeProductFromCart(requesterContext, {
          shoppingEventId,
          productId,
        });

        reply.status(204).send();
      },
    );
  }
}
