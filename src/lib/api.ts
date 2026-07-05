// Lightweight typed fetch wrapper used by all client-side API calls.
// Returns parsed JSON on 2xx, throws an ApiError with the server message and
// HTTP status on failure (status is used by the global query/mutation error
// handler in router.tsx to redirect on 401 and skip toasting on 429, etc).

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const body = (await res.json()) as { error?: string; issues?: Record<string, string[] | undefined> };
      if (body.error) message = body.error;
      if (body.issues) {
        const detail = Object.entries(body.issues)
          .filter((entry): entry is [string, string[]] => Array.isArray(entry[1]) && entry[1].length > 0)
          .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
          .join("; ");
        if (detail) message = `${message} — ${detail}`;
      }
    } catch {
      // ignore JSON parse failures
    }
    throw new ApiError(message, res.status);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export type Paged<T> = { data: T[]; total: number; page: number; limit: number };

export const api = {
  get: <T>(path: string) => request<T>(path),
  getPaged: <T>(path: string, page: number, limit = 50) =>
    request<Paged<T>>(`${path}${path.includes("?") ? "&" : "?"}page=${page}&limit=${limit}`),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
