import { config } from 'dotenv';
import { z } from 'zod';

config();

const envVariables = z.object({
  ENVIRONMENT: z.enum(['local', 'dev', 'prod']).default('local'),
  LOG_LEVEL: z.enum(['dev', 'debug', 'prod']).default('dev'),
  PORT: z.coerce.number().default(8000),
  DATABASE_URL: z.string(),
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
  DATABASE_URL,
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
    baseUrl: DATABASE_URL,
    name: DATABASE_NAME,
    url: DATABASE_URL.replace('/postgres', `/${DATABASE_NAME}`),
  },
  clerk: {
    publishableKey: CLERK_PUBLISHABLE_KEY,
    secretKey: CLERK_SECRET_KEY,
  },
} as const;
