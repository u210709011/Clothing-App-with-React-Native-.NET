import { apiGet } from '@/services/api';
import { getApiBaseUrl } from '@/config/api';

export type WhoAmIResponse = {
  uid?: string;
  email?: string;
  roles?: string[];
  isAdmin?: boolean;
};

export async function whoAmI(): Promise<WhoAmIResponse> {
  const res = await apiGet<WhoAmIResponse>('/whoami');
  return res;
}

export async function adminPing(): Promise<boolean> {
  try {
    const base = (await getApiBaseUrl())!;
    const resp = await fetch(`${base.replace(/\/$/, '')}/admin/ping`, {
      headers: await buildAuthHeader(),
    });
    return resp.ok;
  } catch (_) {
    return false;
  }
}

async function buildAuthHeader(): Promise<Record<string, string>> {
  try {
    const { getFirebaseAuth } = await import('@/services/firebase');
    const user = getFirebaseAuth().currentUser;
    if (!user) return {};
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}


export type AdminUser = {
  uid: string;
  email?: string;
  displayName?: string;
  photoUrl?: string;
  disabled: boolean;
  role?: string;
  createdAt?: string;
  lastSignInAt?: string;
};

export async function getAdminUsers(limit = 200): Promise<AdminUser[]> {
  const res = await apiGet<AdminUser[]>(`/admin/users?limit=${limit}`);
  return Array.isArray(res) ? res : [];
}

