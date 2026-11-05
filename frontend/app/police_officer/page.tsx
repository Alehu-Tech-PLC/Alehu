'use client';

import { useEffect, useState } from 'react';
import { RoleDashboardShell } from '@/components/RoleDashboardShell';
import { api } from '@/lib/api';
import { apiBase } from '@/lib/site';

const nav = [{ href: '/police_officer', label: 'Incident Board' }];

type AlertRow   = { id: number; alert_type: string; severity: string; message: string; acknowledged: boolean; device_id: number | null; created_at: string; };
type DeviceRow  = { id: number; name: string; last_latitude: number | null; last_longitude: number | null; status: string; };
type PoliceSummary = {
  counts: { total_open_alerts: number; critical_unacknowledged: number; active_sos: number; incident_devices: number; };
  critical_alerts: AlertRow[];
  sos_alerts: AlertRow[];
  incident_devices: DeviceRow[];
  pagination: { page: number; per_page: number; total: number };
};

function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('alehu_access_token');
}

export default function PoliceOfficerDashboard() {
  const [data, setData]         = useState<PoliceSummary | null>(null);
  const [error, setError]       = useState('');
  const [ackingId, setAckingId] = useState<number | null>(null);

  function load() {
    api<PoliceSummary>('/dashboard/police/summary')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }

  useEffect(() => { load(); }, []);

  async function acknowledge(alertId: number) {
    setAckingId(alertId);
    try {
      const token = getToken();
      await fetch(`${apiBase}/dashboard/police/acknowledge/${alertId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      load();
    } catch { setError('Failed to acknowledge alert'); }
    finally { setAckingId(null); }
  }

  const counts = data?.counts;

  return (
    <RoleDashboardShell
      requiredRole="police_officer"
      portalLabel="Officer portal"
      accentBg="bg-plum"
      nav={nav}
      loginPath="/police_officer/login"
    >
      <h1 className="font-display text-4xl" style={{ color: 'var(--color-ink)' }}>Incident board</h1>
      <p className="mt-1 text-sm opacity-60" style={{ color: 'var(--color-ink)' }}>
        Critical and SOS alerts requiring law-enforcement response.
      </p>

      {error && (
        <p className="mt-4 rounded-2xl bg-rose-soft px-4 py-3 text-sm text-coral">{error}</p>
      )}

      {/* Stat tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Open alerts',    value: counts?.total_open_alerts        ?? '—', hot: false },
          { label: 'Critical',       value: counts?.critical_unacknowledged  ?? '—', hot: true },
          { label: 'Active SOS',     value: counts?.active_sos               ?? '—', hot: true },
          { label: 'Incident areas', value: counts?.incident_devices         ?? '—', hot: false },
        ].map(({ label, value, hot }) => (
          <article key={label} className={`card p-5 ${hot && value !== '—' && value !== 0 ? 'border-coral/40 bg-rose-soft dark:bg-plum-dark' : ''}`}>
            <p className="text-sm opacity-60" style={{ color: 'var(--color-ink)' }}>{label}</p>
            <p className={`mt-2 font-display text-3xl ${hot && value !== '—' && value !== 0 ? 'text-coral' : ''}`}
              style={!(hot && value !== '—' && value !== 0) ? { color: 'var(--color-ink)' } : {}}>
              {value}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Critical alerts */}
        <section className="card p-6">
          <h2 className="font-display text-2xl" style={{ color: 'var(--color-ink)' }}>Critical alerts</h2>
          {!data?.critical_alerts?.length && (
            <p className="mt-4 text-sm opacity-50" style={{ color: 'var(--color-ink)' }}>No unacknowledged critical alerts.</p>
          )}
          <ul className="mt-4 space-y-3">
            {(data?.critical_alerts ?? []).map((alert) => (
              <li key={alert.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-coral/20 bg-rose-soft dark:bg-plum-dark/60 px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold uppercase text-coral">{alert.alert_type}</p>
                  <p className="mt-0.5" style={{ color: 'var(--color-ink)' }}>{alert.message}</p>
                  <p className="mt-1 text-xs opacity-40" style={{ color: 'var(--color-ink)' }}>
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => acknowledge(alert.id)} disabled={ackingId === alert.id}
                  className="btn-primary shrink-0 px-3 py-1.5 text-xs">
                  {ackingId === alert.id ? '…' : 'Acknowledge'}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-6">
          {/* SOS alerts */}
          <section className="card p-6">
            <h2 className="font-display text-2xl" style={{ color: 'var(--color-ink)' }}>SOS events</h2>
            {!data?.sos_alerts?.length && (
              <p className="mt-4 text-sm opacity-50" style={{ color: 'var(--color-ink)' }}>No active SOS events.</p>
            )}
            <ul className="mt-4 space-y-3">
              {(data?.sos_alerts ?? []).map((alert) => (
                <li key={alert.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-gold/30 bg-gold-soft dark:bg-plum-dark/60 px-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-gold">Silent SOS</p>
                    <p className="mt-0.5" style={{ color: 'var(--color-ink)' }}>{alert.message}</p>
                    <p className="mt-1 text-xs opacity-40" style={{ color: 'var(--color-ink)' }}>
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => acknowledge(alert.id)} disabled={ackingId === alert.id}
                    className="btn-primary shrink-0 px-3 py-1.5 text-xs">
                    {ackingId === alert.id ? '…' : 'Close'}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Incident device locations */}
          <section className="card p-6">
            <h2 className="font-display text-xl" style={{ color: 'var(--color-ink)' }}>Last known locations</h2>
            {!data?.incident_devices?.length && (
              <p className="mt-4 text-sm opacity-50" style={{ color: 'var(--color-ink)' }}>No devices with incidents.</p>
            )}
            <ul className="mt-4 space-y-2 text-sm">
              {(data?.incident_devices ?? []).map((device) => (
                <li key={device.id}
                  className="flex items-center justify-between rounded-2xl bg-blush-soft dark:bg-plum-dark/40 px-4 py-3">
                  <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{device.name}</span>
                  <span className="text-xs opacity-60" style={{ color: 'var(--color-ink)' }}>
                    {device.last_latitude && device.last_longitude
                      ? `${device.last_latitude.toFixed(4)}, ${device.last_longitude.toFixed(4)}`
                      : 'No GPS'}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </RoleDashboardShell>
  );
}
