import { and, eq, ilike, or } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { type DrizzleTransaction, db } from './setup/connection';
import * as schema from './setup/schema';
import type { ProductIdentityRepository } from '@/application/contracts/repositories/product-identity-repository';
import { ProductIdentity } from '@/domain';

@injectable()
export class DrizzleProductIdentityRepository
  implements ProductIdentityRepository
{
  add = async (
    productIdentity: ProductIdentity,
    transaction?: unknown,
  ): Promise<void> => {
    const client = (transaction as DrizzleTransaction) || db;

    await client.insert(schema.productIdentityTable).values({
      id: productIdentity.id,
      canonicalProductId: productIdentity.canonicalProductId,
      type: productIdentity.type,
      value: productIdentity.value,
      name: productIdentity.name,
      brand: productIdentity.brand,
      imageUrl: productIdentity.imageUrl,
      source: productIdentity.source,
      createdAt: productIdentity.createdAt,
    });
  };

  save = async (
    productIdentity: ProductIdentity,
    transaction?: unknown,
  ): Promise<void> => {
    const client = (transaction as DrizzleTransaction) || db;

    await client
      .insert(schema.productIdentityTable)
      .values({
        id: productIdentity.id,
        canonicalProductId: productIdentity.canonicalProductId,
        type: productIdentity.type,
        value: productIdentity.value,
        name: productIdentity.name,
        brand: productIdentity.brand,
        imageUrl: productIdentity.imageUrl,
        source: productIdentity.source,
        createdAt: productIdentity.createdAt,
      })
      .onConflictDoUpdate({
        target: [schema.productIdentityTable.id],
        set: {
          name: productIdentity.name,
          brand: productIdentity.brand,
          imageUrl: productIdentity.imageUrl,
          source: productIdentity.source,
        },
      });
  };

  getByValue = async (
    type: string,
    value: string,
  ): Promise<ProductIdentity | undefined> => {
    const result = await db
      .select()
      .from(schema.productIdentityTable)
      .where(
        and(
          eq(schema.productIdentityTable.type, type),
          eq(schema.productIdentityTable.value, value),
        ),
      )
      .limit(1);

    if (result.length === 0) {
      return undefined;
    }

    const row = result[0];
    return ProductIdentity.create(
      {
        canonicalProductId: row.canonicalProductId,
        type: row.type,
        value: row.value,
        name: row.name ?? undefined,
        brand: row.brand ?? undefined,
        imageUrl: row.imageUrl ?? undefined,
        source: row.source,
        createdAt: row.createdAt,
      },
      row.id,
    );
  };

  async getById(id: string): Promise<ProductIdentity | undefined> {
    const result = await db
      .select()
      .from(schema.productIdentityTable)
      .where(eq(schema.productIdentityTable.id, id))
      .limit(1);

    if (result.length === 0) return undefined;

    const row = result[0];
    return ProductIdentity.create(
      {
        canonicalProductId: row.canonicalProductId,
        type: row.type,
        value: row.value,
        name: row.name ?? undefined,
        brand: row.brand ?? undefined,
        imageUrl: row.imageUrl ?? undefined,
        source: row.source,
        createdAt: row.createdAt,
      },
      row.id,
    );
  }

  async search(
    query: string,
    pageIndex: number,
    pageSize: number,
  ): Promise<{ items: ProductIdentity[]; total: number }> {
    const offset = pageIndex * pageSize;

    const [itemsResult, countResult] = await Promise.all([
      db
        .select()
        .from(schema.productIdentityTable)
        .where(
          or(
            ilike(schema.productIdentityTable.name, `%${query}%`),
            ilike(schema.productIdentityTable.brand, `%${query}%`),
          ),
        )
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: schema.productIdentityTable.id })
        .from(schema.productIdentityTable)
        .where(
          or(
            ilike(schema.productIdentityTable.name, `%${query}%`),
            ilike(schema.productIdentityTable.brand, `%${query}%`),
          ),
        ),
    ]);

    const items = itemsResult.map((row) =>
      ProductIdentity.create(
        {
          canonicalProductId: row.canonicalProductId,
          type: row.type,
          value: row.value,
          name: row.name ?? undefined,
          brand: row.brand ?? undefined,
          imageUrl: row.imageUrl ?? undefined,
          source: row.source,
          createdAt: row.createdAt,
        },
        row.id,
      ),
    );

    return {
      items,
      total: parseInt(countResult[0]?.count?.toString() || '0', 10),
    };
  }
}
