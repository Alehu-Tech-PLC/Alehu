'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { api, DashboardSummary } from '@/lib/api';

export default function DashboardPage() {
  const [data, setData]   = useState<DashboardSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<DashboardSummary>('/dashboard/summary')
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message));
  }, []);

  const c = data?.counts;

  const tiles = [
    { label: 'Wearables',   value: c?.devices           ?? '—', icon: '⌚' },
    { label: 'Online',      value: c?.devices_online    ?? '—', icon: '🟢' },
    { label: 'Guardians',   value: c?.customers         ?? '—', icon: '👨‍👩‍👧' },
    { label: 'Open alerts', value: c?.alerts_open       ?? '—', icon: '🔔' },
    { label: 'Critical',    value: c?.alerts_critical   ?? '—', icon: '🚨', hot: true },
  ];

  return (
    <DashboardShell>
      {/* Page header */}
      <div>
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--ink)' }}>
          Today's safety picture
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
          Live overview across all wearables and guardians.
        </p>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm"
          style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid rgba(192,40,56,0.20)' }}>
          <span>⚠️</span> {error} — Start the Flask API on port 5000.
        </div>
      )}

      {/* Stat tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {tiles.map(({ label, value, icon, hot }) => (
          <article key={label} className="stat-tile"
            style={hot && value !== '—' && value !== 0
              ? { background: 'var(--danger-bg)', borderColor: 'rgba(192,40,56,0.25)' }
              : {}}>
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
        {/* Recent alerts */}
        <section className="card p-6">
          <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>Recent alerts</h2>
          <ul className="mt-4 space-y-2">
            {(data?.recent_alerts ?? []).map((alert) => (
              <li key={alert.id} className="flex items-start gap-3 rounded-2xl px-4 py-3 text-sm"
                style={{ background: 'var(--surface-2)' }}>
                <span className="mt-0.5 shrink-0 text-base">
                  {alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <div>
                  <span className="font-semibold"
                    style={{ color: alert.severity === 'critical' ? 'var(--danger)' : alert.severity === 'warning' ? 'var(--warn)' : 'var(--ink-muted)' }}>
                    {alert.severity}
                  </span>
                  <span className="ml-2" style={{ color: 'var(--ink)' }}>{alert.message}</span>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--ink-muted)' }}>
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
            {!data?.recent_alerts?.length && (
              <li className="py-4 text-center text-sm" style={{ color: 'var(--ink-muted)' }}>No alerts yet.</li>
            )}
          </ul>
        </section>

        {/* Device GPS */}
        <section className="card p-6">
          <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>
            Wearable last known points
          </h2>
          <ul className="mt-4 space-y-2">
            {(data?.devices ?? []).map((device) => (
              <li key={device.id}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm"
                style={{ background: 'var(--surface-2)' }}>
                <div className="flex items-center gap-2">
                  <span>⌚</span>
                  <span className="font-medium" style={{ color: 'var(--ink)' }}>{device.name}</span>
                </div>
                <span className="font-mono text-xs" style={{ color: 'var(--ink-muted)' }}>
                  {device.last_latitude && device.last_longitude
                    ? `${device.last_latitude.toFixed(4)}, ${device.last_longitude.toFixed(4)}`
                    : 'No GPS'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardShell>
  );
}
