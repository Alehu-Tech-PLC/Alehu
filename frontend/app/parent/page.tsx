'use client';

import { useEffect, useState } from 'react';
import { RoleDashboardShell } from '@/components/RoleDashboardShell';
import { api } from '@/lib/api';

const nav = [{ href: '/parent', label: 'My Children' }];

type ParentSummary = {
  counts: { children: number; devices_online: number; open_alerts: number; critical_alerts: number };
  devices: { id: number; name: string; status: string; battery_level: number | null; last_latitude: number | null; last_longitude: number | null; last_seen: string | null }[];
  recent_alerts: { id: number; alert_type: string; severity: string; message: string; acknowledged: boolean; created_at: string }[];
};

function BatteryBar({ level }: { level: number | null }) {
  if (level === null) return <span style={{ color: 'var(--ink-muted)' }}>—</span>;
  const color = level <= 20 ? 'var(--danger)' : level <= 40 ? 'var(--warn)' : 'var(--accent)';
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 overflow-hidden rounded-full" style={{ background: 'var(--border)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${level}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{level}%</span>
    </div>
  );
}

export default function ParentDashboard() {
  const [data, setData]   = useState<ParentSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<ParentSummary>('/dashboard/parent/summary')
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message));
  }, []);

  const c = data?.counts;

  return (
    <RoleDashboardShell requiredRole="parent" portalLabel="Parent portal" nav={nav} loginPath="/parent/login">
      <div>
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--ink)' }}>My children</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
          Live status of every Alehu band linked to your account.
        </p>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm"
          style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid rgba(192,40,56,0.20)' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Wearables',   value: c?.children        ?? '—', icon: '⌚' },
          { label: 'Online now',  value: c?.devices_online  ?? '—', icon: '🟢' },
          { label: 'Open alerts', value: c?.open_alerts     ?? '—', icon: '🔔' },
          { label: 'Critical',    value: c?.critical_alerts ?? '—', icon: '🚨', hot: true },
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

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Devices */}
        <section className="card p-6">
          <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>Wearables</h2>
          {!data?.devices?.length && (
            <p className="mt-4 text-sm" style={{ color: 'var(--ink-muted)' }}>No wearables registered yet.</p>
          )}
          <ul className="mt-4 space-y-2">
            {(data?.devices ?? []).map((d) => (
              <li key={d.id} className="rounded-2xl px-4 py-3" style={{ background: 'var(--surface-2)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>⌚</span>
                    <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{d.name}</p>
                  </div>
                  <span className="rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={{
                      background: d.status === 'active' ? 'var(--accent-bg)' : 'var(--surface-2)',
                      color: d.status === 'active' ? 'var(--accent-txt)' : 'var(--ink-muted)',
                    }}>
                    {d.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs font-mono" style={{ color: 'var(--ink-muted)' }}>
                    📍 {d.last_latitude && d.last_longitude
                      ? `${d.last_latitude.toFixed(4)}, ${d.last_longitude.toFixed(4)}`
                      : 'No GPS yet'}
                  </p>
                  <BatteryBar level={d.battery_level} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Alerts */}
        <section className="card p-6">
          <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>Alerts for you</h2>
          {!data?.recent_alerts?.length && (
            <p className="mt-4 flex items-center gap-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
              <span>✅</span> No open alerts — all clear.
            </p>
          )}
          <ul className="mt-4 space-y-2">
            {(data?.recent_alerts ?? []).map((a) => (
              <li key={a.id} className="rounded-2xl px-4 py-3 text-sm"
                style={{
                  background: a.severity === 'critical' ? 'var(--danger-bg)' : a.severity === 'warning' ? 'var(--warn-bg)' : 'var(--surface-2)',
                  border: `1px solid ${a.severity === 'critical' ? 'rgba(192,40,56,0.20)' : a.severity === 'warning' ? 'rgba(201,124,32,0.20)' : 'var(--border)'}`,
                }}>
                <div className="flex items-center gap-2">
                  <span>{a.severity === 'critical' ? '🚨' : a.severity === 'warning' ? '⚠️' : 'ℹ️'}</span>
                  <span className="font-semibold capitalize"
                    style={{ color: a.severity === 'critical' ? 'var(--danger)' : a.severity === 'warning' ? 'var(--warn)' : 'var(--ink-muted)' }}>
                    {a.severity}
                  </span>
                </div>
                <p className="mt-1" style={{ color: 'var(--ink)' }}>{a.message}</p>
                <p className="mt-1 text-xs" style={{ color: 'var(--ink-muted)' }}>
                  {new Date(a.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </RoleDashboardShell>
  );
}
