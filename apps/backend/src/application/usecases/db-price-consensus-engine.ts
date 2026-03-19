import { inject, injectable } from 'tsyringe';
import type { MarketProductPriceRepository } from '@/application/contracts/repositories/product-hierarchy/market-product-price-repository';
import type { PriceHistoryRepository } from '@/application/contracts/repositories/product-hierarchy/price-history-repository';
import type { PriceReportRepository } from '@/application/contracts/repositories/product-hierarchy/price-report-repository';
import { PriceReport } from '@/domain';
import type {
  IPriceConsensusEngine,
  PriceReportDto,
} from '@/domain/usecases/price-consensus-engine';
import { db } from '@/infrastructure/repositories/drizzle/setup/connection';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class DbPriceConsensusEngine implements IPriceConsensusEngine {
  constructor(
    @inject(infra.priceReportRepository)
    private readonly priceReportRepository: PriceReportRepository,
    @inject(infra.marketProductPriceRepository)
    private readonly marketProductPriceRepository: MarketProductPriceRepository,
    @inject(infra.priceHistoryRepository)
    private readonly priceHistoryRepository: PriceHistoryRepository,
  ) {}

  async processPriceReport(params: PriceReportDto): Promise<void> {
    const { userId, marketId, productIdentityId, price } = params;
    const reportedAt = new Date();

    // 1. Regional Outlier Detection (>30%)
    const regionalAverage = await this.priceReportRepository.getRegionalAverage(
      productIdentityId,
      marketId,
    );

    let isOutlier = false;
    if (regionalAverage !== null) {
      const diff = Math.abs(price - regionalAverage) / regionalAverage;
      if (diff > 0.3) {
        isOutlier = true;
      }
    }

    // 2. Persist Report (Always Append)
    const report = PriceReport.create({
      userId,
      marketId,
      productIdentityId,
      price,
      reportedAt,
      isOutlier,
    });

    await this.priceReportRepository.add(report);

    if (isOutlier) return;

    // 3. Consensus Logic (5-User Rule & 72h Window & 2% Margin)
    const recentReports = await this.priceReportRepository.getReportsInWindow(
      marketId,
      productIdentityId,
      72, // 72 hours window
    );

    // Filter only those NOT outlier and unique users (including current report implicitly if already in recentReports or we add it)
    // Actually, getReportsInWindow should include the current report if it was added just now and matches the criteria.
    // If not, we add it to the list for calculation.

    // Check if current report is already in the list
    const allValidReports = [...recentReports];
    if (
      !allValidReports.some((r) => r.userId === userId && r.price === price)
    ) {
      allValidReports.push(report);
    }

    const uniqueUsers = new Set(allValidReports.map((r) => r.userId));

    if (uniqueUsers.size >= 5) {
      const meanPrice =
        allValidReports.reduce((acc, r) => acc + r.price, 0) /
        allValidReports.length;

      const margin = 0.02; // 2%
      const diffFromMean = Math.abs(price - meanPrice) / meanPrice;

      if (diffFromMean <= margin) {
        // 4. Transactional Dual-Storage
        await db.transaction(async (tx) => {
          await this.marketProductPriceRepository.save(
            {
              marketId,
              productIdentityId,
              price,
              lastVerifiedAt: reportedAt,
              isVerified: true,
            },
            tx,
          );

          await this.priceHistoryRepository.add(
            {
              marketId,
              productIdentityId,
              price,
              verifiedAt: reportedAt,
              consensusId: report.id, // Using report ID as consensus ID for tracking
            },
            tx,
          );
        });
      }
    }
  }
}
