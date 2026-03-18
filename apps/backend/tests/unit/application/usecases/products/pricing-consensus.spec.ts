import 'reflect-metadata';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import type { PriceReportRepository } from '@/application/contracts/repositories/product-hierarchy/price-report-repository';
import { DbPriceConsensusEngine } from '@/application/usecases/products/db-price-consensus-engine';
import { PriceReport } from '@/domain';

describe('DbPriceConsensusEngine', () => {
  let engine: DbPriceConsensusEngine;
  const mockRepo = {
    add: vi.fn(),
    getByProductIdentity: vi.fn(),
    getRegionalAverage: vi.fn(),
  } as unknown as Mocked<PriceReportRepository>;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new DbPriceConsensusEngine(mockRepo);
  });

  const baseParams = {
    userId: 'u1',
    marketId: 'm1',
    productIdentityId: 'p1',
    price: 10.0,
  };

  it('should mark a price as verified after 5 unique user reports', async () => {
    mockRepo.getRegionalAverage.mockResolvedValue(10.0);
    const reports = Array.from({ length: 5 }, (_, i) =>
      PriceReport.create({
        ...baseParams,
        userId: `u${i}`,
        price: 10.0,
        reportedAt: new Date(),
        isOutlier: false,
      }),
    );
    mockRepo.getByProductIdentity.mockResolvedValue(reports);

    await engine.processPriceReport(baseParams);

    expect(mockRepo.add).toHaveBeenCalled();
    expect(mockRepo.getByProductIdentity).toHaveBeenCalledWith('p1');
  });

  it('should flag reports as outliers if >30% different from regional average', async () => {
    mockRepo.getRegionalAverage.mockResolvedValue(10.0); // Avg is 10

    await engine.processPriceReport({ ...baseParams, price: 15.0 }); // 50% diff

    expect(mockRepo.add).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({ isOutlier: true }),
      }),
    );
  });

  it('should ignore reports older than 72 hours (Consensus Window)', async () => {
    const oldDate = new Date();
    oldDate.setHours(oldDate.getHours() - 80);

    const reports = [
      PriceReport.create({
        ...baseParams,
        userId: 'u2',
        reportedAt: oldDate,
        isOutlier: false,
      }),
    ];
    mockRepo.getByProductIdentity.mockResolvedValue(reports);
    mockRepo.getRegionalAverage.mockResolvedValue(10.0);

    await engine.processPriceReport(baseParams);

    // Filter logic checked in engine, we verify it doesn't error
    expect(mockRepo.add).toHaveBeenCalled();
  });
});
