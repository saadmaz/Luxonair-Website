import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import * as schema from "./schema";

const pool = createPool(process.env.DATABASE_URL ?? "mysql://127.0.0.1:3306/db");
export const db = drizzle(pool, { schema, mode: "default" });

export * from "./schema";
