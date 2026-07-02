import type { Config } from "drizzle-kit";
import { parseDbUrl } from "./db/parse-db-url";

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: parseDbUrl(process.env.DATABASE_URL ?? "mysql://x:x@localhost/x"),
} satisfies Config;
