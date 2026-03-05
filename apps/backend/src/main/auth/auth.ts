import { redisStorage } from '@better-auth/redis-storage';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { Redis } from 'ioredis';
import { db } from '@/infrastructure/repositories/drizzle/setup/connection';
import * as schema from '@/infrastructure/repositories/drizzle/setup/schema';
import { env } from '@/main/config/env';

const redis = new Redis(env.valkey.url);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.userTable,
      session: schema.sessionTable,
      account: schema.accountTable,
      verification: schema.verificationTable,
    },
  }),
  secondaryStorage: redisStorage({
    client: redis,
    keyPrefix: 'auth:',
  }),
  user: {
    additionalFields: {},
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.social.google.clientId || '',
      clientSecret: env.social.google.clientSecret || '',
    },
  },
  trustedOrigins: Array.isArray(env.baseConfig.origins)
    ? env.baseConfig.origins
    : [env.baseConfig.origins],
  secret: env.auth.secret,
  baseURL: env.auth.url,
});
