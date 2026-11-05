'use client';

import { useEffect, useState } from 'react';
import { RoleDashboardShell } from '@/components/RoleDashboardShell';
import { api } from '@/lib/api';
import { apiBase } from '@/lib/site';

const nav = [{ href: '/admin', label: 'System Overview' }];

type AlertRow  = { id: number; alert_type: string; severity: string; message: string; acknowledged: boolean; created_at: string; };
type DeviceRow = { id: number; name: string; serial_number: string; status: string; battery_level: number | null; last_seen: string | null; };
type AdminSummary = {
  counts: { total_users: number; active_users: number; total_devices: number; online_devices: number; total_customers: number; open_alerts: number; critical_alerts: number; total_alerts: number; };
  role_distribution: Record<string, number>;
  recent_alerts: AlertRow[];
  low_battery_devices: DeviceRow[];
  recent_devices: DeviceRow[];
};

function severityBadge(s: string) {
  if (s === 'critical') return 'bg-rose-soft text-coral dark:bg-plum-dark/60';
  if (s === 'warning')  return 'bg-gold-soft text-gold dark:bg-plum-dark/60';
  return 'opacity-60';
}

function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('alehu_access_token');
}

export default function AdminDashboard() {
  const [data, setData]             = useState<AdminSummary | null>(null);
  const [error, setError]           = useState('');
  const [togglingId, setTogglingId] = useState<number | null>(null);

  function load() {
    api<AdminSummary>('/dashboard/admin/summary')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }
  useEffect(() => { load(); }, []);

  async function toggleActive(userId: number) {
    setTogglingId(userId);
    try {
      const token = getToken();
      await fetch(`${apiBase}/dashboard/admin/users/${userId}/toggle-active`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      load();
    } catch { setError('Failed to toggle user status'); }
    finally { setTogglingId(null); }
  }

  const counts = data?.counts;

  return (
    <RoleDashboardShell
      requiredRole="admin"
      portalLabel="Admin portal"
      accentBg="bg-gold"
      nav={nav}
      loginPath="/admin/login"
    >
      <h1 className="font-display text-4xl" style={{ color: 'var(--color-ink)' }}>System overview</h1>
      <p className="mt-1 text-sm opacity-60" style={{ color: 'var(--color-ink)' }}>
        Full visibility across all users, devices, and alerts.
      </p>

      {error && (
        <p className="mt-4 rounded-2xl bg-rose-soft px-4 py-3 text-sm text-coral">{error}</p>
      )}

      {/* Primary tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total users',    value: counts?.total_users    ?? '—' },
          { label: 'Active users',   value: counts?.active_users   ?? '—' },
          { label: 'Total devices',  value: counts?.total_devices  ?? '—' },
          { label: 'Online devices', value: counts?.online_devices ?? '—' },
        ].map(({ label, value }) => (
          <article key={label} className="card p-5">
            <p className="text-sm opacity-60" style={{ color: 'var(--color-ink)' }}>{label}</p>
            <p className="mt-2 font-display text-3xl" style={{ color: 'var(--color-ink)' }}>{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Guardian orgs',   value: counts?.total_customers ?? '—' },
          { label: 'Open alerts',     value: counts?.open_alerts     ?? '—' },
          { label: 'Critical alerts', value: counts?.critical_alerts ?? '—' },
          { label: 'Total alerts',    value: counts?.total_alerts    ?? '—' },
        ].map(({ label, value }) => (
          <article key={label} className="card p-5">
            <p className="text-sm opacity-60" style={{ color: 'var(--color-ink)' }}>{label}</p>
            <p className="mt-2 font-display text-3xl" style={{ color: 'var(--color-ink)' }}>{value}</p>
          </article>
        ))}
      </div>

      {/* Role distribution */}
      {data?.role_distribution && (
        <section className="card mt-6 p-6">
          <h2 className="font-display text-xl" style={{ color: 'var(--color-ink)' }}>Role distribution</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(data.role_distribution).map(([role, count]) => (
              <div key={role} className="rounded-2xl bg-blush-soft dark:bg-plum-dark/40 px-4 py-2 text-sm">
                <span className="font-semibold capitalize" style={{ color: 'var(--color-ink)' }}>
                  {role.replace('_', ' ')}
                </span>
                <span className="ml-2 opacity-60" style={{ color: 'var(--color-ink)' }}>{count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent alerts */}
        <section className="card p-6">
          <h2 className="font-display text-2xl" style={{ color: 'var(--color-ink)' }}>Recent alerts</h2>
          {!data?.recent_alerts?.length && (
            <p className="mt-4 text-sm opacity-50" style={{ color: 'var(--color-ink)' }}>No alerts yet.</p>
          )}
          <ul className="mt-4 space-y-3">
            {(data?.recent_alerts ?? []).map((alert) => (
              <li key={alert.id} className="rounded-2xl bg-blush-soft dark:bg-plum-dark/40 px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${severityBadge(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-medium uppercase opacity-50" style={{ color: 'var(--color-ink)' }}>
                    {alert.alert_type}
                  </span>
                  {alert.acknowledged && (
                    <span className="ml-auto text-xs opacity-40" style={{ color: 'var(--color-ink)' }}>acknowledged</span>
                  )}
                </div>
                <p className="mt-1" style={{ color: 'var(--color-ink)' }}>{alert.message}</p>
                <p className="mt-1 text-xs opacity-40" style={{ color: 'var(--color-ink)' }}>
                  {new Date(alert.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-6">
          {/* Low battery */}
          <section className="card p-6">
            <h2 className="font-display text-xl" style={{ color: 'var(--color-ink)' }}>Low battery (≤20%)</h2>
            {!data?.low_battery_devices?.length ? (
              <p className="mt-4 text-sm opacity-50" style={{ color: 'var(--color-ink)' }}>All devices charged.</p>
            ) : (
              <ul className="mt-4 space-y-2 text-sm">
                {data.low_battery_devices.map((device) => (
                  <li key={device.id}
                    className="flex items-center justify-between rounded-2xl bg-rose-soft dark:bg-plum-dark/60 px-4 py-2">
                    <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{device.name}</span>
                    <span className="font-semibold text-coral">{device.battery_level}%</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Recent devices */}
          <section className="card p-6">
            <h2 className="font-display text-xl" style={{ color: 'var(--color-ink)' }}>Recently seen</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {(data?.recent_devices ?? []).map((device) => (
                <li key={device.id}
                  className="flex items-center justify-between rounded-2xl bg-blush-soft dark:bg-plum-dark/40 px-4 py-2">
                  <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{device.name}</span>
                  <span className={`text-xs ${device.status === 'active' ? 'text-sage' : 'opacity-40'}`}
                    style={device.status !== 'active' ? { color: 'var(--color-ink)' } : {}}>
                    {device.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Users table */}
      <section className="card mt-6 p-6">
        <h2 className="font-display text-2xl" style={{ color: 'var(--color-ink)' }}>System users</h2>
        <p className="mt-1 text-sm opacity-60" style={{ color: 'var(--color-ink)' }}>
          Activate or deactivate accounts below.
        </p>
        <UsersTable onToggle={toggleActive} togglingId={togglingId} />
      </section>
    </RoleDashboardShell>
  );
}

/* ── Users sub-component ── */
function UsersTable({ onToggle, togglingId }: { onToggle: (id: number) => void; togglingId: number | null }) {
  type UserRow = { id: number; username: string; email: string; role: string | null; is_active: boolean; created_at: string; };
  const [users, setUsers]     = useState<UserRow[]>([]);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    api<{ users: UserRow[]; pagination: unknown }>(`/dashboard/admin/users${q}`)
      .then((res) => setUsers(res.data.users))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <>
      <div className="mt-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full max-w-xs rounded-2xl border px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-rose/40"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-ink)' }} />
      </div>
      {loading ? (
        <p className="mt-4 text-sm opacity-50" style={{ color: 'var(--color-ink)' }}>Loading…</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left opacity-50" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}>
                {['Username', 'Email', 'Role', 'Status', 'Action'].map((h) => (
                  <th key={h} className="pb-2 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="py-2 pr-4 font-medium" style={{ color: 'var(--color-ink)' }}>{user.username}</td>
                  <td className="py-2 pr-4 opacity-70" style={{ color: 'var(--color-ink)' }}>{user.email}</td>
                  <td className="py-2 pr-4">
                    <span className="rounded-full bg-blush-soft dark:bg-plum-dark/40 px-2 py-0.5 text-xs capitalize"
                      style={{ color: 'var(--color-ink)' }}>
                      {user.role?.replace('_', ' ') ?? '—'}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${user.is_active ? 'bg-sage/20 text-sage' : 'bg-rose-soft text-coral'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2">
                    <button onClick={() => onToggle(user.id)} disabled={togglingId === user.id}
                      className="btn-ghost px-3 py-1 text-xs disabled:opacity-50">
                      {togglingId === user.id ? '…' : user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
              {!users.length && (
                <tr>
                  <td colSpan={5} className="py-6 text-center opacity-40" style={{ color: 'var(--color-ink)' }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
