import Link from 'next/link';
import { MarketingShell } from '@/components/MarketingShell';
import { AlehuWatchHero } from '@/components/illustrations/AlehuWatchHero';
import { ChildrenScene } from '@/components/illustrations/ChildrenScene';
import { WearableLineup } from '@/components/illustrations/WearableLineup';
import { site } from '@/lib/site';

const metrics = [
  { value: '<1.2s', label: 'Alert latency' },
  { value: '99.4%', label: 'AI accuracy' },
  { value: '24 / 7', label: 'Active protection' },
  { value: '100%',  label: 'Encrypted telemetry' },
];

const pillars = [
  { title: 'Proactive protection',
    body:  'Shift from passive tracking to on-device threat assessment. The band listens for distress, impact, and route deviation locally — no cloud required.' },
  { title: 'Privacy first',
    body:  'Zero raw audio or image storage. Edge inference keeps a child\'s world private while still reaching a guardian in time.' },
  { title: 'Seamless utility',
    body:  'Long battery life, water-resistant child-proof design, and a calm parent dashboard instead of a noisy surveillance feed.' },
];

const portals = [
  { href: '/parent/login',         title: 'Parent portal',
    desc: "Live location, battery, and alerts for your child's Alehu band in one calm view.",
    badge: 'For families' },
  { href: '/police_officer/login', title: 'Officer portal',
    desc: 'Critical alerts and SOS events with GPS coordinates ready for rapid dispatch.',
    badge: 'Law enforcement' },
  { href: '/admin/login',          title: 'Admin portal',
    desc: 'Manage users, review fleet health, and maintain full platform visibility.',
    badge: 'Alehu staff' },
];

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: 'Alehu Band', brand: site.legalName,
    description: site.description, category: 'Child safety wearable',
  };

  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 80% 20%, var(--accent-bg), transparent 70%)' }} />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          {/* Copy */}
          <div>
            <p className="section-label">{site.legalName}</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.1] md:text-6xl" style={{ color: 'var(--ink)' }}>
              Safety that protects freedom,{' '}
              <span style={{ color: 'var(--accent)' }}>not just location.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
              Alehu Technologies combines a non-intrusive wearable with edge AI so parents and
              schools get instant alerts — without turning childhood into a camera feed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn px-7 py-3 text-base">Start a school pilot</Link>
              <Link href="/product" className="btn-ghost px-7 py-3 text-base">See the gadget</Link>
            </div>
            {/* Metrics row */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.label}>
                  <p className="font-display text-2xl font-bold" style={{ color: 'var(--accent)' }}>{m.value}</p>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--ink-muted)' }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero watch illustration */}
          <div className="flex justify-center">
            <AlehuWatchHero className="w-full max-w-xs drop-shadow-2xl md:max-w-sm" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CHILDREN SCENE — "Real families, real safety"
      ══════════════════════════════════════════ */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="section-label">Real families, real safety</p>
              <h2 className="mt-4 font-display text-4xl" style={{ color: 'var(--ink)' }}>
                Children protected.<br/>Parents at peace.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
                Whether at school, a daycare, or walking home — every Alehu band keeps a child
                connected to the people who love them, without being intrusive.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'On-device AI — no raw audio ever leaves the band',
                  'Instant silent SOS for discreet emergencies',
                  'Geofence alerts before a child wanders far',
                  'Law-enforcement escalation in one tap',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--ink-muted)' }}>
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                      style={{ background: 'var(--accent)' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <ChildrenScene className="w-full max-w-md mx-auto" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WEARABLE LINEUP
      ══════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="section-label">Product roadmap</p>
        <h2 className="mt-3 font-display text-4xl" style={{ color: 'var(--ink)' }}>
          One platform. Every form factor.
        </h2>
        <p className="mt-4 max-w-2xl text-base" style={{ color: 'var(--ink-muted)' }}>
          Phase 1 launches with the Alehu smart wristband. Future phases bring the same safety
          intelligence to bracelets, necklace pendants, and rings — so every child finds a
          comfortable fit.
        </p>
        <WearableLineup className="mt-10 w-full" />
      </section>

      {/* ══════════════════════════════════════════
          PILLARS
      ══════════════════════════════════════════ */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="section-label">Why Alehu</p>
          <h2 className="mt-3 font-display text-4xl" style={{ color: 'var(--ink)' }}>
            An unbroken safety umbrella
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pillars.map((p) => (
              <article key={p.title} className="card p-7">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl"
                  style={{ background: 'var(--accent-bg)' }}>
                  <span style={{ color: 'var(--accent)', fontSize: 20 }}>
                    {p.title === 'Proactive protection' ? '🛡️' : p.title === 'Privacy first' ? '🔒' : '⚡'}
                  </span>
                </div>
                <h3 className="font-display text-xl" style={{ color: 'var(--ink)' }}>{p.title}</h3>
                <p className="mt-3 text-sm leading-6" style={{ color: 'var(--ink-muted)' }}>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DARK BAND — modules
      ══════════════════════════════════════════ */}
      <section style={{ background: 'var(--ink)', color: '#fff' }} className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
            On the band
          </p>
          <h2 className="mt-3 font-display text-4xl text-white">Quiet until it must speak.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['🎙️', 'Distress Acoustic AI', 'Scream & keyword triggers — entirely on-device.'],
              ['📍', 'Smart Geofencing',     'Wander-off warnings before it is too late.'],
              ['⬇️', 'Fall & Impact',        'IMU patterns raise an automated accident alert.'],
              ['🆘', 'Silent SOS',           'Recessed double-press for discreet emergencies.'],
            ].map(([icon, title, body]) => (
              <article key={title as string} className="rounded-3xl p-5"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
                <span className="text-2xl">{icon}</span>
                <h3 className="mt-3 font-display text-lg text-white">{title as string}</h3>
                <p className="mt-2 text-sm leading-5" style={{ color: 'rgba(255,255,255,0.60)' }}>{body as string}</p>
              </article>
            ))}
          </div>
          <Link href="/hardware" className="btn mt-8 inline-flex">Hardware starting kit →</Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PORTALS
      ══════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="section-label">Secure portals</p>
        <h2 className="mt-3 font-display text-4xl" style={{ color: 'var(--ink)' }}>
          Access your dashboard
        </h2>
        <p className="mt-4 max-w-2xl text-base" style={{ color: 'var(--ink-muted)' }}>
          Every stakeholder has a dedicated, role-gated view built for their specific tasks.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {portals.map((p) => (
            <Link key={p.href} href={p.href}
              className="card group flex flex-col p-6 transition-all hover:-translate-y-1"
              style={{ boxShadow: '0 2px 16px var(--shadow)' }}>
              <span className="badge self-start">{p.badge}</span>
              <h3 className="mt-4 font-display text-2xl" style={{ color: 'var(--ink)' }}>{p.title}</h3>
              <p className="mt-2 grow text-sm leading-6" style={{ color: 'var(--ink-muted)' }}>{p.desc}</p>
              <span className="mt-5 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                Sign in →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="overflow-hidden rounded-[2rem] px-8 py-12 md:px-14"
          style={{ background: 'var(--accent)', position: 'relative' }}>
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full"
            style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="pointer-events-none absolute -bottom-10 right-32 h-40 w-40 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="relative">
            <h2 className="font-display text-4xl text-white">Ready for a careful school pilot?</h2>
            <p className="mt-4 max-w-2xl text-base" style={{ color: 'rgba(255,255,255,0.80)' }}>
              We start with urban parents, primary schools, and daycare centers in Addis Ababa.
              Ten units, clear privacy rules, and a guardian dashboard your staff can actually use.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact"
                className="inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'var(--ink)', color: '#fff' }}>
                Talk to the team
              </Link>
              <Link href="/how-it-works"
                className="inline-flex items-center rounded-full border px-7 py-3 text-sm font-semibold transition-all hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.40)', color: '#fff' }}>
                See the safety loop
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
