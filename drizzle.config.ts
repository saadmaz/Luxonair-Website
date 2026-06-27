import type { Config } from "drizzle-kit";

function parseDbUrl(url: string) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: u.port ? Number(u.port) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
  };
}

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: parseDbUrl(process.env.DATABASE_URL ?? "mysql://x:x@localhost/x"),
} satisfies Config;
