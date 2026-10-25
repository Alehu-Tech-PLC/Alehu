import type { Metadata } from 'next';
import { MarketingShell } from '@/components/MarketingShell';

export const metadata: Metadata = {
  title: 'About',
  description: 'Alehu AI P.L.C. — Addis Ababa team building next-generation child safety systems.',
};

const team = [
  ['Hilina Mulugeta', 'CEO', 'Product direction, corporate strategy, and growth.'],
  ['Kaleab Mulugeta', 'Lead — AI & Hardware', 'Firmware, embedded systems, and on-device AI.'],
  ['Gashaw Taye', 'Lead — Mobile & Cloud', 'Apps, secure backends, and real-time guardian notifications.'],
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-display text-5xl text-navy">Built in Addis Ababa for children everywhere.</h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/75">
          Our mission is to help parents protect children and enable timely responses without compromising freedom. The vision is a world where every child is safer and every parent has greater peace of mind.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {team.map(([name, role, bio]) => (
            <article key={name} className="rounded-3xl bg-white p-6 shadow-card">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal">{role}</p>
              <h2 className="mt-2 font-display text-2xl text-navy">{name}</h2>
              <p className="mt-3 text-sm text-ink/75">{bio}</p>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
