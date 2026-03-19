import { injectable } from 'tsyringe';
import { type DrizzleTransaction, db } from './setup/connection';
import * as schema from './setup/schema';
import type {
  PriceHistoryEntry,
  PriceHistoryRepository,
} from '@/application/contracts/repositories/product-hierarchy/price-history-repository';

@injectable()
export class DrizzlePriceHistoryRepository implements PriceHistoryRepository {
  async add(entry: PriceHistoryEntry, transaction?: unknown): Promise<void> {
    const client = (transaction as DrizzleTransaction) || db;

    await client.insert(schema.priceHistoryTable).values({
      marketId: entry.marketId,
      productIdentityId: entry.productIdentityId,
      price: entry.price,
      verifiedAt: entry.verifiedAt,
      consensusId: entry.consensusId,
    });
  }
}
