// Standalone migration runner — replaces `drizzle-kit push` for production deploys.
// Usage:
//   npm run db:migrate            — apply any pending migrations in db/migrations
//   npm run db:migrate -- --baseline  — one-time: mark all *current* migration files as
//                                       already-applied without running their SQL, for a
//                                       database that was previously managed via `db:push`
//                                       (its tables already exist, so re-running the CREATE
//                                       TABLE statements from migration 0000 onward would fail).
//
// Do NOT run --baseline on a database more than once, and never on a fresh/empty database
// (there, just run the normal `npm run db:migrate`).
import { createPool, type Pool } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseDbUrl } from "./parse-db-url";

const MIGRATIONS_TABLE = "__drizzle_migrations";
const MIGRATIONS_FOLDER = "./db/migrations";

function loadDotEnvIfPresent() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function runBaseline(pool: Pool) {
  const journalPath = path.resolve(process.cwd(), MIGRATIONS_FOLDER, "meta/_journal.json");
  const journal = JSON.parse(readFileSync(journalPath, "utf8")) as {
    entries: { when: number; tag: string }[];
  };
  if (journal.entries.length === 0) {
    throw new Error("Migration journal is empty — nothing to baseline.");
  }
  const latest = journal.entries.reduce((a, b) => (b.when > a.when ? b : a));

  const conn = await pool.getConnection();
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS \`${MIGRATIONS_TABLE}\` (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      )
    `);
    const [rows] = await conn.query(`SELECT COUNT(*) AS n FROM \`${MIGRATIONS_TABLE}\``);
    const count = Number((rows as Array<{ n: number }>)[0]?.n ?? 0);
    if (count > 0) {
      throw new Error(
        `${MIGRATIONS_TABLE} already has ${count} row(s) — refusing to re-baseline a database that already ` +
          `has migration history. Run 'npm run db:migrate' (without --baseline) instead.`,
      );
    }
    await conn.execute(`INSERT INTO \`${MIGRATIONS_TABLE}\` (hash, created_at) VALUES (?, ?)`, [
      `baseline-manual-${new Date().toISOString()}`,
      latest.when,
    ]);
    console.log(
      `Baselined ${MIGRATIONS_TABLE} at "${latest.tag}" (created_at=${latest.when}). ` +
        `All ${journal.entries.length} existing migration file(s) are now treated as already applied — ` +
        `only migrations generated after this point will run on future 'npm run db:migrate' calls.`,
    );
  } finally {
    conn.release();
  }
}

async function main() {
  loadDotEnvIfPresent();

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const pool = createPool({ ...parseDbUrl(url), connectionLimit: 1 });

  try {
    if (process.argv.includes("--baseline")) {
      await runBaseline(pool);
      return;
    }

    console.log(`Applying pending migrations from ${MIGRATIONS_FOLDER} to ${parseDbUrl(url).database}...`);
    const db = drizzle(pool, { mode: "default" });
    await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
    console.log("Migrations complete.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
