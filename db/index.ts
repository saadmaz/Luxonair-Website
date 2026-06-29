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

export * from "./schema";
