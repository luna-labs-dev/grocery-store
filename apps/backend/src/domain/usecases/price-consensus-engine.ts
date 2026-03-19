export interface PriceReportDto {
  userId: string;
  marketId: string;
  productIdentityId: string;
  price: number;
}

export interface IPriceConsensusEngine {
  processPriceReport(report: PriceReportDto): Promise<void>;
}
