import type { FastifyInstance } from 'fastify';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { authenticate, cleanupDatabase, initApp, seedMarket } from './setup';

describe('Shopping Event E2E', () => {
  let app: FastifyInstance;
  let cookie: string;
  let groupId: string;
  let marketId: string;

  beforeAll(async () => {
    app = await initApp();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    const auth = await authenticate(app, 'shopping-test@example.com');
    cookie = auth.cookie;

    // 2. Create a group
    const groupRes = await app.inject({
      method: 'POST',
      url: '/api/group',
      headers: { cookie },
      payload: { name: 'Shopping Test Group' },
    });
    groupId = JSON.parse(groupRes.payload).id;

    // 3. Seed a market
    marketId = await seedMarket();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  it('should start a shopping event', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/shopping-event/start',
      headers: {
        cookie,
        'x-group-id': groupId,
      },
      payload: { marketId },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.id).toBeDefined();
    expect(body.status).toBe('ongoing');
    expect(body.market).toBeDefined();
  });

  it('should list shopping events', async () => {
    // Start one first
    await app.inject({
      method: 'POST',
      url: '/api/shopping-event/start',
      headers: { cookie, 'x-group-id': groupId },
      payload: { marketId },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/shopping-event',
      headers: {
        cookie,
        'x-group-id': groupId,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.items).toBeDefined();
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);
  });

  it('should get a shopping event by id', async () => {
    // Start one first
    const startRes = await app.inject({
      method: 'POST',
      url: '/api/shopping-event/start',
      headers: { cookie, 'x-group-id': groupId },
      payload: { marketId },
    });
    const shoppingEventId = JSON.parse(startRes.payload).id;

    const response = await app.inject({
      method: 'GET',
      url: `/api/shopping-event/${shoppingEventId}`,
      headers: {
        cookie,
        'x-group-id': groupId,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.id).toBe(shoppingEventId);
  });
});
