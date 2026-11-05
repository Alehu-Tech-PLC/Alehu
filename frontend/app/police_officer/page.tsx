'use client';

import { useEffect, useState } from 'react';
import { RoleDashboardShell } from '@/components/RoleDashboardShell';
import { api } from '@/lib/api';
import { apiBase } from '@/lib/site';

const nav = [{ href: '/police_officer', label: 'Incident Board' }];

type AlertRow  = { id: number; alert_type: string; severity: string; message: string; acknowledged: boolean; device_id: number | null; created_at: string };
type DeviceRow = { id: number; name: string; last_latitude: number | null; last_longitude: number | null; status: string };
type PoliceSummary = {
  counts: { total_open_alerts: number; critical_unacknowledged: number; active_sos: number; incident_devices: number };
  critical_alerts: AlertRow[];
  sos_alerts: AlertRow[];
  incident_devices: DeviceRow[];
};

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('alehu_access_token');
}

export default function PoliceOfficerDashboard() {
  const [data, setData]         = useState<PoliceSummary | null>(null);
  const [error, setError]       = useState('');
  const [ackingId, setAckingId] = useState<number | null>(null);

  function load() {
    api<PoliceSummary>('/dashboard/police/summary')
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message));
  }
  useEffect(() => { load(); }, []);

  async function acknowledge(id: number) {
    setAckingId(id);
    try {
      await fetch(`${apiBase}/dashboard/police/acknowledge/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) },
      });
      load();
    } catch { setError('Failed to acknowledge alert'); }
    finally { setAckingId(null); }
  }

  const c = data?.counts;

  return (
    <RoleDashboardShell requiredRole="police_officer" portalLabel="Officer portal" nav={nav} loginPath="/police_officer/login">
      <div>
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--ink)' }}>Incident board</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
          Critical and SOS alerts requiring law-enforcement response.
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
          { label: 'Open alerts',    value: c?.total_open_alerts        ?? '—', icon: '🔔', hot: false },
          { label: 'Critical',       value: c?.critical_unacknowledged  ?? '—', icon: '🚨', hot: true },
          { label: 'Active SOS',     value: c?.active_sos               ?? '—', icon: '🆘', hot: true },
          { label: 'Incident areas', value: c?.incident_devices         ?? '—', icon: '📍', hot: false },
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
        {/* Critical alerts */}
        <section className="card p-6">
          <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>Critical alerts</h2>
          {!data?.critical_alerts?.length && (
            <p className="mt-4 flex items-center gap-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
              ✅ No unacknowledged critical alerts.
            </p>
          )}
          <ul className="mt-4 space-y-2">
            {(data?.critical_alerts ?? []).map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3 rounded-2xl px-4 py-3"
                style={{ background: 'var(--danger-bg)', border: '1px solid rgba(192,40,56,0.20)' }}>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--danger)' }}>
                    🚨 {a.alert_type}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: 'var(--ink)' }}>{a.message}</p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--ink-muted)' }}>
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => acknowledge(a.id)} disabled={ackingId === a.id}
                  className="btn shrink-0 px-3 py-1.5 text-xs">
                  {ackingId === a.id ? '…' : 'Acknowledge'}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-5">
          {/* SOS alerts */}
          <section className="card p-6">
            <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>SOS events</h2>
            {!data?.sos_alerts?.length && (
              <p className="mt-4 flex items-center gap-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
                ✅ No active SOS events.
              </p>
            )}
            <ul className="mt-4 space-y-2">
              {(data?.sos_alerts ?? []).map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 rounded-2xl px-4 py-3"
                  style={{ background: 'var(--warn-bg)', border: '1px solid rgba(201,124,32,0.20)' }}>
                  <div className="min-w-0">
                    <p className="text-xs font-bold" style={{ color: 'var(--warn)' }}>🆘 Silent SOS</p>
                    <p className="mt-1 text-sm" style={{ color: 'var(--ink)' }}>{a.message}</p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--ink-muted)' }}>
                      {new Date(a.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => acknowledge(a.id)} disabled={ackingId === a.id}
                    className="btn shrink-0 px-3 py-1.5 text-xs">
                    {ackingId === a.id ? '…' : 'Close'}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Device locations */}
          <section className="card p-6">
            <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>Last known locations</h2>
            {!data?.incident_devices?.length && (
              <p className="mt-4 text-sm" style={{ color: 'var(--ink-muted)' }}>No devices with incidents.</p>
            )}
            <ul className="mt-4 space-y-2">
              {(data?.incident_devices ?? []).map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm"
                  style={{ background: 'var(--surface-2)' }}>
                  <span className="font-medium" style={{ color: 'var(--ink)' }}>📍 {d.name}</span>
                  <span className="font-mono text-xs" style={{ color: 'var(--ink-muted)' }}>
                    {d.last_latitude && d.last_longitude
                      ? `${d.last_latitude.toFixed(4)}, ${d.last_longitude.toFixed(4)}`
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
