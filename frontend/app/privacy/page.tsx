import type { Metadata } from 'next';
import { MarketingShell } from '@/components/MarketingShell';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'Alehu Technologies keeps child data private with local inference and encrypted telemetry only.',
};

const points = [
  { icon: '🎙️', title: 'No raw audio stored', body: 'Alehu does not store raw audio or images from children. Acoustic inference runs entirely on the wearable.' },
  { icon: '📡', title: 'Encrypted telemetry only', body: 'The cloud receives: battery level, last known location, firmware version, and structured alert types (fall, SOS, geofence). Nothing more.' },
  { icon: '🔑', title: 'Role-based access', body: 'Guardian accounts use JWT authentication, role-based access control, and acknowledgement workflows so sensitive events are never left unattended.' },
  { icon: '🏛️', title: 'Formal terms on rollout', body: 'This page is product policy for the MVP. Formal legal privacy terms will be issued with the first paid school deployment.' },
];

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-4xl px-4 py-16">
        <p className="section-label">Our commitment</p>
        <h1 className="mt-4 font-display text-5xl" style={{ color: 'var(--ink)' }}>
          Privacy is a{' '}
          <span style={{ color: 'var(--accent)' }}>safety feature.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg" style={{ color: 'var(--ink-muted)' }}>
          Keeping children safe should never mean surveilling them. Alehu is designed from the
          ground up to protect both child safety and child privacy.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {points.map((p) => (
            <article key={p.title} className="card flex gap-4 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                style={{ background: 'var(--accent-bg)' }}>
                {p.icon}
              </div>
              <div>
                <h2 className="font-semibold" style={{ color: 'var(--ink)' }}>{p.title}</h2>
                <p className="mt-1 text-sm leading-5" style={{ color: 'var(--ink-muted)' }}>{p.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
