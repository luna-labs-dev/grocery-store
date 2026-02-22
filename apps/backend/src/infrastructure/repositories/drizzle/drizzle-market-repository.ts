import {
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  type SQL,
  sql,
} from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { db } from './setup/connection';
import { marketTable } from './setup/schema';
import type {
  AddMarketsRepositoryParams,
  CountMarketListRepositoryParams,
  GetMarketByIdRepositoryParams,
  GetMarketListRepositoryParams,
  GetMarketsByProximityRepositoryParams,
  MarketRepositories,
} from '@/application';
import { Market } from '@/domain';

interface GeographicLocation {
  latitude: number | SQL;
  longitude: number | SQL;
}

interface GeographicLocationQuery extends GeographicLocation {
  radius?: number | SQL;
}

@injectable()
export class DrizzleMarketRepository implements MarketRepositories {
  count = async ({
    search,
    location,
  }: CountMarketListRepositoryParams): Promise<number> => {
    let query = db.select({ value: count() }).from(marketTable);
    if (search) {
      query = query.where(ilike(marketTable.name, `%${search}%`)) as any;
    }

    if (location) {
      query = query.where(this.toGeographicLocationQuery(location)) as any;
    }

    const result = await query;
    return result[0].value;
  };

  getAll = async ({
    search,
    location,
    pageIndex,
    pageSize,
    orderBy,
    orderDirection,
  }: GetMarketListRepositoryParams): Promise<Market[]> => {
    let query = db.select().from(marketTable);
    if (search) {
      query = query.where(ilike(marketTable.name, `%${search}%`)) as any;
    }

    if (location) {
      query = query.where(this.toGeographicLocationQuery(location)) as any;
    }

    query = query.limit(pageSize).offset(pageIndex * pageSize) as any;

    if (orderBy) {
      const orderFn = orderDirection === 'desc' ? desc : asc;
      query = query.orderBy(orderFn((marketTable as any)[orderBy])) as any;
    }

    const markets = await query;
    if (markets.length === 0) return [];

    return markets.map((market) => this.toDomain(market));
  };

  getByProximity = async ({
    latitude,
    longitude,
    radius,
  }: GetMarketsByProximityRepositoryParams): Promise<Market[] | undefined> => {
    const markets = await db.query.marketTable.findMany({
      extras: {
        distance: this.toDistance({ latitude, longitude }),
      },
      where: this.toGeographicLocationQuery({ latitude, longitude, radius }),
    });

    if (markets.length === 0) return [];

    return markets.map((market) => this.toDomain(market));
  };

  getById = async ({
    id,
    location,
  }: GetMarketByIdRepositoryParams): Promise<Market | undefined> => {
    const market = await db.query.marketTable.findFirst({
      where: eq(marketTable.id, id),
      extras: location ? { distance: this.toDistance(location) } : undefined,
    });

    if (!market) return;
    return this.toDomain(market);
  };

  add = async (market: Market): Promise<void> => {
    await db
      .insert(marketTable)
      .values(this.ToInsert(market))
      .onConflictDoUpdate({
        target: marketTable.id,
        set: this.onConflictDoUpdate(market),
      });
  };

  addMany = async ({
    markets,
    latitude,
    longitude,
  }: AddMarketsRepositoryParams): Promise<Market[]> => {
    const marketsResult = await db
      .insert(marketTable)
      .values(this.toInsertMany(markets))
      .onConflictDoUpdate({
        target: marketTable.id,
        set: this.onConflictDoUpdate(),
      })
      .returning({
        ...getTableColumns(marketTable),
        distance: this.toDistance({ latitude, longitude }),
      });

    return marketsResult.map((market) => this.toDomain(market));
  };

  update = async (market: Market): Promise<void> => {
    await db
      .update(marketTable)
      .set({
        name: market.name,
        formattedAddress: market.formattedAddress,
        city: market.city,
        neighborhood: market.neighborhood,
        latitude: market.latitude.toString(),
        longitude: market.longitude.toString(),
        geographicLocation: this.toGeographicLocation(market),
        lastUpdatedAt: market.lastUpdatedAt,
      })
      .where(eq(marketTable.id, market.id));
  };

  private toDomain(
    marketModel: typeof marketTable.$inferSelect & { distance?: number },
  ): Market {
    return Market.create(
      {
        name: marketModel.name,
        formattedAddress: marketModel.formattedAddress,
        city: marketModel.city,
        neighborhood: marketModel.neighborhood,
        latitude: Number(marketModel.latitude),
        longitude: Number(marketModel.longitude),
        geographicLocation: marketModel.geographicLocation,
        locationTypes: marketModel.locationTypes,
        createdAt: marketModel.createdAt,
        lastUpdatedAt: marketModel.lastUpdatedAt,
        distance: marketModel.distance,
      },
      marketModel.id,
    );
  }
  private ToInsert(market: Market) {
    return {
      id: market.id,
      name: market.name,
      formattedAddress: market.formattedAddress,
      city: market.city,
      neighborhood: market.neighborhood,
      latitude: market.latitude.toString(),
      longitude: market.longitude.toString(),
      geographicLocation: this.toGeographicLocation(market),
      locationTypes: market.locationTypes,
      createdAt: market.createdAt,
      lastUpdatedAt: market.lastUpdatedAt,
    };
  }

  private toInsertMany(markets: Market[]) {
    return markets.map((market) => this.ToInsert(market));
  }
  private onConflictDoUpdate(market?: Market) {
    if (market) {
      return {
        name: market.name,
        formattedAddress: market.formattedAddress,
        city: market.city,
        neighborhood: market.neighborhood,
        latitude: market.latitude.toString(),
        longitude: market.longitude.toString(),
        geographicLocation: this.toGeographicLocation(market),
        locationTypes: market.locationTypes,
        lastUpdatedAt: market.lastUpdatedAt,
      };
    }
    return {
      name: sql`EXCLUDED.name`,
      formattedAddress: sql`EXCLUDED."formattedAddress"`,
      city: sql`EXCLUDED.city`,
      neighborhood: sql`EXCLUDED.neighborhood`,
      latitude: sql`EXCLUDED.latitude`,
      longitude: sql`EXCLUDED.longitude`,
      geographicLocation: this.toGeographicLocation({
        latitude: sql`EXCLUDED.latitude`,
        longitude: sql`EXCLUDED.longitude`,
      }),
      locationTypes: sql`EXCLUDED."locationTypes"`,
      lastUpdatedAt: sql`EXCLUDED."lastUpdatedAt"`,
    };
  }

  private toGeographicLocationQuery({
    latitude,
    longitude,
    radius,
  }: GeographicLocationQuery): SQL {
    return sql`ST_DWithin(${marketTable.geographicLocation}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography, ${radius})`;
  }

  private toGeographicLocation({
    latitude,
    longitude,
  }: GeographicLocation): SQL {
    return sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography`;
  }

  private toDistance({
    latitude,
    longitude,
  }: GeographicLocation): SQL.Aliased<number> {
    return sql<number>`ST_Distance(${marketTable.geographicLocation}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography)`.as(
      'distance',
    );
  }
}
