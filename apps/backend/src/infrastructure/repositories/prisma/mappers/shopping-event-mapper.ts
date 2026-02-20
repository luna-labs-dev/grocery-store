import {
  type family,
  type market,
  Prisma,
  type product,
  type shopping_event,
  type user,
} from '@prisma/client';
import { MarketMapper } from './market-mapper';
import { Family, type Market, Product, ShoppingEvent, User } from '@/domain';
import { Products } from '@/domain/entities/products';

type ShoppingEventPersistence = shopping_event & {
  market?: market;
  product?: product[];
  family: family & { owner: user; members: user[] };
};
type ShoppingEventCreatePersistence = Prisma.shopping_eventCreateInput;
type ShoppingEventUpdatePersistence = Prisma.shopping_eventUpdateInput;

export const ShoppingEventMapper = {
  toDomain: (shoppingEvent: ShoppingEventPersistence): ShoppingEvent => {
    return ShoppingEvent.create(
      {
        familyId: shoppingEvent.familyId,
        family: Family.create(
          {
            ownerId: shoppingEvent.family.ownerId,
            owner: User.create(
              {
                externalId: shoppingEvent.family.owner.externalId,
                email: shoppingEvent.family.owner.email,
              },
              shoppingEvent.family.owner.id,
            ),
            name: shoppingEvent.family.name,
            createdAt: shoppingEvent.family.createdAt,
            createdBy: shoppingEvent.family.createdBy,
            description: shoppingEvent.family.description ?? undefined,
            inviteCode: shoppingEvent.family.inviteCode ?? undefined,
            members: shoppingEvent.family.members
              ? shoppingEvent.family.members.map((member) =>
                  User.create(
                    {
                      externalId: member.externalId,
                      email: member.email,
                    },
                    member.id,
                  ),
                )
              : [],
          },
          shoppingEvent.family.id,
        ),
        marketId: shoppingEvent.marketId,
        market: MarketMapper.toDomain(shoppingEvent.market as Market),
        description: shoppingEvent.description ?? '',
        totalPaid: Number(shoppingEvent.totalPaid ?? 0),
        wholesaleTotal: Number(shoppingEvent.wholesaleTotal ?? 0),
        retailTotal: Number(shoppingEvent.retailTotal ?? 0),
        status: shoppingEvent.status,
        products: Products.create(
          shoppingEvent.product
            ? shoppingEvent.product?.map((prod) =>
                Product.create(
                  {
                    shoppingEventId: shoppingEvent.id,
                    name: prod.name,
                    amount: prod.amount,
                    wholesaleMinAmount: prod.wholesaleMinAmount ?? undefined,
                    price: Number(prod.price),
                    wholesalePrice: prod.wholesalePrice
                      ? Number(prod.wholesalePrice)
                      : undefined,
                    addedAt: prod.addedAt,
                    addedBy: prod.addedBy,
                  },
                  prod.id,
                ),
              )
            : [],
        ),
        elapsedTime: shoppingEvent.elapsedTime
          ? Number(shoppingEvent.elapsedTime)
          : undefined,
        createdAt: shoppingEvent.createdAt,
        finishedAt: shoppingEvent.finishedAt ?? undefined,
        createdBy: shoppingEvent.createdBy,
      },
      shoppingEvent.id,
    );
  },

  toCreatePersistence: (
    shoppingEvent: ShoppingEvent,
  ): ShoppingEventCreatePersistence => {
    const persistence: ShoppingEventCreatePersistence = {
      id: shoppingEvent.id,
      market: {
        connect: {
          id: shoppingEvent.marketId,
        },
      },
      family: {
        connect: {
          id: shoppingEvent.familyId,
        },
      },
      description: shoppingEvent.description ?? null,
      totalPaid: new Prisma.Decimal(shoppingEvent.totalPaid ?? 0),
      wholesaleTotal: new Prisma.Decimal(shoppingEvent.wholesaleTotal ?? 0),
      retailTotal: new Prisma.Decimal(shoppingEvent.retailTotal ?? 0),
      status: shoppingEvent.status,
      createdAt: shoppingEvent.createdAt,
      finishedAt: shoppingEvent.finishedAt ?? null,
      createdBy: shoppingEvent.createdBy,
    };
    return persistence;
  },

  toUpdatePersistence: (
    shoppingEvent: ShoppingEvent,
  ): ShoppingEventUpdatePersistence => {
    const persistence: ShoppingEventUpdatePersistence = {
      family: {
        connect: {
          id: shoppingEvent.familyId,
        },
      },
      description: shoppingEvent.description ?? null,
      totalPaid: new Prisma.Decimal(shoppingEvent.totalPaid ?? 0),
      wholesaleTotal: new Prisma.Decimal(shoppingEvent.wholesaleTotal ?? 0),
      retailTotal: new Prisma.Decimal(shoppingEvent.retailTotal ?? 0),
      status: shoppingEvent.status,
      elapsedTime: shoppingEvent.elapsedTime ?? null,
      finishedAt: shoppingEvent.finishedAt ?? null,
    };
    return persistence;
  },
};
