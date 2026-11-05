import type { Metadata } from 'next';
import { MarketingShell } from '@/components/MarketingShell';
import { ContactForm } from '@/components/ContactForm';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Request an Alehu Technologies school, daycare, or family pilot in Addis Ababa and beyond.',
};

const details = [
  { icon: '📍', label: 'HQ',            value: site.city },
  { icon: '✉️',  label: 'General',       value: site.email },
  { icon: '🤝', label: 'Partnerships',  value: site.partnerships },
  { icon: '💼', label: 'Investors',     value: site.investors },
];

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2">
        <div>
          <p className="section-label">Get in touch</p>
          <h1 className="mt-4 font-display text-5xl" style={{ color: 'var(--ink)' }}>
            Let's run a<br />
            <span style={{ color: 'var(--accent)' }}>careful pilot.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
            Initial deployment targets urban parents, primary schools, and daycare centers through
            direct-to-consumer and B2B education partnerships.
          </p>
          <ul className="mt-8 space-y-4">
            {details.map((d) => (
              <li key={d.label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                  style={{ background: 'var(--accent-bg)' }}>{d.icon}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>{d.label}</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{d.value}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <ContactForm />
      </section>
    </MarketingShell>
  );
}
