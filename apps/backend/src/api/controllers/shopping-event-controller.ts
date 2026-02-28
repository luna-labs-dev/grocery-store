import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { FastifyController } from '../contracts/fastify-controller';
import {
  type AddProductToCart,
  type EndShoppingEvent,
  type GetShoppingEventById,
  type GetShoppingEventList,
  getPossibleExceptionsSchemas,
  type StartShoppingEvent,
  shoppingEventSummaryDtoSchema,
  validShoppingEventStatus,
} from '@/domain';
import {
  MarketNotFoundException,
  ShoppingEventAlreadyEndedException,
  ShoppingEventEmptyCartException,
  ShoppingEventNotFoundException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';
import type { FastifyTypedInstance } from '@/main/fastify';
import { clerkAuthorizationMiddleware } from '@/main/fastify/middlewares';

const { usecases } = injection;
export const startShoppingEventRequestSchema = z.object({
  familyId: z.uuid(),
  marketId: z.string().max(320),
});

export const startShoppingEventResponseSchema = z.object({
  id: z.string(),
  market: z.string().optional(),
  status: z.string(),
  createdAt: z.date(),
});

export const endShoppingEventRequestSchema = z.object({
  shoppingEventId: z.string().uuid(),
  familyId: z.uuid(),
  totalPaid: z.number().min(0),
});

export const getShoppingEventListRequestSchema = z.object({
  familyId: z.string().uuid(),
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

@injectable()
export class ShoppingEventController extends FastifyController {
  constructor(
    @inject(usecases.startShoppingEvent)
    private readonly startShoppingEvent: StartShoppingEvent,
    @inject(usecases.endShoppingEvent)
    private readonly endShoppingEvent: EndShoppingEvent,
    @inject(usecases.getShoppingEventList)
    private readonly getShoppingEventList: GetShoppingEventList,
    @inject(usecases.getShoppingEventById)
    private readonly getShoppingEventById: GetShoppingEventById,
    @inject(usecases.addProductToCart)
    private readonly addProductToCart: AddProductToCart,
  ) {
    super();
  }
  registerRoutes(app: FastifyTypedInstance): void {
    app.addHook('preHandler', clerkAuthorizationMiddleware);

    app.post(
      '/start',
      {
        schema: {
          tags: [this.prefix],
          description: 'Start a shopping event',
          body: startShoppingEventRequestSchema,
          response: {
            200: startShoppingEventResponseSchema,
            ...getPossibleExceptionsSchemas([new MarketNotFoundException()]),
          },
        },
      },
      async (request, reply) => {
        const { familyId, marketId } = request.body;
        const { userId } = request.auth;
        const shoppingEvent = await this.startShoppingEvent.execute({
          userId,
          familyId,
          marketId,
        });

        const response = {
          id: shoppingEvent.id,
          market: shoppingEvent.market?.name,
          status: shoppingEvent.status,
          createdAt: shoppingEvent.createdAt,
        };

        reply.status(200).send(response);
      },
    );

    app.put(
      '/end/:shoppingEventId',
      {
        schema: {
          tags: [this.prefix],
          description: 'End a shopping event',
          body: endShoppingEventRequestSchema,
          response: {
            200: shoppingEventSummaryDtoSchema,
            ...getPossibleExceptionsSchemas([
              new ShoppingEventNotFoundException(),
              new ShoppingEventAlreadyEndedException(),
              new ShoppingEventEmptyCartException(),
            ]),
          },
        },
      },
      async (request, reply) => {
        const { shoppingEventId, familyId, totalPaid } = request.body;

        const shoppingEvent = await this.endShoppingEvent.execute({
          familyId,
          shoppingEventId,
          totalPaid,
        });

        reply.status(200).send(shoppingEvent.toSummaryDto());
      },
    );

    app.get(
      '',
      {
        schema: {
          tags: [this.prefix],
          description: 'Get a list of shopping events',
          querystring: getShoppingEventListRequestSchema,
          response: {
            200: getShoppingEventListResponseSchema,
            ...getPossibleExceptionsSchemas([
              new ShoppingEventNotFoundException(),
              new ShoppingEventAlreadyEndedException(),
              new ShoppingEventEmptyCartException(),
            ]),
          },
        },
      },
      async (request, reply) => {
        const {
          familyId,
          status,
          period,
          pageIndex,
          pageSize,
          orderBy,
          orderDirection,
        } = request.query;
        const shoppingEvents = await this.getShoppingEventList.execute({
          familyId,
          status,
          period: period && {
            start: new Date(period.start),
            end: new Date(period.end),
          },
          pageIndex,
          pageSize,
          orderBy,
          orderDirection,
        });

        const response = {
          total: shoppingEvents.total,
          items: shoppingEvents.shoppingEvents.map((se) => ({
            id: se.id,
            status: se.status,
            market: se.market?.name,
            totals: {
              retailTotal: se.retailTotal,
              wholesaleTotal: se.wholesaleTotal,
              totalItemsDistinct: se.totalItemsDistinct,
              totalItemsQuantity: se.totalItemsQuantity,
              savingsPercentage: se.savingsPercentage,
            },
            createdAt: se.createdAt,
          })),
        };

        reply.status(200).send(response);
      },
    );
    app.get(
      '/:shoppingEventId',
      {
        schema: {
          tags: [this.prefix],
          description: 'Get a shopping event by id',
          params: getShoppingEventByIdRequestSchema,
          response: {
            200: shoppingEventSummaryDtoSchema,
            ...getPossibleExceptionsSchemas([
              new ShoppingEventNotFoundException(),
            ]),
          },
        },
      },
      async (request, reply) => {
        const { shoppingEventId, familyId } = request.params;
        const shoppingEvent = await this.getShoppingEventById.execute({
          familyId,
          shoppingEventId,
        });

        reply.status(200).send(shoppingEvent.toSummaryDto());
      },
    );
  }
}
