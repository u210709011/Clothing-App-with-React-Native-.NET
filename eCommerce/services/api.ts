import { getApiBaseUrl, DEFAULT_API_BASE_URL } from '@/config/api';
import { getFirebaseAuth } from '@/services/firebase';

function buildQuery(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';
  const pairs: string[] = [];
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  });
  return pairs.length ? `?${pairs.join('&')}` : '';
}

/**
 * Generic API request function
 * Handles API requests wieth error handling
 */

export async function apiGet<T>(path: string, params?: Record<string, string | number | boolean | undefined>, options?: { timeoutMs?: number }) {
  return apiRequest<T>('GET', path, { params, timeoutMs: options?.timeoutMs });
}

export async function apiPost<T>(path: string, body?: unknown, options?: { timeoutMs?: number }) {
  return apiRequest<T>('POST', path, { body, timeoutMs: options?.timeoutMs });
}

export async function apiPut<T>(path: string, body?: unknown, options?: { timeoutMs?: number }) {
  return apiRequest<T>('PUT', path, { body, timeoutMs: options?.timeoutMs });
}

export async function apiDelete<T>(path: string, options?: { timeoutMs?: number }) {
  return apiRequest<T>('DELETE', path, { timeoutMs: options?.timeoutMs });
}

export async function apiPatch<T>(path: string, body?: unknown, options?: { timeoutMs?: number }) {
  return apiRequest<T>('PATCH' as any, path, { body, timeoutMs: options?.timeoutMs });
}



async function apiRequest<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string, options?: { params?: Record<string, string | number | boolean | undefined>, body?: unknown, timeoutMs?: number }) {
  const timeoutMs = options?.timeoutMs ?? 8000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const qs = buildQuery(options?.params);
    const base = (await getApiBaseUrl()) ?? DEFAULT_API_BASE_URL;
    if (!base) throw new Error('API base URL not set');

    const baseClean = base.replace(/\/$/, '');
    const pathClean = path.startsWith('/') ? path : `/${path}`;
    const user = getFirebaseAuth().currentUser;
    const headers: Record<string, string> = {};
    if (user) {
      try {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } catch {}
    }
    if (options?.body !== undefined && options?.body !== null) {
      headers['Content-Type'] = 'application/json';
    }
    const res = await fetch(`${baseClean}${pathClean}${qs}`, {
      method,
      headers,
      signal: controller.signal,
      body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
    if (!res.ok) throw new Error(await res.text());
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return undefined as unknown as T;
    const json = await res.json();
    return (json?.data ?? json) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}



