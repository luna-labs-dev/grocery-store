import type { FastifyInstance } from 'fastify';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { authenticate, cleanupDatabase, initApp, seedMarket } from './setup';

describe('Cart E2E', () => {
  let app: FastifyInstance;
  let cookie: string;
  let groupId: string;
  let marketId: string;
  let shoppingEventId: string;

  beforeAll(async () => {
    app = await initApp();
  });

  beforeEach(async () => {
    await cleanupDatabase();

    // 1. Authenticate
    const auth = await authenticate(app, 'cart-test@example.com');
    cookie = auth.cookie;

    // 2. Create a group
    const groupRes = await app.inject({
      method: 'POST',
      url: '/api/group',
      headers: { cookie },
      payload: { name: 'Cart Test Group' },
    });
    const group = JSON.parse(groupRes.payload);
    groupId = group.id;

    if (!groupId) {
      console.error('Failed to create group in Cart E2E:', groupRes.payload);
    }

    // 3. Seed a market
    marketId = await seedMarket();

    // 4. Start a shopping event
    const startRes = await app.inject({
      method: 'POST',
      url: '/api/shopping-event/start',
      headers: { cookie, 'x-group-id': groupId },
      payload: { marketId },
    });
    shoppingEventId = JSON.parse(startRes.payload).id;
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  it('should add a product to the cart', async () => {
    const productData = {
      name: 'Milk',
      amount: 2,
      price: 3.5,
      wholesaleMinAmount: 5,
      wholesalePrice: 3.0,
    };

    const response = await app.inject({
      method: 'POST',
      url: `/api/cart/add-product/${shoppingEventId}`,
      headers: {
        cookie,
        'x-group-id': groupId,
      },
      payload: productData,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.id).toBeDefined();
    expect(body.addedAt).toBeDefined();
  });

  it('should update a product in the cart', async () => {
    // 1. Add product first
    const addRes = await app.inject({
      method: 'POST',
      url: `/api/cart/add-product/${shoppingEventId}`,
      headers: { cookie, 'x-group-id': groupId },
      payload: { name: 'Coffee', amount: 1, price: 10 },
    });
    const productId = JSON.parse(addRes.payload).id;

    // 2. Update it
    const updateData = {
      name: 'Coffee Premium',
      amount: 2,
      price: 12,
    };
    const response = await app.inject({
      method: 'PUT',
      url: `/api/cart/${shoppingEventId}/update-product/${productId}`,
      headers: { cookie, 'x-group-id': groupId },
      payload: updateData,
    });

    expect(response.statusCode).toBe(204);
  });

  it('should remove a product from the cart', async () => {
    // 1. Add product first
    const addRes = await app.inject({
      method: 'POST',
      url: `/api/cart/add-product/${shoppingEventId}`,
      headers: { cookie, 'x-group-id': groupId },
      payload: { name: 'Bread', amount: 1, price: 2 },
    });
    const productId = JSON.parse(addRes.payload).id;

    // 2. Remove it
    const response = await app.inject({
      method: 'DELETE',
      url: `/api/cart/${shoppingEventId}/remove-product/${productId}`,
      headers: { cookie, 'x-group-id': groupId },
    });

    expect(response.statusCode).toBe(204);
  });
});
