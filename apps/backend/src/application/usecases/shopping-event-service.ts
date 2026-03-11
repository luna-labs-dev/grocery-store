import { inject, injectable } from 'tsyringe';
import type {
  GetMarketByIdRepository,
  ShoppingEventRepositories,
} from '@/application/contracts';
import { ShoppingEvent, type ShoppingEventStatus } from '@/domain';
import type { RequesterContext } from '@/domain/core/requester-context';
import { Products } from '@/domain/entities/products';
import {
  MarketNotFoundException,
  ShoppingEventAlreadyEndedException,
  ShoppingEventEmptyCartException,
  ShoppingEventNotFoundException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class ShoppingEventService {
  constructor(
    @inject(infra.shoppingEventRepositories)
    private readonly shoppingEventRepository: ShoppingEventRepositories,
    @inject(infra.marketRepositories)
    private readonly marketRepository: GetMarketByIdRepository,
  ) {}

  async startShoppingEvent(
    ctx: RequesterContext,
    { marketId }: { marketId: string },
  ): Promise<ShoppingEvent> {
    await ctx.checkPermission('create', 'shoppingEvent');

    const market = await this.marketRepository.getById({ id: marketId });
    if (!market) throw new MarketNotFoundException();

    const shoppingEvent = ShoppingEvent.create({
      groupId: ctx.group.id,
      marketId,
      market,
      status: 'ongoing',
      createdAt: new Date(),
      createdBy: ctx.user.id,
      products: Products.create([]),
    });

    await this.shoppingEventRepository.add(shoppingEvent);

    return shoppingEvent;
  }

  async endShoppingEvent(
    ctx: RequesterContext,
    {
      shoppingEventId,
      totalPaid,
    }: {
      shoppingEventId: string;
      totalPaid: number;
    },
  ): Promise<ShoppingEvent> {
    await ctx.checkPermission('create', 'shoppingEvent');

    const shoppingEvent = await this.shoppingEventRepository.getById({
      shoppingEventId,
      groupId: ctx.group.id,
    });

    if (!shoppingEvent) throw new ShoppingEventNotFoundException();
    if (shoppingEvent.status !== 'ongoing')
      throw new ShoppingEventAlreadyEndedException();
    if (shoppingEvent.products.getItems().length <= 0)
      throw new ShoppingEventEmptyCartException();

    shoppingEvent.end(totalPaid);

    await this.shoppingEventRepository.update(shoppingEvent);

    return shoppingEvent;
  }

  async getShoppingEventList(
    ctx: RequesterContext,
    params: {
      status?: string;
      period?: { start: Date; end: Date };
      pageIndex?: number;
      pageSize?: number;
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
    },
  ): Promise<{ total: number; shoppingEvents: ShoppingEvent[] }> {
    await ctx.checkPermission('read', 'shoppingEvent');

    const total = await this.shoppingEventRepository.count({
      groupId: ctx.group.id,
      status: params.status as ShoppingEventStatus,
      period: params.period,
    });

    const response = {
      total,
      shoppingEvents: [] as ShoppingEvent[],
    };

    if (total > 0) {
      response.shoppingEvents = await this.shoppingEventRepository.getAll({
        groupId: ctx.group.id,
        status: params.status as ShoppingEventStatus,
        period: params.period,
        pageIndex: params.pageIndex ?? 0,
        pageSize: params.pageSize ?? 10,
        orderBy: params.orderBy ?? 'createdAt',
        orderDirection:
          (params.orderDirection?.toUpperCase() as 'ASC' | 'DESC') ?? 'DESC',
      });
    }

    return response;
  }

  async getShoppingEventById(
    ctx: RequesterContext,
    { shoppingEventId }: { shoppingEventId: string },
  ): Promise<ShoppingEvent> {
    await ctx.checkPermission('read', 'shoppingEvent');

    const shoppingEvent = await this.shoppingEventRepository.getById({
      shoppingEventId,
      groupId: ctx.group.id,
    });

    if (!shoppingEvent) throw new ShoppingEventNotFoundException();

    return shoppingEvent;
  }
}
