import 'reflect-metadata';
import { Redis } from 'ioredis';
import { db } from '@/infrastructure/repositories/drizzle/setup/connection';
import * as schema from '@/infrastructure/repositories/drizzle/setup/schema';
import { env } from '@/main/config/env';
import { registerInjections } from '@/main/di/injections';
import { registerControllers } from '@/main/fastify';
import { setupFastifyApp } from '@/main/fastify/setup/app';

export const initApp = async () => {
  const { app } = setupFastifyApp();
  registerInjections(app);
  await app.register(registerControllers, { prefix: '/api' });
  await app.ready();
  return app;
};

const redis = new Redis(env.valkey.url);

export const cleanupDatabase = async () => {
  // Clear Redis sessions
  const keys = await redis.keys('auth:*');
  if (keys.length > 0) {
    await redis.del(...keys);
  }

  // Delete in reverse order of dependencies to avoid FK violations
  // Use sequential await to ensure order
  await db.delete(schema.productTable);
  await db.delete(schema.productIdentityTable);
  await db.delete(schema.canonicalProductTable);
  await db.delete(schema.shopping_eventTable);

  await db.delete(schema.groupMemberTable);
  await db.delete(schema.groupTable);
  await db.delete(schema.marketTable);
  await db.delete(schema.sessionTable);
  await db.delete(schema.accountTable);
  await db.delete(schema.verificationTable);
  await db.delete(schema.userTable);
};

export const authenticate = async (app: any, email = 'test@example.com') => {
  const signupData = {
    email,
    password: 'password123',
    name: 'Test User',
  };

  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/sign-up/email',
    payload: signupData,
  });

  if (response.statusCode !== 200) {
    console.error(
      `[E2E Auth Error] Sign-up failed for ${email}:`,
      response.payload,
    );
  }

  const setCookie = response.headers['set-cookie'];
  const cookie = Array.isArray(setCookie)
    ? setCookie.join('; ')
    : (setCookie as string);

  return {
    cookie,
    user: JSON.parse(response.payload).user,
  };
};

export const seedMarket = async () => {
  const marketId = 'd290f1ee-6c54-4b01-90e6-d701748f0851';
  await db
    .insert(schema.marketTable)
    .values({
      id: marketId,
      name: 'Test Market',
      formattedAddress: '123 Test St',
      city: 'Test City',
      neighborhood: 'Test Neighborhood',
      latitude: '-23.550520',
      longitude: '-46.633308',
      geographicLocation: 'POINT(-46.633308 -23.550520)',
      locationTypes: ['supermarket'],
    })
    .onConflictDoNothing();
  return marketId;
};
