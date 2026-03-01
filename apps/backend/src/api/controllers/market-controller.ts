import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { FastifyController } from '../contracts/fastify-controller';
import {
  type GetMarketById,
  type GetMarketList,
  getPossibleExceptionsSchemas,
} from '@/domain';
import { MarketNotFoundException } from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';
import {
  clerkAuthorizationMiddleware,
  familyBarrierMiddleware,
} from '@/main/fastify/middlewares';
import type { FastifyTypedInstance } from '@/main/fastify/types';

const { usecases } = injection;
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
});

export const marketListResponseSchema = z.object({
  total: z.number(),
  items: z.array(marketItemResponseSchema),
});

export const getMarketByIdRequestSchema = z.object({
  marketId: z.uuid(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

@injectable()
export class MarketController extends FastifyController {
  constructor(
    @inject(usecases.getMarketList)
    private readonly getMarketList: GetMarketList,
    @inject(usecases.getMarketById)
    private readonly getMarketById: GetMarketById,
  ) {
    super();
  }

  registerRoutes(app: FastifyTypedInstance): void {
    app.addHook('preHandler', clerkAuthorizationMiddleware);
    app.addHook('preHandler', familyBarrierMiddleware);

    app.get(
      '',
      {
        schema: {
          tags: [this.prefix],
          description: 'List all markets',
          summary: 'Listar mercados',
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

        const market = await this.getMarketList.execute({
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
          items: market.markets.map((mkt) => ({
            id: mkt.id,
            name: mkt.name,
            formattedAddress: mkt.formattedAddress,
            city: mkt.city,
            neighborhood: mkt.neighborhood,
            latitude: mkt.latitude,
            longitude: mkt.longitude,
            distance: mkt.distance,
            createdAt: mkt.createdAt,
          })),
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
          params: getMarketByIdRequestSchema,
          response: {
            ...getPossibleExceptionsSchemas([new MarketNotFoundException()]),
            200: marketItemResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { marketId } = request.params;

        const market = await this.getMarketById.execute({ marketId });

        const response = {
          id: market.id,
          name: market.name,
          formattedAddress: market.formattedAddress,
          city: market.city,
          neighborhood: market.neighborhood,
          latitude: market.latitude,
          longitude: market.longitude,
          distance: market.distance,
          createdAt: market.createdAt,
        };

        reply.status(200).send(response);
      },
    );
  }
}
