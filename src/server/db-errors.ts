// Drizzle wraps every driver-level failure in a DrizzleQueryError whose own
// `.message` is just "Failed query: <sql>\nparams: <params>" — the actual
// MySQL error (and its message/code) lives one level down on `.cause`.
// Checking `error.message` directly for things like "foreign key constraint"
// silently never matches; walk to the real cause first.
function rootCause(e: unknown): unknown {
  let current = e;
  while (current instanceof Error && current.cause !== undefined) {
    current = current.cause;
  }
  return current;
}

export function dbErrorMessage(e: unknown): string {
  const cause = rootCause(e);
  if (cause instanceof Error) return cause.message;
  return e instanceof Error ? e.message : String(e);
}

export function isForeignKeyError(e: unknown): boolean {
  return dbErrorMessage(e).toLowerCase().includes("foreign key constraint");
}

export function isDuplicateKeyError(e: unknown): boolean {
  const msg = dbErrorMessage(e);
  return msg.includes("Duplicate") || msg.toLowerCase().includes("unique");
}
