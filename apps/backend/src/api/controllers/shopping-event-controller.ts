import { inject, injectable } from 'tsyringe';
import { FastifyController } from '../contracts/fastify-controller';
import {
  endShoppingEventRequestSchema,
  getShoppingEventListRequestSchema,
  getShoppingEventListResponseSchema,
  shoppingEventMapper,
  shoppingEventParamSchema,
  shoppingEventSummaryDtoSchema,
  startShoppingEventRequestSchema,
  startShoppingEventResponseSchema,
} from '../helpers';
import {
  getPossibleExceptionsSchemas,
  type IShoppingEventManager,
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
  authMiddleware,
  groupBarrierMiddleware,
} from '@/main/fastify/middlewares';

const { usecases } = injection;

@injectable()
export class ShoppingEventController extends FastifyController {
  constructor(
    @inject(usecases.shoppingEventManager)
    private readonly shoppingEventManager: IShoppingEventManager,
  ) {
    super();
  }

  registerRoutes(app: FastifyTypedInstance): void {
    app.addHook('preHandler', authMiddleware);
    app.addHook('preHandler', groupBarrierMiddleware);

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
        const { requesterContext } = request;
        const { marketId } = request.body;
        const shoppingEvent =
          await this.shoppingEventManager.startShoppingEvent(requesterContext, {
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
          params: shoppingEventParamSchema,
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
        const { shoppingEventId } = request.params;
        const { totalPaid } = request.body;
        const { requesterContext } = request;

        const shoppingEvent = await this.shoppingEventManager.endShoppingEvent(
          requesterContext,
          {
            shoppingEventId,
            totalPaid,
          },
        );

        reply.status(200).send(shoppingEventMapper.toSummaryDto(shoppingEvent));
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
        const { requesterContext } = request;
        const { status, period, pageIndex, pageSize, orderBy, orderDirection } =
          request.query;

        const shoppingEvents =
          await this.shoppingEventManager.getShoppingEventList(
            requesterContext,
            {
              status,
              period: period && {
                start: new Date(period.start),
                end: new Date(period.end),
              },
              pageIndex,
              pageSize,
              orderBy,
              orderDirection: orderDirection.toUpperCase() as 'ASC' | 'DESC',
            },
          );

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
          params: shoppingEventParamSchema,
          response: {
            200: shoppingEventSummaryDtoSchema,
            ...getPossibleExceptionsSchemas([
              new ShoppingEventNotFoundException(),
            ]),
          },
        },
      },
      async (request, reply) => {
        const { shoppingEventId } = request.params;
        const { requesterContext } = request;

        const shoppingEvent =
          await this.shoppingEventManager.getShoppingEventById(
            requesterContext,
            {
              shoppingEventId,
            },
          );

        reply.status(200).send(shoppingEventMapper.toSummaryDto(shoppingEvent));
      },
    );
  }
}
