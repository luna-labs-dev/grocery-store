import 'reflect-metadata';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { MarketController } from '@/api/controllers/market-controller';
import { DbMarketManager } from '@/application/usecases/db-market-manager';

vi.mock('@/application/usecases/db-market-manager');

describe('MarketController Integration', () => {
  let marketController: MarketController;
  let marketManager: Mocked<DbMarketManager>;

  beforeEach(() => {
    vi.clearAllMocks();
    marketManager = new DbMarketManager(
      null as unknown as never,
      null as unknown as never,
    ) as Mocked<DbMarketManager>;
    container.registerInstance('DbMarketManager', marketManager);
    marketController = new MarketController(marketManager);
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
      marketManager.getMarketList.mockResolvedValue({
        total: 1,
        markets: [mockMarket as unknown as never],
      });

      const request = {
        query: { pageIndex: 0, pageSize: 10 },
        auth: { user: { id: 'user-1' } },
        groupId: 'group-1',
      } as unknown as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as FastifyReply;

      let capturedHandler: (
        req: FastifyRequest,
        res: FastifyReply,
      ) => Promise<void> = async () => {};

      await marketController.registerRoutes({
        addHook: vi.fn(),
        get: async (path: string, _opts: unknown, handler: unknown) => {
          if (path === '') {
            capturedHandler = handler as typeof capturedHandler;
          }
        },
      } as unknown as FastifyInstance);

      await capturedHandler(request, reply);

      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 1,
          items: expect.arrayContaining([
            expect.objectContaining({ id: 'market-1', name: 'Test Market' }),
          ]),
        }),
      );
    });
  });

  describe('getMarketById', () => {
    it('should return single market', async () => {
      marketManager.getMarketById.mockResolvedValue(
        mockMarket as unknown as never,
      );

      const request = {
        params: { marketId: 'market-1' },
        query: {},
        auth: { user: { id: 'user-1' } },
        groupId: 'group-1',
      } as unknown as FastifyRequest;

      const reply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as FastifyReply;

      let capturedHandler: (
        req: FastifyRequest,
        res: FastifyReply,
      ) => Promise<void> = async () => {};

      await marketController.registerRoutes({
        addHook: vi.fn(),
        get: async (path: string, _opts: unknown, handler: unknown) => {
          if (path === '/:marketId') {
            capturedHandler = handler as typeof capturedHandler;
          }
        },
      } as unknown as FastifyInstance);

      await capturedHandler(request, reply);

      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'market-1',
        }),
      );
    });
  });
});
