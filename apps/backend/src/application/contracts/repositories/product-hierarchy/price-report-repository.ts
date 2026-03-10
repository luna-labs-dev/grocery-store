import type { PriceReport } from '@/domain';

export interface AddPriceReportRepository {
  add(report: PriceReport): Promise<void>;
}

export interface GetPriceReportsByProductIdentityRepository {
  getByProductIdentity(productIdentityId: string): Promise<PriceReport[]>;
}

export interface GetRegionalAveragePriceRepository {
  getRegionalAverage(
    productIdentityId: string,
    marketId: string,
  ): Promise<number | null>;
}

export type PriceReportRepository = AddPriceReportRepository &
  GetPriceReportsByProductIdentityRepository &
  GetRegionalAveragePriceRepository;
