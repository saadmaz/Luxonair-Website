"use server";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import * as schema from "./schema";

function parseDbUrl(url: string) {
  const withoutProtocol = url.replace(/^mysql(2)?:\/\//, "");
  const lastAt = withoutProtocol.lastIndexOf("@");
  const userPass = withoutProtocol.slice(0, lastAt);
  const hostDb = withoutProtocol.slice(lastAt + 1);
  const colonIdx = userPass.indexOf(":");
  const user = userPass.slice(0, colonIdx);
  const password = userPass.slice(colonIdx + 1);
  const slashIdx = hostDb.indexOf("/");
  const hostPort = hostDb.slice(0, slashIdx);
  const database = hostDb.slice(slashIdx + 1).split("?")[0];
  const [host, portStr] = hostPort.split(":");
  return {
    host: host || "127.0.0.1",
    port: portStr ? Number(portStr) : 3306,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
  };
}

const config = process.env.DATABASE_URL
  ? parseDbUrl(process.env.DATABASE_URL)
  : { host: "127.0.0.1", port: 3306, user: "", password: "", database: "", waitForConnections: true, connectionLimit: 1 };

const pool = createPool(config);
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

    // rate_limits powers the login rate-limiter; must exist before any login request
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS \`rate_limits\` (
        \`key\` varchar(255) NOT NULL,
        \`count\` int NOT NULL DEFAULT 1,
        \`reset_at\` bigint NOT NULL,
        CONSTRAINT \`rate_limits_key\` PRIMARY KEY(\`key\`)
      )
    `);
  } finally {
    conn.release();
  }
}

export * from "./schema";
