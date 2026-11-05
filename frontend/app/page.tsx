import Link from 'next/link';
import { MarketingShell } from '@/components/MarketingShell';
import { site } from '@/lib/site';

function PortalCard({
  href,
  title,
  description,
  badge,
  badgeColour,
}: {
  href: string;
  title: string;
  description: string;
  badge: string;
  badgeColour: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-3xl bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
    >
      <span className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${badgeColour}`}>
        {badge}
      </span>
      <h3 className="mt-4 font-display text-2xl text-navy">{title}</h3>
      <p className="mt-2 grow text-sm leading-6 text-ink/75">{description}</p>
      <span className="mt-4 text-sm font-semibold text-teal group-hover:underline">
        Sign in →
      </span>
    </Link>
  );
}

const metrics = [
  { value: '<1.2s', label: 'Alert latency' },
  { value: '99.4%', label: 'AI detection accuracy' },
  { value: '24/7', label: 'Active protection' },
  { value: '100%', label: 'Encrypted telemetry' },
];

const pillars = [
  {
    title: 'Proactive protection',
    body: 'Shift from passive tracking to on-device threat assessment. The band listens for distress, impact, and route deviation locally.',
  },
  {
    title: 'Privacy first',
    body: 'Zero raw audio or image storage. Edge inference keeps a child’s world private while still reaching a guardian in time.',
  },
  {
    title: 'Seamless utility',
    body: 'Long battery life, water-resistant child-proof design, and a calm parent dashboard instead of a noisy surveillance feed.',
  },
];

const modules = [
  ['Distress Acoustic AI', 'Scream, impact, and keyword triggers stay on-device.'],
  ['Smart geofencing', 'Wander-off warnings before a child is far from safety.'],
  ['Fall & impact', 'IMU patterns raise an automated accident alert.'],
  ['Silent SOS', 'Recessed double-press button for discreet emergencies.'],
];

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Alehu Band',
    brand: site.legalName,
    description: site.description,
    category: 'Child safety wearable',
  };

  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#0F7A6C33,transparent_42%),radial-gradient(circle_at_bottom_left,#E8A31722,transparent_40%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal">Smart child safety systems</p>
            <h1 className="mt-4 font-display text-5xl leading-tight text-navy md:text-6xl">
              Safety that protects freedom, not just location.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink/80">
              Alehu AI combines a non-intrusive wearable with edge intelligence so parents and schools get instant alerts — without turning childhood into a camera feed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-full bg-navy px-6 py-3 font-semibold text-cream hover:bg-teal">
                Start a school pilot
              </Link>
              <Link href="/product" className="rounded-full border border-navy/20 px-6 py-3 font-semibold text-navy">
                See the gadget
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] bg-navy p-8 text-cream shadow-card">
            <p className="text-sm uppercase tracking-widest text-amber">Live guardian view</p>
            <p className="mt-4 font-display text-3xl">Maya is inside Sunshine Daycare.</p>
            <div className="mt-6 grid gap-3">
              {['Battery 86%', 'Safe zone: school', 'Last ping 12s ago', 'No distress audio'].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-white/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <p className="font-display text-3xl text-teal">{metric.value}</p>
              <p className="mt-1 text-sm text-navy/70">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="font-display text-4xl text-navy">An unbroken safety umbrella</h2>
        <p className="mt-4 max-w-2xl text-ink/75">
          Wearable sensors, localized edge computing, and a guardian app form one loop around children in urban, school, and outdoor environments.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-3xl bg-white p-6 shadow-card">
              <h3 className="font-display text-2xl text-navy">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/75">{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-navy py-16 text-cream">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber">On the band</p>
          <h2 className="mt-3 font-display text-4xl">Quiet until it must speak.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map(([title, body]) => (
              <article key={title} className="rounded-3xl bg-white/10 p-5">
                <h3 className="font-display text-xl">{title}</h3>
                <p className="mt-2 text-sm text-cream/80">{body}</p>
              </article>
            ))}
          </div>
          <Link href="/hardware" className="mt-8 inline-flex rounded-full bg-amber px-5 py-3 text-sm font-semibold text-navy">
            Hardware starting kit
          </Link>
        </div>
      </section>

      {/* ── Portal access cards ── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal">Secure portals</p>
        <h2 className="mt-3 font-display text-4xl text-navy">Access your dashboard</h2>
        <p className="mt-4 max-w-2xl text-ink/75">
          Every stakeholder has a dedicated, role-gated view — built for the tasks they actually perform.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <PortalCard
            href="/parent/login"
            title="Parent portal"
            description="See your child's live location, battery level, and any open alerts from a single calm view."
            badge="For families"
            badgeColour="bg-teal/10 text-teal"
          />
          <PortalCard
            href="/police_officer/login"
            title="Officer portal"
            description="Critical alerts and SOS events surface here first — with GPS coordinates ready for dispatch."
            badge="For law enforcement"
            badgeColour="bg-blue-600/10 text-blue-700"
          />
          <PortalCard
            href="/admin/login"
            title="Admin portal"
            description="Manage users, review fleet health, and maintain full platform visibility."
            badge="Alehu staff"
            badgeColour="bg-amber-100 text-amber-700"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-[2rem] bg-teal-soft p-8 md:p-12">
          <h2 className="font-display text-4xl text-navy">Ready for a careful school pilot?</h2>
          <p className="mt-4 max-w-2xl text-ink/75">
            We start with urban parents, primary schools, and daycare centers. Ten units, clear privacy rules, and a guardian dashboard your staff can actually use.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-navy px-6 py-3 font-semibold text-cream">
              Talk to the team
            </Link>
            <Link href="/how-it-works" className="rounded-full border border-navy/20 px-6 py-3 font-semibold text-navy">
              See the safety loop
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
