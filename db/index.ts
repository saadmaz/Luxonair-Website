"use server";
import { drizzle } from "drizzle-orm/mysql2";
import { getTableColumns } from "drizzle-orm";
import { createPool } from "mysql2/promise";
import * as schema from "./schema";
import { parseDbUrl } from "./parse-db-url";

const baseConfig = process.env.DATABASE_URL
  ? parseDbUrl(process.env.DATABASE_URL)
  : { host: "127.0.0.1", port: 3306, user: "", password: "", database: "" };

// `npm run dev` is the one command a developer runs directly against whatever
// DATABASE_URL happens to be in .env — checking npm_lifecycle_event instead of
// NODE_ENV because NODE_ENV in this repo's own .env is frequently left at
// "production" (copied from a deploy config) even for local runs, which would
// silently defeat a NODE_ENV-gated check.
if (process.env.npm_lifecycle_event === "dev" && !/^(dev|local|test)/i.test(baseConfig.database)) {
  console.warn(
    `[db] 'npm run dev' is connecting to ${baseConfig.host}/${baseConfig.database}. ` +
      `If this is not a disposable local database, stop now — see README's "Local development database" section ` +
      `and docker-compose.yml. Writing test data into this database from local dev may write to production.`,
  );
}

// MariaDB (used on Hostinger) stores json columns as LONGTEXT and mysql2 returns them as raw
// strings instead of parsed objects. Intercept by column name so all queries benefit automatically.
// Derived from schema.ts so a new json() column is never silently missed.
const JSON_COLUMNS = new Set(
  Object.values(schema).flatMap((table) =>
    Object.values(getTableColumns(table as Parameters<typeof getTableColumns>[0]))
      .filter((c) => c.columnType === "MySqlJson")
      .map((c) => c.name),
  ),
);

const pool = createPool({
  ...baseConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 50,
  connectTimeout: 10_000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10_000,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  typeCast(field, next) {
    if (JSON_COLUMNS.has(field.name)) {
      const raw = field.string();
      return raw == null ? null : JSON.parse(raw);
    }
    return next();
  },
});
export const db = drizzle(pool, { schema, mode: "default" });

export async function runStartupMigrations() {
  const conn = await pool.getConnection();
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS \`sessions\` (
        \`id\` varchar(64) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT (now()),
        \`revoked_at\` timestamp,
        CONSTRAINT \`sessions_id\` PRIMARY KEY(\`id\`)
      )
    `);
    // CREATE INDEX IF NOT EXISTS requires MySQL 8.0.29+; wrap for older hosts
    try {
      await conn.execute(`CREATE INDEX IF NOT EXISTS \`sessions_email_idx\` ON \`sessions\` (\`email\`)`);
    } catch { /* index already exists or unsupported syntax — safe to ignore */ }
  } finally {
    conn.release();
  }
}

export * from "./schema";
