import type { Metadata } from 'next';
import { MarketingShell } from '@/components/MarketingShell';

export const metadata: Metadata = {
  title: 'Product',
  description: 'Alehu Band wearable modules: distress AI, geofencing, fall detection, silent SOS, and multi-day battery.',
};

const modules = [
  ['Distress Acoustic AI', 'Recognizes screams, impact sounds, and distress keywords locally.', 'Immediate triggers without network lag.'],
  ['Smart Geofencing', 'Dynamic safe-zone boundaries with predictive route deviation alerts.', 'Prevents wander-off early.'],
  ['Impact & Fall Detection', '3-axis accelerometer and gyroscope pattern matching for sudden drops.', 'Automated alert during accidents.'],
  ['Silent SOS', 'Tactile double-press hidden physical button on the casing.', 'Discreet emergency activation for the child.'],
  ['Extended Battery', 'Ultra-low power MCU with up to 5 days of active life.', 'Reliable multi-day continuous usage.'],
  ['Multi-Guardian Mesh', 'Broadcasts to parents, school staff, or local security in high-urgency cases.', 'The right people are reached together.'],
];

export default function ProductPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">Alehu Band</p>
        <h1 className="mt-3 font-display text-5xl text-navy">The gadget that stays quiet until it must speak.</h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/75">
          Adaptive context awareness learns a child’s daily routine so unexpected movement or noise raises a signal, not a flood of false alarms.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {modules.map(([title, tech, benefit]) => (
            <article key={title} className="rounded-3xl border border-navy/10 bg-white p-6">
              <h2 className="font-display text-2xl text-navy">{title}</h2>
              <p className="mt-2 text-sm text-ink/80">{tech}</p>
              <p className="mt-3 text-sm font-semibold text-teal">{benefit}</p>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
