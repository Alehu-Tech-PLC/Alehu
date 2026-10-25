import type { Metadata } from 'next';
import { MarketingShell } from '@/components/MarketingShell';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'From wearable sensors to edge AI to the guardian dashboard — the Alehu safety loop.',
};

const steps = [
  { title: 'Wearable senses', body: 'Biometrics, GPS, motion, and acoustic cues are captured on the band. No camera. No always-on cloud mic.' },
  { title: 'Edge AI decides', body: 'On-device models classify fall, distress, SOS, and geofence events in milliseconds, even with weak connectivity.' },
  { title: 'Encrypted ping', body: 'Only compact telemetry and alert metadata leave the device. Raw audio and images never leave the gadget.' },
  { title: 'Guardians act', body: 'Parents, schools, or a trusted mesh receive location, severity, and a one-tap acknowledge workflow.' },
];

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-display text-5xl text-navy">Four beats. One safety loop.</h1>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-3xl bg-white p-7 shadow-card">
              <p className="text-sm font-semibold text-amber">0{index + 1}</p>
              <h2 className="mt-2 font-display text-3xl text-navy">{step.title}</h2>
              <p className="mt-3 text-ink/75">{step.body}</p>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
