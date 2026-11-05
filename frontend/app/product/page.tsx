import type { Metadata } from 'next';
import { MarketingShell } from '@/components/MarketingShell';
import { AlehuWatchHero } from '@/components/illustrations/AlehuWatchHero';
import { WearableLineup } from '@/components/illustrations/WearableLineup';

export const metadata: Metadata = {
  title: 'Product',
  description: 'Alehu Band wearable — distress AI, geofencing, fall detection, silent SOS, 5-day battery.',
};

const modules = [
  { icon: '🎙️', title: 'Distress Acoustic AI',  tech: 'Recognizes screams, impact sounds, and distress keywords locally on the MCU.', benefit: 'Immediate alerts without network lag — works offline.' },
  { icon: '📍', title: 'Smart Geofencing',       tech: 'Dynamic safe-zone boundaries with predictive route deviation detection.', benefit: 'Wander-off warning before a child is far from safety.' },
  { icon: '⬇️', title: 'Fall & Impact',          tech: '3-axis accelerometer and gyroscope pattern matching for sudden drops.', benefit: 'Automated alert sent during accidents — no button press needed.' },
  { icon: '🆘', title: 'Silent SOS',             tech: 'Recessed tactile double-press button, debounced in firmware.', benefit: 'Discreet emergency activation a child can trigger quietly.' },
  { icon: '🔋', title: 'Extended Battery',        tech: 'Ultra-low power MCU + aggressive sleep scheduling.', benefit: 'Up to 5 days of active protection per charge.' },
  { icon: '📣', title: 'Multi-Guardian Mesh',    tech: 'Broadcasts to parents, school staff, or local security on high-urgency alerts.', benefit: 'The right people are reached together, simultaneously.' },
];

export default function ProductPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2">
          <div>
            <p className="section-label">Alehu Band · Phase 1</p>
            <h1 className="mt-4 font-display text-5xl" style={{ color: 'var(--ink)' }}>
              The gadget that stays quiet{' '}
              <span style={{ color: 'var(--accent)' }}>until it must speak.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
              Adaptive context awareness learns a child's daily routine so unexpected movement or
              noise raises a signal — not a flood of false alarms.
            </p>
          </div>
          <div className="flex justify-center">
            <AlehuWatchHero className="w-full max-w-xs" />
          </div>
        </div>
      </section>

      {/* Modules grid */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="section-label">What's inside</p>
        <h2 className="mt-3 font-display text-3xl" style={{ color: 'var(--ink)' }}>Six layers of protection</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {modules.map((m) => (
            <article key={m.title} className="card flex gap-5 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                style={{ background: 'var(--accent-bg)' }}>
                {m.icon}
              </div>
              <div>
                <h3 className="font-display text-xl" style={{ color: 'var(--ink)' }}>{m.title}</h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--ink-muted)' }}>{m.tech}</p>
                <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--accent-txt)' }}>→ {m.benefit}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Wearable lineup */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="section-label">Product roadmap</p>
          <h2 className="mt-3 font-display text-3xl" style={{ color: 'var(--ink)' }}>Every form factor, one platform</h2>
          <p className="mt-3 max-w-2xl text-base" style={{ color: 'var(--ink-muted)' }}>
            Phase 1 is the wristband. Future phases bring the same protection to bracelets,
            necklace pendants, and rings.
          </p>
          <WearableLineup className="mt-10 w-full" />
        </div>
      </section>
    </MarketingShell>
  );
}
