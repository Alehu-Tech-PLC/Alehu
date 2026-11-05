'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { api, DashboardSummary } from '@/lib/api';

export default function DashboardPage() {
  const [data, setData]   = useState<DashboardSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<DashboardSummary>('/dashboard/summary')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }, []);

  const counts = data?.counts;

  return (
    <DashboardShell>
      <h1 className="font-display text-4xl" style={{ color: 'var(--color-ink)' }}>
        Today's safety picture
      </h1>

      {error && (
        <p className="mt-4 rounded-2xl bg-rose-soft px-4 py-3 text-sm text-coral">
          {error} — Start the Flask API on port 5000, then refresh.
        </p>
      )}

      {/* Stat tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Wearables',   value: counts?.devices           ?? '—' },
          { label: 'Online',      value: counts?.devices_online    ?? '—' },
          { label: 'Guardians',   value: counts?.customers         ?? '—' },
          { label: 'Open alerts', value: counts?.alerts_open       ?? '—' },
          { label: 'Critical',    value: counts?.alerts_critical   ?? '—' },
        ].map(({ label, value }) => (
          <article key={label} className="card p-5">
            <p className="text-sm opacity-60" style={{ color: 'var(--color-ink)' }}>{label}</p>
            <p className="mt-2 font-display text-3xl" style={{ color: 'var(--color-ink)' }}>{value}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent alerts */}
        <section className="card p-6">
          <h2 className="font-display text-2xl" style={{ color: 'var(--color-ink)' }}>Recent alerts</h2>
          <ul className="mt-4 space-y-3">
            {(data?.recent_alerts ?? []).map((alert) => (
              <li key={alert.id} className="rounded-2xl bg-blush-soft dark:bg-plum-dark/40 px-4 py-3 text-sm">
                <span className={`mr-2 font-semibold ${alert.severity === 'critical' ? 'text-coral' : 'text-gold'}`}>
                  {alert.severity}
                </span>
                <span style={{ color: 'var(--color-ink)' }}>{alert.message}</span>
              </li>
            ))}
            {!data?.recent_alerts?.length && (
              <li className="text-sm opacity-50" style={{ color: 'var(--color-ink)' }}>No alerts yet.</li>
            )}
          </ul>
        </section>

        {/* Device GPS */}
        <section className="card p-6">
          <h2 className="font-display text-2xl" style={{ color: 'var(--color-ink)' }}>
            Wearable last known points
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {(data?.devices ?? []).map((device) => (
              <li key={device.id}
                className="flex items-center justify-between rounded-2xl bg-blush-soft dark:bg-plum-dark/40 px-4 py-3">
                <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{device.name}</span>
                <span className="opacity-60" style={{ color: 'var(--color-ink)' }}>
                  {device.last_latitude && device.last_longitude
                    ? `${device.last_latitude.toFixed(3)}, ${device.last_longitude.toFixed(3)}`
                    : 'No GPS yet'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardShell>
  );
}
