import 'reflect-metadata';
import { describe, expect, it, vi, beforeEach, type Mocked } from 'vitest';
import { container } from 'tsyringe';
import { MarketController } from '@/api/controllers/market-controller';
import { MarketService } from '@/application/usecases/market-service';
import type { FastifyRequest, FastifyReply } from 'fastify';

vi.mock('@/application/usecases/market-service');

describe('MarketController Integration', () => {
  let marketController: MarketController;
  let marketService: Mocked<MarketService>;

  beforeEach(() => {
    vi.clearAllMocks();
    marketService = new MarketService(null as any, null as any) as any;
    container.registerInstance('MarketService', marketService);
    marketController = new MarketController(marketService);
  });

  const mockMarket = {
    id: 'market-1',
    name: 'Test Market',
    formattedAddress: '123 Street',
    city: 'City',
    neighborhood: 'Neighborhood',
    latitude: 0,
    longitude: 0,
    locationTypes: ['grocery_store'],
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
  };

  describe('listMarkets', () => {
    it('should return market list from service', async () => {
      marketService.getMarketList.mockResolvedValue({
        total: 1,
        markets: [mockMarket as any],
      });

      const request = {
        query: { pageIndex: 0, pageSize: 10 },
        auth: { user: { id: 'user-1' } },
        groupId: 'group-1'
      } as any as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any as FastifyReply;

      let capturedHandler: any;
      await (marketController as any).registerRoutes({
        addHook: vi.fn(),
        get: async (path: string, opts: any, handler: any) => {
          if (path === '') capturedHandler = handler;
        }
      } as any);

      await capturedHandler(request, reply);

      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({
        total: 1,
        items: expect.arrayContaining([
          expect.objectContaining({ id: 'market-1', name: 'Test Market' })
        ])
      }));
    });
  });

  describe('getMarketById', () => {
    it('should return single market', async () => {
      marketService.getMarketById.mockResolvedValue(mockMarket as any);

      const request = {
        params: { marketId: 'market-1' },
        query: {},
        auth: { user: { id: 'user-1' } },
        groupId: 'group-1'
      } as any as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any as FastifyReply;

      let capturedHandler: any;
      await (marketController as any).registerRoutes({
        addHook: vi.fn(),
        get: async (path: string, opts: any, handler: any) => {
          if (path === '/:marketId') capturedHandler = handler;
        }
      } as any);

      await capturedHandler(request, reply);

      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({
        id: 'market-1'
      }));
    });
  });
});
