import { defineConfig } from 'drizzle-kit';
import { env } from './data/env/server';

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  strict: true,
  verbose: true,
  dialect: 'postgresql',
  dbCredentials: {
    password: env.DB_PASSWORD,
    user: env.DB_USER,
    database: env.DB_NAME,
    host: env.DB_HOST,
    ssl: false,
  },
});
