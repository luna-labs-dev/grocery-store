import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config();
const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  NODE_ENV,
} = process.env;

const actualDbName =
  NODE_ENV === 'test' && !DATABASE_NAME?.endsWith('_test')
    ? `${DATABASE_NAME}_test`
    : DATABASE_NAME;

const url = `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${actualDbName}`;
export default defineConfig({
  schema: './src/infrastructure/repositories/drizzle/setup/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url,
  },
  verbose: true,
  strict: true,
});
