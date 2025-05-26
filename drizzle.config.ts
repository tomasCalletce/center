import { defineConfig } from "drizzle-kit";

const URI = process.env.DATABASE_URI!;

export default defineConfig({
  schema: ["./src/server/db/index.ts"],
  out: "./src/server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: URI,
  },
  verbose: true,
  strict: true,
});
