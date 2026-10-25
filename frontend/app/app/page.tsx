'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { api, DashboardSummary } from '@/lib/api';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<DashboardSummary>('/dashboard/summary')
      .then((result) => setData(result.data))
      .catch((err) => setError(err.message));
  }, []);

  const counts = data?.counts;

  return (
    <DashboardShell>
      <h1 className="font-display text-4xl text-navy">Today’s safety picture</h1>
      {error && <p className="mt-4 text-coral">{error}. Start the Flask API on port 5000, then refresh.</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Wearables', counts?.devices ?? '—'],
          ['Online', counts?.devices_online ?? '—'],
          ['Guardians', counts?.customers ?? '—'],
          ['Open alerts', counts?.alerts_open ?? '—'],
          ['Critical', counts?.alerts_critical ?? '—'],
        ].map(([label, value]) => (
          <article key={label} className="rounded-3xl bg-white p-5 shadow-card">
            <p className="text-sm text-navy/60">{label}</p>
            <p className="mt-2 font-display text-3xl text-navy">{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="font-display text-2xl text-navy">Recent alerts</h2>
          <ul className="mt-4 space-y-3">
            {(data?.recent_alerts || []).map((alert) => (
              <li key={alert.id} className="rounded-2xl bg-cream px-4 py-3 text-sm">
                <span className={`mr-2 font-semibold ${alert.severity === 'critical' ? 'text-coral' : 'text-amber'}`}>
                  {alert.severity}
                </span>
                {alert.message}
              </li>
            ))}
            {!data?.recent_alerts?.length && <li className="text-sm text-navy/60">No alerts yet.</li>}
          </ul>
        </section>
        <section className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="font-display text-2xl text-navy">Wearable last known points</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {(data?.devices || []).map((device) => (
              <li key={device.id} className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
                <span>{device.name}</span>
                <span className="text-navy/60">
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
