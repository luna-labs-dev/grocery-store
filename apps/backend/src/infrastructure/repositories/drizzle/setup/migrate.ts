import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '@/main/config/env';

dotenv.config();

const ensureDatabaseExists = async (baseClient: postgres.Sql) => {
  console.log('Check if database exists...');
  const dbExists =
    await baseClient`SELECT datname FROM pg_database WHERE datname = ${env.database.dbName}`;

  if (dbExists.length === 0) {
    console.log(
      `Database ${env.database.dbName} does not exist, creating it...`,
    );
    await createDatabase(baseClient);
  }
};

const createDatabase = async (baseClient: postgres.Sql) => {
  try {
    await baseClient.unsafe(`CREATE DATABASE "${env.database.dbName}"`);
  } catch (createErr: any) {
    if (isCollationError(createErr)) {
      await fixCollationAndRetry(baseClient);
    } else {
      throw createErr;
    }
  }
};

const isCollationError = (err: any) =>
  err.code === 'XX000' && err.message?.includes('collation');

const fixCollationAndRetry = async (baseClient: postgres.Sql) => {
  console.warn('Caught collation version mismatch error. Attempting to fix...');
  await baseClient`ALTER DATABASE template1 REFRESH COLLATION VERSION`;
  console.log('Collation refreshed. Retrying database creation...');
  await baseClient.unsafe(`CREATE DATABASE "${env.database.dbName}"`);
};

const ensurePostgisExtension = async (migrationClient: postgres.Sql) => {
  console.log('Ensuring PostGIS is installed...');
  await migrationClient.unsafe('CREATE EXTENSION IF NOT EXISTS postgis');
};

const applyMigrations = async (migrationClient: postgres.Sql) => {
  const db = drizzle(migrationClient);
  console.log('Running Drizzle migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations applied successfully!');
};

const runMigrate = async () => {
  const baseConnectionString = `${env.database.baseUrl}/postgres`;
  const connectionString = env.database.url;
  console.log({ baseConnectionString, connectionString });

  const baseClient = postgres(baseConnectionString, { max: 1 });
  try {
    await ensureDatabaseExists(baseClient);
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  } finally {
    await baseClient.end();
  }

  console.log(`Database ${env.database.dbName} is accessible`);

  const migrationClient = postgres(connectionString, { max: 1 });
  try {
    await ensurePostgisExtension(migrationClient);
    await applyMigrations(migrationClient);
  } catch (err) {
    console.error('Migration failed!', err);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }

  process.exit(0);
};

runMigrate();
