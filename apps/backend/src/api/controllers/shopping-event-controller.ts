import { inject, injectable } from 'tsyringe';
import { FastifyController } from '../contracts/fastify-controller';
import {
  endShoppingEventRequestSchema,
  getShoppingEventByIdRequestSchema,
  getShoppingEventListRequestSchema,
  getShoppingEventListResponseSchema,
  startShoppingEventRequestSchema,
  startShoppingEventResponseSchema,
} from './helpers';
import {
  type AddProductToCart,
  type EndShoppingEvent,
  type GetShoppingEventById,
  type GetShoppingEventList,
  getPossibleExceptionsSchemas,
  type StartShoppingEvent,
  shoppingEventSummaryDtoSchema,
} from '@/domain';
import {
  MarketNotFoundException,
  ShoppingEventAlreadyEndedException,
  ShoppingEventEmptyCartException,
  ShoppingEventNotFoundException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';
import type { FastifyTypedInstance } from '@/main/fastify';
import {
  clerkAuthorizationMiddleware,
  familyBarrierMiddleware,
} from '@/main/fastify/middlewares';

const { usecases } = injection;

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
    app.addHook('preHandler', familyBarrierMiddleware);

    app.post(
      '/start',
      {
        schema: {
          tags: [this.prefix],
          description: 'Start a shopping event',
          summary: 'Iniciar evento de compras',
          operationId: 'startShoppingEvent',
          body: startShoppingEventRequestSchema,
          response: {
            200: startShoppingEventResponseSchema,
            ...getPossibleExceptionsSchemas([new MarketNotFoundException()]),
          },
        },
      },
      async (request, reply) => {
        const { familyId } = request;
        const { marketId } = request.body;
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
          summary: 'Finalizar evento de compras',
          operationId: 'endShoppingEvent',
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
        const { shoppingEventId, totalPaid } = request.body;
        const { familyId } = request;

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
          summary: 'Listar eventos de compras',
          operationId: 'getShoppingEventList',
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
        const { familyId } = request;
        const { status, period, pageIndex, pageSize, orderBy, orderDirection } =
          request.query;
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
          summary: 'Obter evento de compras por id',
          operationId: 'getShoppingEventById',
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
