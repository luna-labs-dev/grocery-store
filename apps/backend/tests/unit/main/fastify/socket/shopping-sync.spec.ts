import type { FastifyInstance } from 'fastify';
import { io as Client, type Socket as ClientSocket } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  authenticate,
  cleanupDatabase,
  initApp,
  seedMarket,
} from '../../../../e2e/setup';
import { db } from '@/infrastructure/repositories/drizzle/setup/connection';
import * as schema from '@/infrastructure/repositories/drizzle/setup/schema';

describe('Real-Time Sync (Socket.io) Integration', () => {
  let app: FastifyInstance;
  let port: number;
  let validCookie: string;
  let seededShoppingEventId: string;

  beforeAll(async () => {
    app = await initApp();
    await app.listen({ port: 0 });
    const address = app.server.address();
    port = typeof address === 'string' ? 0 : address?.port || 0;

    await cleanupDatabase();
    const auth = await authenticate(app, 'socket-user@example.com');
    validCookie = auth.cookie;
    const userId = auth.user.id;

    // Seed group
    const groupId = uuid();
    await db.insert(schema.groupTable).values({
      id: groupId,
      name: 'Test Group',
      createdBy: userId,
    });

    // Seed member
    await db.insert(schema.groupMemberTable).values({
      groupId,
      userId,
      role: 'owner',
    });

    // Seed market
    const marketId = await seedMarket();

    // Seed shopping event
    seededShoppingEventId = uuid();
    await db.insert(schema.shopping_eventTable).values({
      id: seededShoppingEventId,
      groupId,
      marketId,
      status: 'ongoing',
      totalPaid: '0',
      wholesaleTotal: '0',
      retailTotal: '0',
      createdBy: userId,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  const createClient = (cookie?: string): ClientSocket => {
    return Client(`http://localhost:${port}`, {
      extraHeaders: {
        cookie: cookie || '',
      },
      transports: ['websocket'],
    });
  };

  it('should reject connection without valid cookie', () => {
    return new Promise<void>((resolve, reject) => {
      const client = createClient('invalid-cookie');

      client.on('connect', () => {
        client.disconnect();
        reject(new Error('Connection should have been rejected'));
      });

      client.on('connect_error', (err) => {
        try {
          expect(err.message).toBe('Authentication failed');
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  });

  it('should join a room based on shoppingEventId with valid cookie', () => {
    return new Promise<void>((resolve, reject) => {
      const client = createClient(validCookie);

      client.on('connect', () => {
        client.emit(
          'join-room',
          { shoppingEventId: seededShoppingEventId },
          (response: any) => {
            try {
              expect(response.status).toBe('ok');
              client.disconnect();
              resolve();
            } catch (e) {
              reject(e);
            }
          },
        );
      });

      client.on('connect_error', (err) => reject(err));
      setTimeout(() => reject(new Error('Timeout')), 2000);
    });
  });

  it('should broadcast product_added event to all members in the room', () => {
    return new Promise<void>((resolve, reject) => {
      const clientA = createClient(validCookie);
      const clientB = createClient(validCookie);

      let connectedCount = 0;
      const onConnect = () => {
        connectedCount++;
        if (connectedCount === 2) {
          clientA.emit(
            'join-room',
            { shoppingEventId: seededShoppingEventId },
            () => {
              clientB.emit(
                'join-room',
                { shoppingEventId: seededShoppingEventId },
                () => {
                  // Wait a bit for rooms to be joined
                  setTimeout(() => {
                    clientA.emit('product_added', {
                      shoppingEventId: seededShoppingEventId,
                      product: { id: 'p1', name: 'Milk' },
                    });
                  }, 100);
                },
              );
            },
          );
        }
      };

      clientA.on('connect', onConnect);
      clientB.on('connect', onConnect);

      clientB.on('product_added', (data: any) => {
        try {
          expect(data.product.name).toBe('Milk');
          clientA.disconnect();
          clientB.disconnect();
          resolve();
        } catch (e) {
          reject(e);
        }
      });

      setTimeout(() => reject(new Error('Timeout')), 5000);
    });
  });

  it('should NOT allow joining a room for a shopping event the user does not belong to', async () => {
    return new Promise<void>((resolve, reject) => {
      const client = createClient(validCookie);
      const unauthorizedEventId = uuid();

      client.on('connect', () => {
        client.emit(
          'join-room',
          { shoppingEventId: unauthorizedEventId },
          (response: any) => {
            try {
              expect(response.status).toBe('error');
              expect(response.message).toMatch(/Unauthorized/);
              client.disconnect();
              resolve();
            } catch (e) {
              reject(e);
            }
          },
        );
      });

      setTimeout(
        () => reject(new Error('Timeout or accepted unauthorized room')),
        3000,
      );
    });
  });
});
