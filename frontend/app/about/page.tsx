import type { Metadata } from 'next';
import { MarketingShell } from '@/components/MarketingShell';

export const metadata: Metadata = {
  title: 'About',
  description: 'Alehu Technologies PLC — Addis Ababa team building next-generation child safety systems.',
};

const team = [
  { name: 'Hilina Mulugeta', role: 'CEO',                    bio: 'Product direction, corporate strategy, and growth.', initials: 'HM' },
  { name: 'Kaleab Mulugeta', role: 'Lead — AI & Hardware',   bio: 'Firmware, embedded systems, and on-device AI.',       initials: 'KM' },
  { name: 'Gashaw Taye',     role: 'Lead — Mobile & Cloud',  bio: 'Apps, secure backends, and real-time notifications.', initials: 'GT' },
];

const values = [
  { icon: '🛡️', title: 'Child safety first',  body: 'Every design decision starts with the question: does this keep a child safer?' },
  { icon: '🔒', title: 'Privacy by default',   body: 'No raw audio, no images. The minimum data needed, encrypted end-to-end.' },
  { icon: '🌍', title: 'Built for Ethiopia',   body: 'Designed for urban Addis Ababa with LTE-M coverage, local partnerships, and Amharic support planned.' },
];

export default function AboutPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="section-label">Our story</p>
        <h1 className="mt-4 font-display text-5xl" style={{ color: 'var(--ink)' }}>
          Built in Addis Ababa<br />
          <span style={{ color: 'var(--accent)' }}>for children everywhere.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
          Alehu Technologies PLC is a child-safety technology company headquartered in Addis Ababa,
          Ethiopia. Our mission: help parents protect children and enable timely responses without
          compromising freedom or privacy.
        </p>
      </section>

      {/* Values */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-5 md:grid-cols-3">
            {values.map((v) => (
              <article key={v.title} className="card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                  style={{ background: 'var(--accent-bg)' }}>
                  {v.icon}
                </div>
                <h3 className="mt-4 font-display text-xl" style={{ color: 'var(--ink)' }}>{v.title}</h3>
                <p className="mt-2 text-sm leading-6" style={{ color: 'var(--ink-muted)' }}>{v.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="section-label">The team</p>
        <h2 className="mt-3 font-display text-3xl" style={{ color: 'var(--ink)' }}>Who we are</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {team.map((m) => (
            <article key={m.name} className="card p-6 text-center">
              {/* Avatar */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
                style={{ background: 'var(--accent)' }}>
                {m.initials}
              </div>
              <p className="section-label mt-4">{m.role}</p>
              <h3 className="mt-2 font-display text-xl" style={{ color: 'var(--ink)' }}>{m.name}</h3>
              <p className="mt-2 text-sm leading-6" style={{ color: 'var(--ink-muted)' }}>{m.bio}</p>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
