import type { Metadata } from 'next';
import { MarketingShell } from '@/components/MarketingShell';
import { SafetyLoopDiagram } from '@/components/illustrations/SafetyLoopDiagram';
import { ChildrenScene } from '@/components/illustrations/ChildrenScene';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'From wearable sensors to edge AI to the guardian dashboard — the Alehu safety loop.',
};

const steps = [
  { icon: '⌚', step: '01', title: 'Wearable senses',
    body: 'Biometrics, GPS, motion, and acoustic cues are captured on the band. No camera. No always-on cloud mic.' },
  { icon: '🧠', step: '02', title: 'Edge AI decides',
    body: 'On-device models classify fall, distress, SOS, and geofence events in milliseconds — even with weak connectivity.' },
  { icon: '📡', step: '03', title: 'Encrypted ping',
    body: 'Only compact telemetry and alert metadata leave the device. Raw audio and images never leave the gadget.' },
  { icon: '🔔', step: '04', title: 'Guardians act',
    body: 'Parents, schools, or a trusted mesh receive location, severity, and a one-tap acknowledge workflow.' },
];

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="section-label">The safety loop</p>
        <h1 className="mt-4 font-display text-5xl" style={{ color: 'var(--ink)' }}>
          Four beats. One unbroken loop.
        </h1>
        <p className="mt-4 max-w-2xl text-lg" style={{ color: 'var(--ink-muted)' }}>
          Every alert travels through the same four-step pipeline — on-device, encrypted, and
          reaching the right people within seconds.
        </p>

        {/* Loop diagram */}
        <SafetyLoopDiagram className="mt-12 w-full" />

        {/* Step cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {steps.map((s) => (
            <article key={s.title} className="card flex gap-5 p-7">
              <div>
                <span className="section-label">{s.step}</span>
                <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                  style={{ background: 'var(--accent-bg)' }}>
                  {s.icon}
                </div>
              </div>
              <div>
                <h2 className="font-display text-2xl" style={{ color: 'var(--ink)' }}>{s.title}</h2>
                <p className="mt-2 text-sm leading-6" style={{ color: 'var(--ink-muted)' }}>{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Children scene */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <ChildrenScene className="w-full max-w-md mx-auto order-2 md:order-1" />
            <div className="order-1 md:order-2">
              <p className="section-label">Always watching. Never intrusive.</p>
              <h2 className="mt-4 font-display text-3xl" style={{ color: 'var(--ink)' }}>
                The band works so parents don't have to worry.
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
                Children wear the Alehu band like any other accessory. Guardians check the
                dashboard only when something matters — because the band handles everything else
                silently in the background.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
