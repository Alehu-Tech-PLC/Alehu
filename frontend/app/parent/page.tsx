'use client';

import { useEffect, useState } from 'react';
import { RoleDashboardShell } from '@/components/RoleDashboardShell';
import { api } from '@/lib/api';

const nav = [{ href: '/parent', label: 'My Children' }];

type ParentSummary = {
  counts: { children: number; devices_online: number; open_alerts: number; critical_alerts: number };
  devices: {
    id: number; name: string; status: string;
    battery_level: number | null; last_latitude: number | null;
    last_longitude: number | null; last_seen: string | null;
  }[];
  recent_alerts: {
    id: number; alert_type: string; severity: string;
    message: string; acknowledged: boolean; created_at: string;
  }[];
};

function batteryColour(level: number | null) {
  if (level === null) return 'opacity-40';
  if (level <= 20)    return 'text-coral font-semibold';
  if (level <= 40)    return 'text-gold';
  return 'text-sage';
}

export default function ParentDashboard() {
  const [data, setData]   = useState<ParentSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<ParentSummary>('/dashboard/parent/summary')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }, []);

  const counts = data?.counts;

  return (
    <RoleDashboardShell
      requiredRole="parent"
      portalLabel="Parent portal"
      accentBg="bg-rose"
      nav={nav}
      loginPath="/parent/login"
    >
      <h1 className="font-display text-4xl" style={{ color: 'var(--color-ink)' }}>My children</h1>
      <p className="mt-1 text-sm opacity-60" style={{ color: 'var(--color-ink)' }}>
        Live status of every Alehu band linked to your account.
      </p>

      {error && (
        <p className="mt-4 rounded-2xl bg-rose-soft px-4 py-3 text-sm text-coral">
          {error} — make sure the Flask API is running on port 5000.
        </p>
      )}

      {/* Stat tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Wearables',    value: counts?.children       ?? '—' },
          { label: 'Online now',   value: counts?.devices_online ?? '—' },
          { label: 'Open alerts',  value: counts?.open_alerts    ?? '—' },
          { label: 'Critical',     value: counts?.critical_alerts ?? '—' },
        ].map(({ label, value }) => (
          <article key={label} className="card p-5">
            <p className="text-sm opacity-60" style={{ color: 'var(--color-ink)' }}>{label}</p>
            <p className="mt-2 font-display text-3xl" style={{ color: 'var(--color-ink)' }}>{value}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Device cards */}
        <section className="card p-6">
          <h2 className="font-display text-2xl" style={{ color: 'var(--color-ink)' }}>Wearables</h2>
          {!data?.devices?.length && (
            <p className="mt-4 text-sm opacity-50" style={{ color: 'var(--color-ink)' }}>
              No wearables registered yet.
            </p>
          )}
          <ul className="mt-4 space-y-3">
            {(data?.devices ?? []).map((device) => (
              <li key={device.id}
                className="flex items-center justify-between rounded-2xl bg-blush-soft dark:bg-plum-dark/40 px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-ink)' }}>{device.name}</p>
                  <p className="mt-0.5 opacity-60 text-xs" style={{ color: 'var(--color-ink)' }}>
                    {device.last_latitude && device.last_longitude
                      ? `${device.last_latitude.toFixed(4)}, ${device.last_longitude.toFixed(4)}`
                      : 'No GPS yet'}
                  </p>
                </div>
                <div className="text-right">
                  <p className={batteryColour(device.battery_level)}>
                    {device.battery_level !== null ? `${device.battery_level}%` : '—'}
                  </p>
                  <p className={`mt-0.5 text-xs ${device.status === 'active' ? 'text-sage' : 'opacity-40'}`}
                    style={device.status !== 'active' ? { color: 'var(--color-ink)' } : {}}>
                    {device.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent alerts */}
        <section className="card p-6">
          <h2 className="font-display text-2xl" style={{ color: 'var(--color-ink)' }}>Alerts for you</h2>
          {!data?.recent_alerts?.length && (
            <p className="mt-4 text-sm opacity-50" style={{ color: 'var(--color-ink)' }}>
              No open alerts — all clear.
            </p>
          )}
          <ul className="mt-4 space-y-3">
            {(data?.recent_alerts ?? []).map((alert) => (
              <li key={alert.id}
                className="rounded-2xl bg-blush-soft dark:bg-plum-dark/40 px-4 py-3 text-sm">
                <span className={`mr-2 font-semibold capitalize ${
                  alert.severity === 'critical' ? 'text-coral' : 'text-gold'
                }`}>
                  {alert.severity}
                </span>
                <span style={{ color: 'var(--color-ink)' }}>{alert.message}</span>
                <p className="mt-1 text-xs opacity-40" style={{ color: 'var(--color-ink)' }}>
                  {new Date(alert.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </RoleDashboardShell>
  );
}
