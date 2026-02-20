import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '@/main/config/env';

dotenv.config();

const runMigrate = async () => {
  const baseConnectionString = env.database.baseUrl;
  const connectionString = env.database.url;

  console.log('Check if database exists and creates it if not...');
  const baseClient = postgres(baseConnectionString, { max: 1 });
  try {
    const dbExists =
      await baseClient`SELECT datname FROM pg_database WHERE datname = ${env.database.name}`;
    if (dbExists.length === 0) {
      await baseClient.unsafe(`CREATE DATABASE "${env.database.name}"`);
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await baseClient.end();
  }
  console.log('Database exists and is accessible');

  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  console.log('Running Drizzle migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations applied successfully!');
  await migrationClient.end();
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('Migration failed!', err);
  process.exit(1);
});
