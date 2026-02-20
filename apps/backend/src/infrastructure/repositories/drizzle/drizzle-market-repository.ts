import { asc, count, desc, eq, ilike } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { db } from './setup/connection';
import * as schema from './setup/schema';
import type {
  CountMarketListRepositoryParams,
  GetMarketByCodeRepositoryParams,
  GetMarketByIdRepositoryParams,
  GetMarketListRepositoryParams,
  MarketRepositories,
} from '@/application';
import { Market } from '@/domain';

@injectable()
export class DrizzleMarketRepository implements MarketRepositories {
  count = async ({
    search,
  }: CountMarketListRepositoryParams): Promise<number> => {
    let query = db.select({ value: count() }).from(schema.marketTable);
    if (search) {
      query = query.where(ilike(schema.marketTable.name, `%${search}%`)) as any;
    }

    const result = await query;
    return result[0].value;
  };

  getAll = async ({
    search,
    pageIndex,
    pageSize,
    orderBy,
    orderDirection,
  }: GetMarketListRepositoryParams): Promise<Market[]> => {
    let query = db.select().from(schema.marketTable);
    if (search) {
      query = query.where(ilike(schema.marketTable.name, `%${search}%`)) as any;
    }

    query = query.limit(pageSize).offset(pageIndex * pageSize) as any;

    if (orderBy) {
      const orderFn = orderDirection === 'desc' ? desc : asc;
      query = query.orderBy(
        orderFn((schema.marketTable as any)[orderBy]),
      ) as any;
    }

    const markets = await query;
    if (markets.length === 0) return [];

    return markets.map((market) => this.toDomain(market));
  };

  getById = async ({
    id,
  }: GetMarketByIdRepositoryParams): Promise<Market | undefined> => {
    const market = await db.query.marketTable.findFirst({
      where: eq(schema.marketTable.id, id),
    });

    if (!market) return;
    return this.toDomain(market);
  };

  getByCode = async ({
    code,
  }: GetMarketByCodeRepositoryParams): Promise<Market | undefined> => {
    const market = await db.query.marketTable.findFirst({
      where: eq(schema.marketTable.code, code),
    });

    if (!market) return;
    return this.toDomain(market);
  };

  add = async (market: Market): Promise<void> => {
    await db.insert(schema.marketTable).values({
      id: market.id,
      code: market.code,
      name: market.name,
      createdAt: market.createdAt,
      createdBy: market.createdBy,
    });
  };

  update = async (market: Market): Promise<void> => {
    await db
      .update(schema.marketTable)
      .set({
        code: market.code,
        name: market.name,
      })
      .where(eq(schema.marketTable.id, market.id));
  };

  private toDomain(marketModel: any): Market {
    return Market.create(
      {
        name: marketModel.name,
        code: marketModel.code,
        createdAt: marketModel.createdAt,
        createdBy: marketModel.createdBy,
      },
      marketModel.id,
    );
  }
}
