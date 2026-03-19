import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { type DrizzleTransaction, db } from './setup/connection';
import * as schema from './setup/schema';
import type {
  MarketProductPrice,
  MarketProductPriceRepository,
} from '@/application/contracts/repositories/product-hierarchy/market-product-price-repository';

@injectable()
export class DrizzleMarketProductPriceRepository
  implements MarketProductPriceRepository
{
  async getByMarketAndProduct(
    marketId: string,
    productIdentityId: string,
  ): Promise<MarketProductPrice | null> {
    const results = await db
      .select()
      .from(schema.marketProductPriceTable)
      .where(
        and(
          eq(schema.marketProductPriceTable.marketId, marketId),
          eq(
            schema.marketProductPriceTable.productIdentityId,
            productIdentityId,
          ),
        ),
      );

    if (results.length === 0) return null;

    const row = results[0];
    return {
      marketId: row.marketId,
      productIdentityId: row.productIdentityId,
      price: row.price,
      lastVerifiedAt: row.lastVerifiedAt,
      isVerified: row.isVerified,
    };
  }

  async save(data: MarketProductPrice, transaction?: unknown): Promise<void> {
    const client = (transaction as DrizzleTransaction) || db;

    await client
      .insert(schema.marketProductPriceTable)
      .values({
        marketId: data.marketId,
        productIdentityId: data.productIdentityId,
        price: data.price,
        lastVerifiedAt: data.lastVerifiedAt,
        isVerified: data.isVerified,
      })
      .onConflictDoUpdate({
        target: [
          schema.marketProductPriceTable.marketId,
          schema.marketProductPriceTable.productIdentityId,
        ],
        set: {
          price: data.price,
          lastVerifiedAt: data.lastVerifiedAt,
          isVerified: data.isVerified,
        },
      });
  }
}
