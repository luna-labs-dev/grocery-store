import { inject, injectable } from 'tsyringe';
import type {
  AddPriceReportRepository,
  GetPriceReportsByProductIdentityRepository,
  GetRegionalAveragePriceRepository,
} from '@/application/contracts/repositories/product-hierarchy';
import { PriceReport } from '@/domain';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class DbPriceConsensusEngine {
  constructor(
    @inject(infra.productIdentityRepositories)
    private readonly priceReportRepository: AddPriceReportRepository &
      GetPriceReportsByProductIdentityRepository &
      GetRegionalAveragePriceRepository,
  ) {}

  async processPriceReport(params: {
    userId: string;
    marketId: string;
    productIdentityId: string;
    price: number;
    reportedAt?: Date;
  }): Promise<void> {
    const {
      userId,
      marketId,
      productIdentityId,
      price,
      reportedAt = new Date(),
    } = params;

    // 1. Regional Outlier Detection (>30%)
    const regionalAverage = await this.priceReportRepository.getRegionalAverage(
      productIdentityId,
      marketId,
    );

    let isOutlier = false;
    if (regionalAverage) {
      const diff = Math.abs(price - regionalAverage) / regionalAverage;
      if (diff > 0.3) {
        isOutlier = true;
      }
    }

    // 2. Persist Report
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

    // 3. Consensus Logic (5-User Rule & 72h Window)
    const recentReports =
      await this.priceReportRepository.getByProductIdentity(productIdentityId);

    const windowLimit = new Date();
    windowLimit.setHours(windowLimit.getHours() - 72);

    const validReports = recentReports.filter(
      (r) =>
        r.marketId === marketId && r.reportedAt >= windowLimit && !r.isOutlier,
    );

    const uniqueUsers = new Set(validReports.map((r) => r.userId));

    if (uniqueUsers.size >= 5) {
      // Logic to update "Golden Price" (MarketProductPrice) would go here
      // For now, we consider it "verified" if size >= 5
    }
  }
}
