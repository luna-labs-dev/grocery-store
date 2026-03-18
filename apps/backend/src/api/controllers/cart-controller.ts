import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { FastifyController } from '../contracts/fastify-controller';
import {
  addProductToCartRequestSchema,
  addProductToCartResponseSchema,
  cartCommonRequestParamsSchema,
  manualSearchQuerySchema,
  manualSearchResponseSchema,
  mutateProductInCartRequestParamsSchema,
  productMapper,
  scanProductParamsSchema,
  scanProductResponseSchema,
  updateProductInCartRequestSchema,
} from '../helpers';
import { getPossibleExceptionsSchemas, type ICartManager } from '@/domain';
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
    @inject(usecases.cartManager)
    private readonly cartManager: ICartManager,
  ) {
    super();
  }

  registerRoutes(app: FastifyTypedInstance) {
    app.addHook('preHandler', authMiddleware);
    app.addHook('preHandler', groupBarrierMiddleware);

    app.get(
      '/scan/:barcode',
      {
        schema: {
          tags: [this.prefix],
          summary: 'Escanear produto',
          description: 'Escanear um produto pelo código de barras',
          operationId: 'scanProduct',
          params: scanProductParamsSchema,
          response: {
            200: scanProductResponseSchema,
            ...getPossibleExceptionsSchemas([new ProductNotFoundException()]),
          },
        },
      },
      async (request, reply) => {
        const { barcode } = request.params;

        const result = await this.cartManager.scanProduct({ barcode });
        return reply.send(productMapper.toScanResponse(result));
      },
    );

    app.get(
      '/search',
      {
        schema: {
          tags: [this.prefix],
          summary: 'Pesquisar produtos',
          description: 'Pesquisar produtos pelo nome ou marca',
          operationId: 'searchProduct',
          querystring: manualSearchQuerySchema,
          response: {
            200: manualSearchResponseSchema,
            ...getPossibleExceptionsSchemas([new ProductNotFoundException()]),
          },
        },
      },
      async (request, reply) => {
        const { searchQuery } = request.query;

        const result = await this.cartManager.manualSearch(
          request.requesterContext,
          {
            query: searchQuery,
            pageIndex: 0,
            pageSize: 10,
          },
        );

        return reply.send(productMapper.toSearchResponse(result));
      },
    );

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

        const product = await this.cartManager.addProductToCart(
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

        await this.cartManager.updateProductInCart(requesterContext, {
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

        await this.cartManager.removeProductFromCart(requesterContext, {
          shoppingEventId,
          productId,
        });

        reply.status(204).send();
      },
    );
  }
}
