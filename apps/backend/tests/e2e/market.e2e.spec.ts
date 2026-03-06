import type { FastifyInstance } from 'fastify';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { authenticate, cleanupDatabase, initApp, seedMarket } from './setup';

describe('Market E2E', () => {
  let app: FastifyInstance;
  let cookie: string;
  let groupId: string;

  beforeAll(async () => {
    app = await initApp();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    const auth = await authenticate(app, 'market-test@example.com');
    cookie = auth.cookie;

    // Create a group (required by groupBarrierMiddleware)
    const groupRes = await app.inject({
      method: 'POST',
      url: '/api/group',
      headers: { cookie },
      payload: { name: 'Market Test Group' },
    });
    groupId = JSON.parse(groupRes.payload).id;

    // Seed at least one market
    await seedMarket();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  it('should list markets', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/market?location[latitude]=-23.550520&location[longitude]=-46.633308',
      headers: {
        cookie,
        'x-group-id': groupId,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.items).toBeDefined();
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('should get a market by id', async () => {
    // First list to get an ID (assuming some markets exist or we create one)
    // Actually, markets might be seeded or we might need to seed them.
    // Let's see if we can get a list first.
    const listRes = await app.inject({
      method: 'GET',
      url: '/api/market?location[latitude]=-23.550520&location[longitude]=-46.633308',
      headers: { cookie, 'x-group-id': groupId },
    });
    const list = JSON.parse(listRes.payload);

    if (list.items && list.items.length > 0) {
      const marketId = list.items[0].id;
      const response = await app.inject({
        method: 'GET',
        url: `/api/market/${marketId}?location[latitude]=-23.550520&location[longitude]=-46.633308`,
        headers: { cookie, 'x-group-id': groupId },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.id).toBe(marketId);
    }
  });
});
