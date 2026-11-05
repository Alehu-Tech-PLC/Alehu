'use client';

import { useEffect, useState } from 'react';
import { RoleDashboardShell } from '@/components/RoleDashboardShell';
import { api } from '@/lib/api';
import { apiBase } from '@/lib/site';

const nav = [{ href: '/admin', label: 'System Overview' }];

type AlertRow  = { id: number; alert_type: string; severity: string; message: string; acknowledged: boolean; created_at: string };
type DeviceRow = { id: number; name: string; serial_number: string; status: string; battery_level: number | null };
type UserRow   = { id: number; username: string; email: string; role: string | null; is_active: boolean };
type AdminSummary = {
  counts: { total_users: number; active_users: number; total_devices: number; online_devices: number; total_customers: number; open_alerts: number; critical_alerts: number; total_alerts: number };
  role_distribution: Record<string, number>;
  recent_alerts: AlertRow[];
  low_battery_devices: DeviceRow[];
  recent_devices: DeviceRow[];
};

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('alehu_access_token');
}

export default function AdminDashboard() {
  const [data, setData]             = useState<AdminSummary | null>(null);
  const [error, setError]           = useState('');
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [users, setUsers]           = useState<UserRow[]>([]);
  const [search, setSearch]         = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  function loadSummary() {
    api<AdminSummary>('/dashboard/admin/summary')
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message));
  }

  function loadUsers() {
    setLoadingUsers(true);
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    api<{ users: UserRow[] }>(`/dashboard/admin/users${q}`)
      .then((r) => setUsers(r.data.users))
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }

  useEffect(() => { loadSummary(); }, []);
  useEffect(() => { loadUsers(); }, [search]);

  async function toggleActive(userId: number) {
    setTogglingId(userId);
    try {
      await fetch(`${apiBase}/dashboard/admin/users/${userId}/toggle-active`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) },
      });
      loadSummary(); loadUsers();
    } catch { setError('Failed to toggle user status'); }
    finally { setTogglingId(null); }
  }

  const c = data?.counts;

  return (
    <RoleDashboardShell requiredRole="admin" portalLabel="Admin portal" nav={nav} loginPath="/admin/login">
      <div>
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--ink)' }}>System overview</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
          Full visibility across all users, devices, and alerts.
        </p>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm"
          style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid rgba(192,40,56,0.20)' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Primary tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total users',    value: c?.total_users    ?? '—', icon: '👥' },
          { label: 'Active users',   value: c?.active_users   ?? '—', icon: '✅' },
          { label: 'Total devices',  value: c?.total_devices  ?? '—', icon: '⌚' },
          { label: 'Online devices', value: c?.online_devices ?? '—', icon: '🟢' },
        ].map(({ label, value, icon }) => (
          <article key={label} className="stat-tile">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium" style={{ color: 'var(--ink-muted)' }}>{label}</p>
              <span className="text-base">{icon}</span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold" style={{ color: 'var(--ink)' }}>{value}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Guardian orgs',   value: c?.total_customers ?? '—', icon: '🏫' },
          { label: 'Open alerts',     value: c?.open_alerts     ?? '—', icon: '🔔' },
          { label: 'Critical alerts', value: c?.critical_alerts ?? '—', icon: '🚨', hot: true },
          { label: 'Total alerts',    value: c?.total_alerts    ?? '—', icon: '📊' },
        ].map(({ label, value, icon, hot }) => (
          <article key={label} className="stat-tile"
            style={hot && value !== '—' && value !== 0
              ? { background: 'var(--danger-bg)', borderColor: 'rgba(192,40,56,0.25)' } : {}}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium" style={{ color: 'var(--ink-muted)' }}>{label}</p>
              <span className="text-base">{icon}</span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold"
              style={{ color: hot && value !== '—' && value !== 0 ? 'var(--danger)' : 'var(--ink)' }}>
              {value}
            </p>
          </article>
        ))}
      </div>

      {/* Role distribution */}
      {data?.role_distribution && (
        <section className="card mt-5 p-5">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>
            Role distribution
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(data.role_distribution).map(([role, count]) => (
              <div key={role} className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <span className="font-medium capitalize" style={{ color: 'var(--ink)' }}>
                  {role.replace('_', ' ')}
                </span>
                <span className="font-bold" style={{ color: 'var(--accent)' }}>{count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Recent alerts */}
        <section className="card p-6">
          <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>Recent alerts</h2>
          <ul className="mt-4 space-y-2">
            {(data?.recent_alerts ?? []).map((a) => (
              <li key={a.id} className="rounded-2xl px-4 py-3 text-sm"
                style={{ background: 'var(--surface-2)' }}>
                <div className="flex items-center gap-2">
                  <span>{a.severity === 'critical' ? '🚨' : a.severity === 'warning' ? '⚠️' : 'ℹ️'}</span>
                  <span className="font-semibold capitalize"
                    style={{ color: a.severity === 'critical' ? 'var(--danger)' : a.severity === 'warning' ? 'var(--warn)' : 'var(--ink-muted)' }}>
                    {a.severity}
                  </span>
                  <span className="text-xs font-medium uppercase" style={{ color: 'var(--ink-muted)' }}>{a.alert_type}</span>
                  {a.acknowledged && <span className="ml-auto text-xs" style={{ color: 'var(--ink-muted)' }}>✓ acknowledged</span>}
                </div>
                <p className="mt-1" style={{ color: 'var(--ink)' }}>{a.message}</p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--ink-muted)' }}>
                  {new Date(a.created_at).toLocaleString()}
                </p>
              </li>
            ))}
            {!data?.recent_alerts?.length && (
              <li className="text-sm" style={{ color: 'var(--ink-muted)' }}>No alerts yet.</li>
            )}
          </ul>
        </section>

        <div className="flex flex-col gap-5">
          {/* Low battery */}
          <section className="card p-6">
            <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>
              Low battery <span style={{ color: 'var(--ink-muted)', fontSize: 14 }}>(≤ 20%)</span>
            </h2>
            {!data?.low_battery_devices?.length ? (
              <p className="mt-3 flex items-center gap-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
                🔋 All devices charged.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {data.low_battery_devices.map((d) => (
                  <li key={d.id} className="flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm"
                    style={{ background: 'var(--danger-bg)', border: '1px solid rgba(192,40,56,0.15)' }}>
                    <span style={{ color: 'var(--ink)' }}>⌚ {d.name}</span>
                    <span className="font-bold" style={{ color: 'var(--danger)' }}>{d.battery_level}%</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Recently seen */}
          <section className="card p-6">
            <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>Recently seen</h2>
            <ul className="mt-4 space-y-2">
              {(data?.recent_devices ?? []).map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm"
                  style={{ background: 'var(--surface-2)' }}>
                  <span style={{ color: 'var(--ink)' }}>⌚ {d.name}</span>
                  <span className="rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={{
                      background: d.status === 'active' ? 'var(--accent-bg)' : 'var(--surface-2)',
                      color: d.status === 'active' ? 'var(--accent-txt)' : 'var(--ink-muted)',
                    }}>
                    {d.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Users table */}
      <section className="card mt-5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>System users</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="input w-64 py-2 text-xs"
          />
        </div>
        {loadingUsers ? (
          <p className="mt-4 text-sm" style={{ color: 'var(--ink-muted)' }}>Loading…</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Username', 'Email', 'Role', 'Status', 'Action'].map((h) => (
                    <th key={h} className="pb-2 pr-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--ink-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-2.5 pr-4 font-medium" style={{ color: 'var(--ink)' }}>{u.username}</td>
                    <td className="py-2.5 pr-4" style={{ color: 'var(--ink-muted)' }}>{u.email}</td>
                    <td className="py-2.5 pr-4">
                      <span className="badge-muted badge capitalize">{u.role?.replace('_', ' ') ?? '—'}</span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={u.is_active ? 'badge' : 'badge-danger badge'}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <button onClick={() => toggleActive(u.id)} disabled={togglingId === u.id}
                        className="btn-ghost px-3 py-1 text-xs">
                        {togglingId === u.id ? '…' : u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
                {!users.length && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-sm" style={{ color: 'var(--ink-muted)' }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </RoleDashboardShell>
  );
}
