import { config } from 'dotenv';
import { z } from 'zod';

config();

const envVariables = z.object({
  ENVIRONMENT: z.enum(['local', 'dev', 'prod']).default('local'),
  LOG_LEVEL: z.enum(['dev', 'debug', 'prod']).default('dev'),
  PORT: z.coerce.number().default(8000),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number().default(5433),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  ORIGINS: z.string(),
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
  ENVIRONMENT,
  LOG_LEVEL,
  PORT,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY,
  ORIGINS,
} = parsedVariables.data;

export const env = {
  baseConfig: {
    environment: ENVIRONMENT,
    logLevel: LOG_LEVEL,
    port: PORT,
    origins: getOrigin(ORIGINS),
  },
  database: { 
    baseUrl: `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}`,
    url: `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`,
    dbName: DATABASE_NAME,
  },
  clerk: {
    publishableKey: CLERK_PUBLISHABLE_KEY,
    secretKey: CLERK_SECRET_KEY,
  },
} as const;
