import { inject, injectable } from 'tsyringe';
import { FastifyController } from '../contracts/fastify-controller';
import {
  getMarketByIdQuerystringSchema,
  getMarketByIdRequestSchema,
  getMarketListRequestSchema,
  marketItemResponseSchema,
  marketListResponseSchema,
  marketMapper,
} from '../helpers';
import type { MarketService } from '@/application';
import { getPossibleExceptionsSchemas } from '@/domain';
import { MarketNotFoundException } from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';
import {
  authMiddleware,
  familyBarrierMiddleware,
} from '@/main/fastify/middlewares';
import type { FastifyTypedInstance } from '@/main/fastify/types';

const { usecases } = injection;

@injectable()
export class MarketController extends FastifyController {
  constructor(
    @inject(usecases.marketService)
    private readonly marketService: MarketService,
  ) {
    super();
  }

  registerRoutes(app: FastifyTypedInstance): void {
    app.addHook('preHandler', authMiddleware);
    app.addHook('preHandler', familyBarrierMiddleware);

    app.get(
      '',
      {
        schema: {
          tags: [this.prefix],
          description: 'List all markets',
          summary: 'Listar mercados',
          operationId: 'listMarkets',
          querystring: getMarketListRequestSchema,
          response: {
            ...getPossibleExceptionsSchemas([]),
            200: marketListResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { query } = request;
        const {
          location,
          search,
          pageIndex,
          pageSize,
          orderBy,
          orderDirection,
          expand,
        } = query;

        const market = await this.marketService.getMarketList({
          search,
          pageIndex,
          pageSize,
          orderBy,
          orderDirection,
          location,
          expand,
        });

        const response = {
          total: market.total,
          items: marketMapper.toResponseList(market.markets),
        };

        reply.status(200).send(response);
      },
    );

    app.get(
      '/:marketId',
      {
        schema: {
          tags: [this.prefix],
          description: 'Get market by id',
          summary: 'Obter mercado por id',
          operationId: 'getMarketById',
          params: getMarketByIdRequestSchema,
          querystring: getMarketByIdQuerystringSchema,
          response: {
            ...getPossibleExceptionsSchemas([new MarketNotFoundException()]),
            200: marketItemResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { marketId } = request.params;
        const { location } = request.query;

        const market = await this.marketService.getMarketById({
          marketId,
          location,
        });

        reply.status(200).send(marketMapper.toResponse(market));
      },
    );
  }
}
