// Lightweight typed fetch wrapper used by all client-side API calls.
// Returns parsed JSON on 2xx, throws an Error with the server message on failure.

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore JSON parse failures
    }
    throw new Error(message);
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
