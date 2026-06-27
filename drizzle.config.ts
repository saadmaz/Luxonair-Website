import type { Config } from "drizzle-kit";

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
  };
}

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: parseDbUrl(process.env.DATABASE_URL ?? "mysql://x:x@localhost/x"),
} satisfies Config;
