import { apiBase } from './site';

type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
};

function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('alehu_access_token');
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<Envelope<T>> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${apiBase}${path}`, { ...init, headers, cache: 'no-store' });
  const body = (await response.json()) as Envelope<T>;
  if (!response.ok || !body.success) {
    const error = new Error(body.message || 'Request failed') as Error & {
      status: number;
      errors?: Record<string, string[]>;
    };
    error.status = response.status;
    error.errors = body.errors;
    throw error;
  }
  return body;
}

export const authApi = {
  login: (email: string, password: string) =>
    api<{ user: AuthUser; access_token: string; refresh_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (username: string, email: string, password: string) =>
    api<{ user: AuthUser; access_token: string; refresh_token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),
  me: () => api<{ user: AuthUser }>('/auth/me'),
  logout: () => api<null>('/auth/logout', { method: 'POST' }),
};

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  role: string | null;
  is_active: boolean;
};

export type Device = {
  id: number;
  name: string;
  serial_number: string;
  device_type: string | null;
  status: string;
  firmware_version: string | null;
  battery_level: number | null;
  last_latitude: number | null;
  last_longitude: number | null;
  last_seen: string | null;
  customer_id: number | null;
};

export type AlertItem = {
  id: number;
  alert_type: string;
  severity: string;
  message: string;
  acknowledged: boolean;
  device_id: number | null;
  customer_id: number | null;
  created_at: string;
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

export type DashboardSummary = {
  counts: {
    devices: number;
    customers: number;
    alerts_open: number;
    alerts_critical: number;
    devices_online: number;
  };
  devices: Device[];
  recent_alerts: AlertItem[];
};
