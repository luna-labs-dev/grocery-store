import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { db } from './setup/connection';
import * as schema from './setup/schema';
import type {
  ProductRepositories,
  RemoveProductRepositoryParams,
} from '@/application';
import type { Product } from '@/domain';

@injectable()
export class DrizzleProductRepository implements ProductRepositories {
  add = async (product: Product): Promise<void> => {
    await db.insert(schema.productTable).values({
      id: product.id,
      shoppingEventId: product.shoppingEventId,
      name: product.name,
      amount: product.amount,
      price: product.price,
      wholesaleMinAmount: product.wholesaleMinAmount ?? null,
      wholesalePrice: product.wholesalePrice ?? null,
      addedAt: product.addedAt,
      addedBy: product.addedBy,
    });
  };

  update = async (product: Product): Promise<void> => {
    await db
      .update(schema.productTable)
      .set({
        name: product.name,
        amount: product.amount,
        price: product.price,
        wholesaleMinAmount: product.wholesaleMinAmount ?? null,
        wholesalePrice: product.wholesalePrice ?? null,
      })
      .where(
        and(
          eq(schema.productTable.id, product.id),
          eq(schema.productTable.shoppingEventId, product.shoppingEventId),
        ),
      );
  };

  remove = async ({
    shoppingEventId,
    productId,
  }: RemoveProductRepositoryParams): Promise<void> => {
    await db
      .delete(schema.productTable)
      .where(
        and(
          eq(schema.productTable.id, productId),
          eq(schema.productTable.shoppingEventId, shoppingEventId),
        ),
      );
  };
}
