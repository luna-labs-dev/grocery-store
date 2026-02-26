import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { FastifyController } from '../contracts/fastify-controller';
import { exceptionResultSchema, type GetMarketList } from '@/domain';
import { injection } from '@/main/di/injection-tokens';
import { clerkAuthorizationMiddleware } from '@/main/fastify/middlewares';
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

export const marketResponseSchema = z.object({
  total: z.number(),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      formattedAddress: z.string(),
      city: z.string(),
      neighborhood: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      distance: z.number().optional(),
      createdAt: z.date(),
    }),
  ),
});

@injectable()
export class MarketController extends FastifyController {
  constructor(
    @inject(usecases.getMarketList)
    private readonly getMarketList: GetMarketList,
  ) {
    super();
  }

  registerRoutes(app: FastifyTypedInstance): void {
    app.get(
      '/markets',
      {
        preHandler: clerkAuthorizationMiddleware,
        schema: {
          tags: ['markets'],
          description: 'List all markets',
          querystring: getMarketListRequestSchema,
          response: {
            200: marketResponseSchema,
            400: exceptionResultSchema.describe('Invalid request'),
            401: exceptionResultSchema.describe('Unauthorized'),
            404: exceptionResultSchema.describe('Not found'),
            409: exceptionResultSchema.describe('Conflict'),
            500: exceptionResultSchema.describe('Internal server error'),
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
  }
}
