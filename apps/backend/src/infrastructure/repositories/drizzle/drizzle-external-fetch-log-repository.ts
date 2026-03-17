import { injectable } from 'tsyringe';
import { db } from './setup/connection';
import * as schema from './setup/schema';
import type { ProductRepository } from '@/application/contracts/repositories/product-repository';
import type { ExternalFetchLog } from '@/domain';

@injectable()
export class DrizzleExternalFetchLogRepository implements ProductRepository {
  saveFetchLog = async (
    log: ExternalFetchLog,
    transaction?: unknown,
  ): Promise<void> => {
    // biome-ignore lint/suspicious/noExplicitAny: Drizzle internal type complexity
    const client = (transaction as any) || db; // Drizzle internal type complexity
    await client.insert(schema.externalFetchLogTable).values({
      id: log.id,
      barcode: log.barcode,
      source: log.source,
      status: log.status,
      durationMs: log.durationMs,
      responsePayload: log.responsePayload,
      createdAt: log.createdAt,
    });
  };
}
