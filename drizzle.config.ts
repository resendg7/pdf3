import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL not set - database operations will be skipped");
  process.exit(0);
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
