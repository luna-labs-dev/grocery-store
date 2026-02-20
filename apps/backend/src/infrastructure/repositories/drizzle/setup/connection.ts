import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '@/main/config/env';

const connectionString = env.database.url;

export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
