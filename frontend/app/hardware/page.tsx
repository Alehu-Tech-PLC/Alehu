import type { Metadata } from 'next';
import { MarketingShell } from '@/components/MarketingShell';

export const metadata: Metadata = {
  title: 'Hardware',
  description:
    'Alehu Band v1 hardware guidance: MCU, GNSS, IMU, LTE-M, battery, enclosure, and a six-week prototype sequence.',
};

const parts = [
  ['Main MCU', 'ESP32-S3 for Wi-Fi/BLE prototypes, or nRF52840 when battery life matters more.'],
  ['Cellular (field)', 'SIM7080G or Quectel BG95 LTE-M/NB-IoT with a nano-SIM for coverage without a parent phone.'],
  ['GNSS', 'Quectel L76-L or ATGM336H plus a ceramic patch antenna.'],
  ['IMU', 'Bosch BMI270 or ICM-42670-P for fall and impact patterns.'],
  ['Microphone', 'Knowles analog MEMS. Run the scream/keyword model locally. Never stream audio.'],
  ['SOS', 'Sealed tactile switch, recessed, double-press debounce in firmware.'],
  ['Battery', '400–800 mAh LiPo with protection PCB. USB-C charge via TP4056 or a BQ charger.'],
  ['Enclosure', 'IP67 TPU/PC blend, rounded, no removable small parts, skin-safe finish.'],
];

const weeks = [
  ['Weeks 1–2', 'ESP32-S3 + BMI270 + USB power. Prove fall and button events into /api/ingest/telemetry.'],
  ['Weeks 3–4', 'Add GNSS and geofence firmware. Show last-known point on the guardian dashboard.'],
  ['Weeks 5–6', 'Battery pack and enclosure mock. Measure sleep current versus alert burst.'],
  ['Week 7+', 'Swap in LTE-M. Start a 10-unit school pilot.'],
];

export default function HardwarePage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">Alehu Band v1</p>
        <h1 className="mt-3 font-display text-5xl text-navy">Hardware that stays small, safe, and quiet.</h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/75">
          Design goal: a child-safe, water-resistant wearable that classifies distress and motion on-device, then sends a tiny encrypted event. Prefer parts that are globally sourcable and already have Ethiopia-friendly LTE-M / NB-IoT options.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {parts.map(([title, body]) => (
            <article key={title} className="rounded-3xl border border-navy/10 bg-white p-6">
              <h2 className="font-display text-2xl text-navy">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/75">{body}</p>
            </article>
          ))}
        </div>
        <h2 className="mt-16 font-display text-4xl text-navy">Prototype sequence</h2>
        <ol className="mt-6 grid gap-4">
          {weeks.map(([title, body]) => (
            <li key={title} className="rounded-3xl bg-teal-soft px-6 py-5">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal">{title}</p>
              <p className="mt-2 text-navy">{body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 max-w-3xl text-sm text-ink/70">
          Compliance plan (not yet certified): IP67, toy-adjacent mechanical safety, battery UN38.3 for shipping, RF approvals as applicable, and a child-data policy with no raw media retention. Certify before paid school rollout.
        </p>
      </section>
    </MarketingShell>
  );
}
