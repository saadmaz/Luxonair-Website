import { sql } from "drizzle-orm";
import { db, rateLimits } from "../../db/index";

export async function checkRateLimit(
  key: string,
  max: number,
  windowMs: number,
): Promise<{ allowed: boolean; retryAfter: number }> {
  const now = Date.now();
  const resetAt = now + windowMs;

  // Atomically upsert: insert new window or increment existing counter.
  // If the existing window has expired, replace it with a fresh one.
  await db.execute(sql`
    INSERT INTO rate_limits (\`key\`, count, reset_at)
    VALUES (${key}, 1, ${resetAt})
    ON DUPLICATE KEY UPDATE
      count    = IF(reset_at < ${now}, 1,        count + 1),
      reset_at = IF(reset_at < ${now}, ${resetAt}, reset_at)
  `);

  const [row] = await db
    .select({ count: rateLimits.count, resetAt: rateLimits.resetAt })
    .from(rateLimits)
    .where(sql`\`key\` = ${key}`)
    .limit(1);

  if (!row) return { allowed: true, retryAfter: 0 };

  if (row.count > max) {
    return {
      allowed: false,
      retryAfter: Math.ceil((row.resetAt - now) / 1000),
    };
  }

  return { allowed: true, retryAfter: 0 };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function rateLimitResponse(retryAfter: number): Response {
  return Response.json(
    { error: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
