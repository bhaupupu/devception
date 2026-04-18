const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? 'API error');
  }
  return res.json();
}

export const api = {
  get: <T>(path: string, token?: string) => apiFetch<T>(path, { method: 'GET' }, token),
  post: <T>(path: string, body: unknown, token?: string) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }, token),
  patch: <T>(path: string, body: unknown, token?: string) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, token),
  delete: <T>(path: string, token?: string) =>
    apiFetch<T>(path, { method: 'DELETE' }, token),
};
