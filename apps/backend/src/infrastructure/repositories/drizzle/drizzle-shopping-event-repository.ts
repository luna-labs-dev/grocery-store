import { and, asc, count, desc, eq, gte, lte } from 'drizzle-orm';
import { inject, injectable } from 'tsyringe';
import { db } from './setup/connection';
import * as schema from './setup/schema';
import type {
  CountShoppingEventListRepositoryParams,
  GetShoppingEventByIdRepositoryProps,
  GetShoppingEventListRepositoryParams,
  ProductRepositories,
  ShoppingEventRepositories,
} from '@/application';
import { Family, Market, Product, ShoppingEvent, User } from '@/domain';
import { Products } from '@/domain/entities/products';
import { injection } from '@/main/di/injection-codes';

const { infra } = injection;

type ShoppingEventModel = typeof schema.shopping_eventTable.$inferSelect & {
  family: typeof schema.familyTable.$inferSelect & {
    owner: typeof schema.userTable.$inferSelect;
    members: (typeof schema.userTable.$inferSelect)[];
  };
  market: typeof schema.marketTable.$inferSelect;
  products: (typeof schema.productTable.$inferSelect)[];
};

@injectable()
export class DrizzleShoppingEventRepository
  implements ShoppingEventRepositories
{
  constructor(
    @inject(infra.productRepositories)
    private readonly productRepository: ProductRepositories,
  ) {}

  count = async ({
    familyId,
    status,
    period,
  }: CountShoppingEventListRepositoryParams): Promise<number> => {
    const conditions = [eq(schema.shopping_eventTable.familyId, familyId)];

    if (status !== undefined) {
      conditions.push(eq(schema.shopping_eventTable.status, status as any));
    }

    if (period) {
      conditions.push(gte(schema.shopping_eventTable.createdAt, period.start));
      conditions.push(lte(schema.shopping_eventTable.createdAt, period.end));
    }

    const queryResult = await db
      .select({ value: count() })
      .from(schema.shopping_eventTable)
      .where(and(...conditions));

    return queryResult[0].value;
  };

  getAll = async ({
    familyId,
    status,
    period,
    pageIndex,
    pageSize,
    orderBy,
    orderDirection,
  }: GetShoppingEventListRepositoryParams): Promise<ShoppingEvent[]> => {
    const conditions = [eq(schema.shopping_eventTable.familyId, familyId)];

    if (status !== undefined) {
      conditions.push(eq(schema.shopping_eventTable.status, status as any));
    }

    if (period) {
      conditions.push(gte(schema.shopping_eventTable.createdAt, period.start));
      conditions.push(lte(schema.shopping_eventTable.createdAt, period.end));
    }

    const orderFn = orderDirection === 'desc' ? desc : asc;
    let orderColumn = (schema.shopping_eventTable as any)[orderBy];
    if (!orderColumn && (orderBy as string) === 'market') {
      // if sorting by market, since relationships sorting in query API is limited,
      // we might fallback to createdAt, but for a drop in, let's just do standard mapping
      orderColumn = schema.shopping_eventTable.createdAt;
    }

    const shoppingEvents = await db.query.shopping_eventTable.findMany({
      where: and(...conditions),
      limit: pageSize,
      offset: pageIndex * pageSize,
      orderBy: [orderFn(orderColumn || schema.shopping_eventTable.createdAt)],
      with: {
        market: true,
        products: true,
        family: {
          with: { owner: true, members: true },
        },
      },
    });

    if (shoppingEvents.length === 0) return [];
    return shoppingEvents.map((se) => this.toDomain(se));
  };

  getById = async ({
    familyId,
    shoppingEventId,
  }: GetShoppingEventByIdRepositoryProps): Promise<
    ShoppingEvent | undefined
  > => {
    const shoppingEvent = await db.query.shopping_eventTable.findFirst({
      where: and(
        eq(schema.shopping_eventTable.id, shoppingEventId),
        eq(schema.shopping_eventTable.familyId, familyId),
      ),
      with: {
        market: true,
        products: {
          orderBy: [desc(schema.productTable.addedAt)],
        },
        family: {
          with: { owner: true, members: true },
        },
      },
    });

    if (!shoppingEvent) return undefined;
    return this.toDomain(shoppingEvent);
  };

  add = async (shoppingEvent: ShoppingEvent): Promise<void> => {
    await db.insert(schema.shopping_eventTable).values({
      id: shoppingEvent.id,
      familyId: shoppingEvent.familyId,
      marketId: shoppingEvent.marketId,
      description: shoppingEvent.description ?? null,
      totalPaid: shoppingEvent.totalPaid ?? 0,
      wholesaleTotal: shoppingEvent.wholesaleTotal ?? 0,
      retailTotal: shoppingEvent.retailTotal ?? 0,
      status: shoppingEvent.status as any,
      createdAt: shoppingEvent.createdAt,
      finishedAt: shoppingEvent.finishedAt ?? null,
      createdBy: shoppingEvent.createdBy,
    });
  };

  update = async (shoppingEvent: ShoppingEvent): Promise<void> => {
    await db
      .update(schema.shopping_eventTable)
      .set({
        familyId: shoppingEvent.familyId,
        description: shoppingEvent.description ?? null,
        totalPaid: shoppingEvent.totalPaid ?? 0,
        wholesaleTotal: shoppingEvent.wholesaleTotal ?? 0,
        retailTotal: shoppingEvent.retailTotal ?? 0,
        status: shoppingEvent.status as any,
        elapsedTime: shoppingEvent.elapsedTime ?? null,
        finishedAt: shoppingEvent.finishedAt ?? null,
      })
      .where(
        and(
          eq(schema.shopping_eventTable.id, shoppingEvent.id),
          eq(schema.shopping_eventTable.marketId, shoppingEvent.marketId),
        ),
      );

    const newProducts = shoppingEvent.products.getNewItems();
    const updateProducts = shoppingEvent.products.getUpdatedItems();
    const deleteProducts = shoppingEvent.products.getRemovedItems();

    const promises: any = [];
    if (newProducts.length > 0) {
      promises.push(
        Promise.all(newProducts.map((p) => this.productRepository.add(p))),
      );
    }
    if (updateProducts.length > 0) {
      promises.push(
        Promise.all(
          updateProducts.map((p) => this.productRepository.update(p)),
        ),
      );
    }
    if (deleteProducts.length > 0) {
      promises.push(
        Promise.all(
          deleteProducts.map((p) =>
            this.productRepository.remove({
              shoppingEventId: shoppingEvent.id,
              productId: p.id,
            }),
          ),
        ),
      );
    }

    await Promise.allSettled(promises);
  };

  private toDomain(shoppingEventModel: ShoppingEventModel): ShoppingEvent {
    return ShoppingEvent.create(
      {
        familyId: shoppingEventModel.familyId,
        family: Family.create(
          {
            ownerId: shoppingEventModel.family.ownerId,
            owner: User.create(
              {
                externalId: shoppingEventModel.family.owner.externalId,
                email: shoppingEventModel.family.owner.email,
              },
              shoppingEventModel.family.owner.id,
            ),
            name: shoppingEventModel.family.name,
            createdAt: shoppingEventModel.family.createdAt,
            createdBy: shoppingEventModel.family.createdBy,
            description: shoppingEventModel.family.description ?? undefined,
            inviteCode: shoppingEventModel.family.inviteCode ?? undefined,
            members: shoppingEventModel.family.members
              ? shoppingEventModel.family.members.map((m: any) =>
                  User.create(
                    {
                      externalId: m.externalId,
                      email: m.email,
                    },
                    m.id,
                  ),
                )
              : [],
          },
          shoppingEventModel.family.id,
        ),
        marketId: shoppingEventModel.marketId,
        market: Market.create(
          {
            name: shoppingEventModel.market.name,
            formattedAddress: shoppingEventModel.market.formattedAddress,
            city: shoppingEventModel.market.city,
            neighborhood: shoppingEventModel.market.neighborhood,
            latitude: Number(shoppingEventModel.market.latitude),
            longitude: Number(shoppingEventModel.market.longitude),
            createdAt: shoppingEventModel.market.createdAt,
            lastUpdatedAt: shoppingEventModel.market.lastUpdatedAt,
            locationTypes: shoppingEventModel.market.locationTypes,
          },
          shoppingEventModel.market.id,
        ),
        description: shoppingEventModel.description ?? '',
        totalPaid: Number(shoppingEventModel.totalPaid ?? 0),
        wholesaleTotal: Number(shoppingEventModel.wholesaleTotal ?? 0),
        retailTotal: Number(shoppingEventModel.retailTotal ?? 0),
        status: shoppingEventModel.status as any,
        products: Products.create(
          shoppingEventModel.products
            ? shoppingEventModel.products.map((p: any) =>
                Product.create(
                  {
                    shoppingEventId: shoppingEventModel.id,
                    name: p.name,
                    amount: p.amount,
                    wholesaleMinAmount: p.wholesaleMinAmount ?? undefined,
                    price: Number(p.price),
                    wholesalePrice: p.wholesalePrice
                      ? Number(p.wholesalePrice)
                      : undefined,
                    addedAt: p.addedAt,
                    addedBy: p.addedBy,
                  },
                  p.id,
                ),
              )
            : [],
        ),
        elapsedTime: shoppingEventModel.elapsedTime
          ? Number(shoppingEventModel.elapsedTime)
          : undefined,
        createdAt: shoppingEventModel.createdAt,
        finishedAt: shoppingEventModel.finishedAt ?? undefined,
        createdBy: shoppingEventModel.createdBy,
      },
      shoppingEventModel.id,
    );
  }
}
