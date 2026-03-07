import { config } from 'dotenv';
import { z } from 'zod';

config();

const envVariables = z.object({
  // App
  NODE_ENV: z
    .enum(['local', 'test', 'development', 'production'])
    .default('local'),
  LOG_LEVEL: z.enum(['dev', 'debug', 'prod']).default('dev'),
  PORT: z.coerce.number().default(8000),
  ORIGINS: z.string(),
  WEB_APP_URL: z.string().url().default('http://localhost:3000'),

  // Database
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number().default(5433),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),

  // Auth (Better Auth)
  BETTER_AUTH_SECRET: z.string().default('test-secret'),
  BETTER_AUTH_URL: z
    .url()
    .endsWith('/api/auth')
    .default('http://localhost/api/auth'),

  // Valkey / Redis
  VALKEY_URL: z.string().default('redis://localhost:6380'),

  // Google Places
  GOOGLE_PLACES_BASE_URL: z.string(),
  GOOGLE_PLACES_API_KEY: z.string(),

  // Domain
  MARKET_RADIUS: z.coerce.number().default(1000),

  // Social Auth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const parsedVariables = envVariables.safeParse(process.env);

if (!parsedVariables.success) {
  throw new Error(parsedVariables.error.message);
}

const getOrigin = (origins: string): string | string[] => {
  if (origins.includes(',')) {
    return origins.split(',');
  }
  return origins;
};

const {
  // App
  NODE_ENV,
  LOG_LEVEL,
  PORT,
  ORIGINS,
  WEB_APP_URL,

  // Database
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,

  // Auth
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,

  // Valkey
  VALKEY_URL,

  // Google Places
  GOOGLE_PLACES_BASE_URL,
  GOOGLE_PLACES_API_KEY,

  // Domain
  MARKET_RADIUS,

  // Social Auth
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = parsedVariables.data;

const actualDbName =
  NODE_ENV === 'test' && !DATABASE_NAME.endsWith('_test')
    ? `${DATABASE_NAME}_test`
    : DATABASE_NAME;

export const env = {
  baseConfig: {
    environment: NODE_ENV,
    logLevel: LOG_LEVEL,
    port: PORT,
    origins: getOrigin(ORIGINS),
    host: '0.0.0.0',
    webAppUrl: WEB_APP_URL,
  },
  database: {
    baseUrl: `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}`,
    url: `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${actualDbName}`,
    dbName: actualDbName,
  },
  auth: {
    secret: BETTER_AUTH_SECRET,
    url: BETTER_AUTH_URL,
  },
  valkey: {
    url: VALKEY_URL,
  },
  googlePlaces: {
    baseURL: GOOGLE_PLACES_BASE_URL,
    apiKey: GOOGLE_PLACES_API_KEY,
  },
  domain: {
    marketRadius: MARKET_RADIUS,
  },
  social: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },
} as const;
