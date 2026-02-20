import { ProductMapper } from './mappers';
import type {
  ProductRepositories,
  RemoveProductRepositoryParams,
} from '@/application';
import type { Product } from '@/domain';
import { prisma } from '@/main/prisma/client';

export class PrismaProductRepository implements ProductRepositories {
  add = async (product: Product): Promise<void> => {
    await prisma.product.create({
      data: ProductMapper.toCreatePersistence(product),
    });
  };

  update = async (product: Product): Promise<void> => {
    await prisma.product.update({
      where: {
        shoppingEvent: {
          id: product.shoppingEventId,
        },
        id: product.id,
      },
      data: ProductMapper.toUpdatePersistence(product),
    });
  };

  remove = async ({
    shoppingEventId,
    productId,
  }: RemoveProductRepositoryParams): Promise<void> => {
    await prisma.product.delete({
      where: {
        shoppingEvent: {
          id: shoppingEventId,
        },
        id: productId,
      },
    });
  };
}
