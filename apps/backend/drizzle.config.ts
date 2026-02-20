import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { env } from './src/main/config/env';

config();
const { database } = env;
export default defineConfig({
  schema: './src/infrastructure/database/drizzle/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: database.url,
  },
  verbose: true,
  strict: true,
});
