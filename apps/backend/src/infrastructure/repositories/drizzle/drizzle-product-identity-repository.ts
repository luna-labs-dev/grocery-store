import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { db } from './setup/connection';
import * as schema from './setup/schema';
import type {
  AddProductIdentityRepository,
  GetProductIdentityByValueRepository,
} from '@/application';
import { ProductIdentity } from '@/domain';

@injectable()
export class DrizzleProductIdentityRepository
  implements AddProductIdentityRepository, GetProductIdentityByValueRepository
{
  add = async (
    productIdentity: ProductIdentity,
    transaction?: any,
  ): Promise<void> => {
    const client = transaction || db;
    await client.insert(schema.productIdentityTable).values({
      id: productIdentity.id,
      canonicalProductId: productIdentity.canonicalProductId,
      type: productIdentity.type,
      value: productIdentity.value,
      createdAt: productIdentity.createdAt,
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
        createdAt: row.createdAt,
      },
      row.id,
    );
  };
}
