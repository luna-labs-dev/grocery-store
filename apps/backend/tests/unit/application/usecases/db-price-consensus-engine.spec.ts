/**
 * CONTEXT_INTELLIGENCE_HEADER: 006-arch-normalization
 *
 * CORE CONSTRAINTS:
 * 1. CLEAN ARCHITECTURE: Every use case MUST implement a domain interface.
 * 2. SYMMETRIC STRUCTURE: Tests MUST match implementation filename and hierarchy.
 * 3. NOMENCLATURE: Use Nature-Role (e.g., DbCartManager). NO "Service" suffix for use cases.
 * 4. TDD STRICTNESS: Code MUST comply with these tests. NEVER modify tests to match code without user consent.
 * 5. ATOMICITY: Tests MUST be granular and cover success, failure, and edge cases.
 *
 * BUSINESS RULES:
 * - Pricing Consensus: 5 unique users, 2% mean-based margin, 72h window, >30% outlier detection.
 * - Storage: Update MarketProductPrice (isVerified: true) AND Append to PriceHistory.
 */

import 'reflect-metadata';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import type { MarketProductPriceRepository } from '@/application/contracts/repositories/product-hierarchy/market-product-price-repository';
import type { PriceHistoryRepository } from '@/application/contracts/repositories/product-hierarchy/price-history-repository';
import type { PriceReportRepository } from '@/application/contracts/repositories/product-hierarchy/price-report-repository';
import { DbPriceConsensusEngine } from '@/application/usecases/db-price-consensus-engine';
import { PriceReport } from '@/domain';

describe('DbPriceConsensusEngine', () => {
  let engine: DbPriceConsensusEngine;

  const mockPriceReportRepo = {
    add: vi.fn(),
    getRegionalAverage: vi.fn(),
    getReportsInWindow: vi.fn(),
    updateIsOutlier: vi.fn(),
  } as unknown as Mocked<PriceReportRepository>;

  const mockMarketPriceRepo = {
    getByMarketAndProduct: vi.fn(),
    save: vi.fn(),
  } as unknown as Mocked<MarketProductPriceRepository>;

  const mockPriceHistoryRepo = {
    add: vi.fn(),
  } as unknown as Mocked<PriceHistoryRepository>;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new DbPriceConsensusEngine(
      mockPriceReportRepo,
      mockMarketPriceRepo,
      mockPriceHistoryRepo,
    );
  });

  const baseParams = {
    userId: 'u1',
    marketId: 'm1',
    productIdentityId: 'p1',
    price: 10.0,
  };

  describe('processPriceReport', () => {
    it('[PR-CONSENSUS-OUTLIER] should flag reports as outliers if >30% different from regional average', async () => {
      mockPriceReportRepo.getRegionalAverage.mockResolvedValue(10.0);

      await engine.processPriceReport({ ...baseParams, price: 15.0 });

      expect(mockPriceReportRepo.add).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({ isOutlier: true }),
        }),
      );
    });

    it('[PR-CONSENSUS-SUCCESS] should reach consensus with 5 unique users within 2% mean-based margin', async () => {
      mockPriceReportRepo.getRegionalAverage.mockResolvedValue(10.0);

      const reports = Array.from({ length: 4 }, (_, i) =>
        PriceReport.create({
          ...baseParams,
          userId: `u${i + 2}`,
          price: 10.0,
          reportedAt: new Date(),
          isOutlier: false,
        }),
      );

      mockPriceReportRepo.getReportsInWindow.mockResolvedValue(reports);

      await engine.processPriceReport(baseParams);

      expect(mockPriceReportRepo.add).toHaveBeenCalled();
      expect(mockMarketPriceRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          isVerified: true,
          price: 10.0,
        }),
        expect.anything(), // Transaction
      );
      expect(mockPriceHistoryRepo.add).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 10.0,
        }),
        expect.anything(), // Transaction
      );
    });

    it('[PR-CONSENSUS-FAIL-THRESHOLD] should NOT reach consensus if fewer than 5 unique users', async () => {
      mockPriceReportRepo.getRegionalAverage.mockResolvedValue(10.0);

      const reports = [
        PriceReport.create({
          ...baseParams,
          userId: 'u2',
          price: 10.0,
          reportedAt: new Date(),
          isOutlier: false,
        }),
      ];

      mockPriceReportRepo.getReportsInWindow.mockResolvedValue(reports);

      await engine.processPriceReport(baseParams);

      expect(mockPriceReportRepo.add).toHaveBeenCalled();
      expect(mockMarketPriceRepo.save).not.toHaveBeenCalled();
      expect(mockPriceHistoryRepo.add).not.toHaveBeenCalled();
    });

    it('[PR-CONSENSUS-FAIL-MARGIN] should NOT reach consensus if reports are outside 2% mean-based margin', async () => {
      mockPriceReportRepo.getRegionalAverage.mockResolvedValue(10.0);

      // Mean of [10, 10, 10, 10, 11] = 10.2
      // 2% of 10.2 = 0.204
      // 11 is > 10.404, so it shouldn't count towards consensus if it's the 5th report?
      // Wait, 10 is within 2% of 10.2. But 11 is NOT.
      const reports = Array.from({ length: 4 }, (_, i) =>
        PriceReport.create({
          ...baseParams,
          userId: `u${i + 2}`,
          price: 10.0,
          reportedAt: new Date(),
          isOutlier: false,
        }),
      );

      mockPriceReportRepo.getReportsInWindow.mockResolvedValue(reports);

      await engine.processPriceReport({ ...baseParams, price: 11.0 });

      expect(mockPriceReportRepo.add).toHaveBeenCalled();
      expect(mockMarketPriceRepo.save).not.toHaveBeenCalled();
    });

    it('[PR-CONSENSUS-WINDOW] should only consider reports within 72h window', async () => {
      // This is handled by mockPriceReportRepo.getReportsInWindow which should be called with 72
      mockPriceReportRepo.getRegionalAverage.mockResolvedValue(10.0);
      mockPriceReportRepo.getReportsInWindow.mockResolvedValue([]);

      await engine.processPriceReport(baseParams);

      expect(mockPriceReportRepo.getReportsInWindow).toHaveBeenCalledWith(
        baseParams.marketId,
        baseParams.productIdentityId,
        72,
      );
    });
  });
});
