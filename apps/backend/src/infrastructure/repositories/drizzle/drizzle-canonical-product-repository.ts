import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { db } from './setup/connection';
import * as schema from './setup/schema';
import type {
  AddCanonicalProductRepository,
  GetCanonicalProductByIdRepository,
  UpdateCanonicalProductRepository,
} from '@/application';
import { CanonicalProduct } from '@/domain';

@injectable()
export class DrizzleCanonicalProductRepository
  implements
    AddCanonicalProductRepository,
    GetCanonicalProductByIdRepository,
    UpdateCanonicalProductRepository
{
  add = async (
    canonicalProduct: CanonicalProduct,
    transaction?: any,
  ): Promise<void> => {
    const client = transaction || db;
    await client.insert(schema.canonicalProductTable).values({
      id: canonicalProduct.id,
      name: canonicalProduct.name,
      brand: canonicalProduct.brand ?? null,
      description: canonicalProduct.description ?? null,
      createdAt: canonicalProduct.createdAt,
      updatedAt: canonicalProduct.updatedAt,
    });
  };

  getById = async (id: string): Promise<CanonicalProduct | undefined> => {
    const result = await db
      .select()
      .from(schema.canonicalProductTable)
      .where(eq(schema.canonicalProductTable.id, id))
      .limit(1);

    if (result.length === 0) {
      return undefined;
    }

    const row = result[0];
    return CanonicalProduct.create(
      {
        name: row.name,
        brand: row.brand ?? undefined,
        description: row.description ?? undefined,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id,
    );
  };

  update = async (
    canonicalProduct: CanonicalProduct,
    transaction?: any,
  ): Promise<void> => {
    const client = transaction || db;
    await client
      .update(schema.canonicalProductTable)
      .set({
        name: canonicalProduct.name,
        brand: canonicalProduct.brand,
        description: canonicalProduct.description,
        updatedAt: new Date(),
      })
      .where(eq(schema.canonicalProductTable.id, canonicalProduct.id));
  };
}
