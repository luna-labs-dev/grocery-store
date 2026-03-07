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
import { CollaborationGroup, Market, Product, ShoppingEvent } from '@/domain';
import { Products } from '@/domain/entities/products';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

type ShoppingEventModel = typeof schema.shopping_eventTable.$inferSelect & {
  group?: typeof schema.groupTable.$inferSelect & {
    members: (typeof schema.groupMemberTable.$inferSelect & {
      user: typeof schema.userTable.$inferSelect;
    })[];
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
    groupId,
    status,
    period,
  }: CountShoppingEventListRepositoryParams): Promise<number> => {
    const conditions = [eq(schema.shopping_eventTable.groupId, groupId)];

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
    groupId,
    status,
    period,
    pageIndex,
    pageSize,
    orderBy,
    orderDirection,
  }: GetShoppingEventListRepositoryParams): Promise<ShoppingEvent[]> => {
    const conditions = [eq(schema.shopping_eventTable.groupId, groupId)];

    if (status !== undefined) {
      conditions.push(eq(schema.shopping_eventTable.status, status as any));
    }

    if (period) {
      conditions.push(gte(schema.shopping_eventTable.createdAt, period.start));
      conditions.push(lte(schema.shopping_eventTable.createdAt, period.end));
    }

    const orderFn = orderDirection === 'DESC' ? desc : asc;
    let orderColumn = (schema.shopping_eventTable as any)[orderBy];
    if (!orderColumn && (orderBy as string) === 'market') {
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
        group: {
          with: {
            members: {
              with: { user: true },
            },
          },
        },
      },
    });

    if (shoppingEvents.length === 0) return [];
    return shoppingEvents.map((se) => this.toDomain(se as any));
  };

  getById = async ({
    groupId,
    shoppingEventId,
  }: GetShoppingEventByIdRepositoryProps): Promise<
    ShoppingEvent | undefined
  > => {
    const shoppingEvent = await db.query.shopping_eventTable.findFirst({
      where: and(
        eq(schema.shopping_eventTable.id, shoppingEventId),
        eq(schema.shopping_eventTable.groupId, groupId),
      ),
      with: {
        market: true,
        products: {
          orderBy: [desc(schema.productTable.addedAt)],
        },
        group: {
          with: {
            members: {
              with: { user: true },
            },
          },
        },
      },
    });

    if (!shoppingEvent) return undefined;
    return this.toDomain(shoppingEvent as any);
  };

  add = async (shoppingEvent: ShoppingEvent): Promise<void> => {
    await db.transaction(async (tx) => {
      await tx.insert(schema.shopping_eventTable).values({
        id: shoppingEvent.id,
        groupId: shoppingEvent.groupId,
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

      const products = shoppingEvent.products.getItems();
      if (products.length > 0) {
        await Promise.all(
          products.map((p) => this.productRepository.add(p, tx)),
        );
      }
    });
  };

  update = async (shoppingEvent: ShoppingEvent): Promise<void> => {
    await db.transaction(async (tx) => {
      await tx
        .update(schema.shopping_eventTable)
        .set({
          groupId: shoppingEvent.groupId,
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

      if (newProducts.length > 0) {
        await Promise.all(
          newProducts.map((p) => this.productRepository.add(p, tx)),
        );
      }
      if (updateProducts.length > 0) {
        await Promise.all(
          updateProducts.map((p) => this.productRepository.update(p, tx)),
        );
      }
      if (deleteProducts.length > 0) {
        await Promise.all(
          deleteProducts.map((p) =>
            this.productRepository.remove(
              {
                shoppingEventId: shoppingEvent.id,
                productId: p.id,
              },
              tx,
            ),
          ),
        );
      }
    });
  };

  private toDomain(shoppingEventModel: ShoppingEventModel): ShoppingEvent {
    let group: CollaborationGroup | undefined;
    if (shoppingEventModel.group) {
      group = CollaborationGroup.create(
        {
          name: shoppingEventModel.group.name,
          description: shoppingEventModel.group.description ?? undefined,
          inviteCode: shoppingEventModel.group.inviteCode ?? undefined,
          createdAt: shoppingEventModel.group.createdAt,
          createdBy: shoppingEventModel.group.createdBy,
        },
        shoppingEventModel.group.id,
      );
    }

    return ShoppingEvent.create(
      {
        groupId: shoppingEventModel.groupId!,
        group,
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
                    canonicalProductId: p.canonicalProductId,
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
