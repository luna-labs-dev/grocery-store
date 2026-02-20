import { inject, injectable } from 'tsyringe';
import { ShoppingEventMapper } from './mappers';
import type {
  CountShoppingEventListRepositoryParams,
  GetShoppingEventByIdRepositoryProps,
  GetShoppingEventListRepositoryParams,
  ProductRepositories,
  ShoppingEventRepositories,
} from '@/application';
import type { ShoppingEvent } from '@/domain';
import { injection } from '@/main/di/injection-codes';
import { prisma } from '@/main/prisma/client';

const { infra } = injection;
@injectable()
export class PrismaShoppingEventRepository
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
    const count = await prisma.shopping_event.count({
      where: {
        familyId,
        status,
        createdAt: period && {
          gte: period.start,
          lte: period.end,
        },
      },
    });

    return count;
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
    const shoppingEvents = await prisma.shopping_event.findMany({
      where: {
        familyId,
        status,
        createdAt: period && {
          gte: period.start,
          lte: period.end,
        },
      },
      skip: pageIndex * pageSize,
      take: pageSize,
      orderBy: {
        [orderBy]: orderDirection,
      },
      include: {
        market: true,
        product: true,
        family: {
          include: {
            owner: true,
            members: true,
          },
        },
      },
    });

    if (shoppingEvents.length === 0) {
      return [];
    }

    return shoppingEvents.map((shoppingEvent) =>
      ShoppingEventMapper.toDomain(shoppingEvent),
    );
  };

  getById = async ({
    familyId,
    shoppingEventId,
  }: GetShoppingEventByIdRepositoryProps): Promise<
    ShoppingEvent | undefined
  > => {
    const shoppingEvent = await prisma.shopping_event.findFirst({
      where: {
        familyId,
        id: shoppingEventId,
      },
      include: {
        market: true,
        product: {
          orderBy: {
            addedAt: 'desc',
          },
        },
        family: {
          include: {
            owner: true,
            members: true,
          },
        },
      },
    });

    if (!shoppingEvent) {
      return undefined;
    }

    return ShoppingEventMapper.toDomain(shoppingEvent);
  };

  add = async (shoppingEvent: ShoppingEvent): Promise<void> => {
    await prisma.shopping_event.create({
      data: ShoppingEventMapper.toCreatePersistence(shoppingEvent),
    });
  };

  update = async (shoppingEvent: ShoppingEvent): Promise<void> => {
    await prisma.shopping_event.update({
      where: {
        id: shoppingEvent.id,
        marketId: shoppingEvent.marketId,
      },
      data: ShoppingEventMapper.toUpdatePersistence(shoppingEvent),
    });

    const newProducts = shoppingEvent.products.getNewItems();
    const updateProducts = shoppingEvent.products.getUpdatedItems();
    const deleteProducts = shoppingEvent.products.getRemovedItems();

    const promisses: any = [];
    if (newProducts.length > 0) {
      const newProductPromisses = newProducts.map(async (prod) => {
        await this.productRepository.add(prod);
      });
      promisses.push(newProductPromisses);
    }

    if (updateProducts.length > 0) {
      const updateProductPromisses = updateProducts.map(async (prod) => {
        await this.productRepository.update(prod);
      });
      promisses.push(updateProductPromisses);
    }

    if (deleteProducts.length > 0) {
      const deleteProductPromisses = deleteProducts.map(async (prod) => {
        await this.productRepository.remove({
          shoppingEventId: shoppingEvent.id,
          productId: prod.id,
        });
      });

      promisses.push(deleteProductPromisses);
    }

    await Promise.allSettled(promisses);
  };
}
