'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { AlertItem, api } from '@/lib/api';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  function load() {
    api<{ alerts: AlertItem[] }>('/alerts?per_page=50').then((result) => setAlerts(result.data.alerts));
  }

  useEffect(() => {
    load();
  }, []);

  async function acknowledge(id: number) {
    await api(`/alerts/${id}/acknowledge`, { method: 'POST' });
    load();
  }

  return (
    <DashboardShell>
      <h1 className="font-display text-4xl text-navy">Alerts</h1>
      <div className="mt-6 grid gap-4">
        {alerts.map((alert) => (
          <article key={alert.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-5 shadow-card">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-navy/50">
                {alert.alert_type} · {alert.severity}
              </p>
              <p className="mt-1 text-navy">{alert.message}</p>
            </div>
            {alert.acknowledged ? (
              <span className="text-sm text-teal">Acknowledged</span>
            ) : (
              <button onClick={() => acknowledge(alert.id)} className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-cream">
                Acknowledge
              </button>
            )}
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
