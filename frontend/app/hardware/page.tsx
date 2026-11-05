import type { Metadata } from 'next';
import { MarketingShell } from '@/components/MarketingShell';
import { AlehuWatchHero } from '@/components/illustrations/AlehuWatchHero';

export const metadata: Metadata = {
  title: 'Hardware',
  description: 'Alehu Band v1 hardware: MCU, GNSS, IMU, LTE-M, battery, enclosure and prototype sequence.',
};

const parts = [
  { icon: '💻', title: 'Main MCU',       body: 'ESP32-S3 for Wi-Fi/BLE prototypes, or nRF52840 when battery life matters most.' },
  { icon: '📶', title: 'Cellular',       body: 'SIM7080G or Quectel BG95 LTE-M/NB-IoT with a nano-SIM for coverage without a parent phone nearby.' },
  { icon: '🛰️', title: 'GNSS',          body: 'Quectel L76-L or ATGM336H plus a ceramic patch antenna.' },
  { icon: '📐', title: 'IMU',           body: 'Bosch BMI270 or ICM-42670-P for fall and impact pattern recognition.' },
  { icon: '🎙️', title: 'Microphone',   body: 'Knowles analog MEMS. Inference runs locally — audio never streams to the cloud.' },
  { icon: '🆘', title: 'SOS Button',    body: 'Sealed tactile switch, recessed, double-press debounce in firmware.' },
  { icon: '🔋', title: 'Battery',       body: '400–800 mAh LiPo with protection PCB. USB-C charge via TP4056 or BQ charger series.' },
  { icon: '🛡️', title: 'Enclosure',    body: 'IP67 TPU/PC blend, rounded, no removable small parts, skin-safe matte finish.' },
];

const weeks = [
  { label: 'Weeks 1–2', body: 'ESP32-S3 + BMI270 + USB power. Prove fall and button events reach /api/ingest/telemetry.' },
  { label: 'Weeks 3–4', body: 'Add GNSS and geofence firmware. Show last-known point on the guardian dashboard.' },
  { label: 'Weeks 5–6', body: 'Battery pack and enclosure mock. Measure sleep current vs alert burst.' },
  { label: 'Week 7+',   body: 'Swap in LTE-M. Start a 10-unit school pilot in Addis Ababa.' },
];

export default function HardwarePage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2">
          <div>
            <p className="section-label">Alehu Band v1</p>
            <h1 className="mt-4 font-display text-5xl" style={{ color: 'var(--ink)' }}>
              Hardware that stays{' '}
              <span style={{ color: 'var(--accent)' }}>small, safe, and quiet.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
              Design goal: a child-safe, water-resistant wearable that classifies distress and
              motion on-device, then sends a tiny encrypted event. Built from globally sourceable,
              Ethiopia-friendly parts.
            </p>
          </div>
          <div className="flex justify-center">
            <AlehuWatchHero className="w-full max-w-xs" />
          </div>
        </div>
      </section>

      {/* BOM */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="section-label">Bill of materials</p>
        <h2 className="mt-3 font-display text-3xl" style={{ color: 'var(--ink)' }}>Components</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {parts.map((p) => (
            <article key={p.title} className="card flex gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                style={{ background: 'var(--accent-bg)' }}>
                {p.icon}
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--ink)' }}>{p.title}</h3>
                <p className="mt-1 text-sm leading-5" style={{ color: 'var(--ink-muted)' }}>{p.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Prototype sequence */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="section-label">Build timeline</p>
          <h2 className="mt-3 font-display text-3xl" style={{ color: 'var(--ink)' }}>Prototype sequence</h2>
          <ol className="mt-8 grid gap-4">
            {weeks.map((w, i) => (
              <li key={w.label} className="flex gap-5 rounded-3xl p-5"
                style={{ background: i === 0 ? 'var(--accent-bg)' : 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: 'var(--accent)' }}>
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--accent-txt)' }}>{w.label}</p>
                  <p className="mt-0.5 text-sm" style={{ color: 'var(--ink-muted)' }}>{w.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl rounded-2xl p-4 text-sm leading-6"
            style={{ background: 'var(--surface-2)', color: 'var(--ink-muted)', border: '1px solid var(--border)' }}>
            Compliance plan (not yet certified): IP67, toy-adjacent mechanical safety, battery
            UN38.3 for shipping, RF approvals as applicable, and a child-data policy with no raw
            media retention. Certify before paid school rollout.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
