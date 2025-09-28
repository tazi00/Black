import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

const envFile =
  process.env.DRIZZLE_ENV_FILE ??
  (process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development');

if (!process.env.DATABASE_URL) {
  loadEnv({ path: envFile });
}

type Dialect = 'sqlite' | 'postgresql';
const provider: Dialect = (process.env.DATABASE_PROVIDER ?? 'sqlite') as Dialect;

if (!process.env.DATABASE_URL) {
  throw new Error(
    `DATABASE_URL missing. Loaded ${envFile}. Set DRIZZLE_ENV_FILE or provide env vars.`,
  );
}

export default defineConfig({
  schema: provider === 'postgresql' ? './src/db/pg/schema.ts' : './src/db/sqlite/schema.ts',
  out: `./drizzle/${provider}`,
  dialect: provider,
  dbCredentials: { url: process.env.DATABASE_URL! },
  verbose: true,
});
