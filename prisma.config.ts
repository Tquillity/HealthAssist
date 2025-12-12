import { defineConfig } from 'prisma/config';

// For Prisma generate, we can use a placeholder URL if DATABASE_URL is not set
// The actual connection is handled in src/lib/db.ts with the Neon adapter
const databaseUrl =
  process.env.DATABASE_URL ||
  'postgresql://placeholder:placeholder@localhost:5432/placeholder';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
});
