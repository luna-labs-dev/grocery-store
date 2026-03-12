import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { db } from './setup/connection';
import * as schema from './setup/schema';
import type { PhysicalEanRepository } from '@/application/contracts/repositories/physical-ean-repository';
import { PhysicalEAN } from '@/domain';

type Transaction = typeof db;

@injectable()
export class DrizzlePhysicalEanRepository implements PhysicalEanRepository {
  async save(physical: PhysicalEAN, transaction?: Transaction): Promise<void> {
    const client = transaction || db;
    await client
      .insert(schema.physicalEanTable)
      .values({
        barcode: physical.barcode,
        productIdentityId: physical.productIdentityId,
        source: physical.source,
        createdAt: physical.createdAt,
      })
      .onConflictDoUpdate({
        target: schema.physicalEanTable.barcode,
        set: {
          productIdentityId: physical.productIdentityId,
          source: physical.source,
        },
      });
  }

  async findByBarcode(barcode: string): Promise<PhysicalEAN | null> {
    const result = await db
      .select()
      .from(schema.physicalEanTable)
      .where(eq(schema.physicalEanTable.barcode, barcode))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    return PhysicalEAN.create({
      barcode: row.barcode,
      productIdentityId: row.productIdentityId,
      source: row.source,
      createdAt: row.createdAt,
    });
  }
}
