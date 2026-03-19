import { and, eq, gt, sql } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { type DrizzleTransaction, db } from './setup/connection';
import * as schema from './setup/schema';
import type { PriceReportRepository } from '@/application/contracts/repositories/product-hierarchy/price-report-repository';
import { PriceReport } from '@/domain';

@injectable()
export class DrizzlePriceReportRepository implements PriceReportRepository {
  async add(report: PriceReport, transaction?: unknown): Promise<void> {
    const client = (transaction as DrizzleTransaction) || db;

    await client.insert(schema.priceReportTable).values({
      id: report.id,
      userId: report.userId,
      marketId: report.marketId,
      productIdentityId: report.productIdentityId,
      price: report.price,
      reportedAt: report.reportedAt,
      isOutlier: report.isOutlier,
    });
  }

  async getByProductIdentity(
    productIdentityId: string,
  ): Promise<PriceReport[]> {
    const results = await db
      .select()
      .from(schema.priceReportTable)
      .where(eq(schema.priceReportTable.productIdentityId, productIdentityId));

    return results.map((row) =>
      PriceReport.create({
        id: row.id,
        userId: row.userId,
        marketId: row.marketId,
        productIdentityId: row.productIdentityId,
        price: row.price,
        reportedAt: row.reportedAt,
        isOutlier: row.isOutlier,
      }),
    );
  }

  async getRegionalAverage(
    productIdentityId: string,
    marketId: string,
  ): Promise<number | null> {
    const result = await db
      .select({
        avgPrice: sql<number>`avg(${schema.priceReportTable.price}::numeric)`,
      })
      .from(schema.priceReportTable)
      .where(
        and(
          eq(schema.priceReportTable.productIdentityId, productIdentityId),
          eq(schema.priceReportTable.marketId, marketId),
          eq(schema.priceReportTable.isOutlier, false),
        ),
      );

    return result[0]?.avgPrice ?? null;
  }

  async getReportsInWindow(
    marketId: string,
    productIdentityId: string,
    windowHours: number,
  ): Promise<PriceReport[]> {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - windowHours);

    const results = await db
      .select()
      .from(schema.priceReportTable)
      .where(
        and(
          eq(schema.priceReportTable.marketId, marketId),
          eq(schema.priceReportTable.productIdentityId, productIdentityId),
          gt(schema.priceReportTable.reportedAt, cutoffDate),
        ),
      );

    return results.map((row) =>
      PriceReport.create({
        id: row.id,
        userId: row.userId,
        marketId: row.marketId,
        productIdentityId: row.productIdentityId,
        price: row.price,
        reportedAt: row.reportedAt,
        isOutlier: row.isOutlier,
      }),
    );
  }

  async updateIsOutlier(id: string, isOutlier: boolean): Promise<void> {
    await db
      .update(schema.priceReportTable)
      .set({ isOutlier })
      .where(eq(schema.priceReportTable.id, id));
  }
}
