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

  // Database
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number().default(5433),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),

  // Auth (Better Auth)
  BETTER_AUTH_SECRET: z.string().default('test-secret'),
  BETTER_AUTH_URL: z.url().default('http://localhost'),

  // Valkey / Redis
  VALKEY_URL: z.string().default('redis://localhost:6380'),

  // Google Places
  GOOGLE_PLACES_BASE_URL: z.string(),
  GOOGLE_PLACES_API_KEY: z.string(),

  // Domain
  MARKET_RADIUS: z.coerce.number().default(1000),
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
} = parsedVariables.data;

export const env = {
  baseConfig: {
    environment: NODE_ENV,
    logLevel: LOG_LEVEL,
    port: PORT,
    origins: getOrigin(ORIGINS),
    host: '0.0.0.0',
  },
  database: {
    baseUrl: `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}`,
    url: `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`,
    dbName: DATABASE_NAME,
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
} as const;
