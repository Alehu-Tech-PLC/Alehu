import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import { LoginForm } from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Officer sign in — Alehu AI',
  robots: { index: false, follow: false },
};

export default function PoliceLoginPage() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <div className="hidden p-12 md:flex md:flex-col md:justify-between"
        style={{ background: 'linear-gradient(135deg, #5C2D4E, #3D1A33)' }}>
        <BrandMark inverted />
        <div>
          <p className="font-display text-4xl text-white leading-snug">
            Respond faster to child safety incidents.
          </p>
          <p className="mt-4 text-white/75">
            Critical alerts, SOS events, and last-known GPS coordinates for rapid response.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            {[
              ['Critical alert feed', 'Unacknowledged only'],
              ['SOS event tracking',  'Silent press + audio'],
              ['GPS coordinates',     'Last confirmed location'],
              ['One-click close',     'Acknowledge & resolve'],
            ].map(([term, desc]) => (
              <div key={term}>
                <dt className="font-semibold text-white">{term}</dt>
                <dd className="text-white/70">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="flex items-center justify-center p-8" style={{ background: 'var(--color-canvas)' }}>
        <div className="w-full max-w-md">
          <Link href="/" className="text-sm text-rose">← Back to Alehu</Link>
          <h1 className="mt-4 font-display text-4xl" style={{ color: 'var(--color-ink)' }}>Officer sign in</h1>
          <p className="mt-2 text-sm opacity-60" style={{ color: 'var(--color-ink)' }}>
            Demo: <code className="rounded bg-blush-soft px-1">officer@alehu.com</code> / <code className="rounded bg-blush-soft px-1">Officer123!</code>
          </p>
          <LoginForm defaultEmail="officer@alehu.com" defaultPassword="Officer123!" />
        </div>
      </div>
    </main>
  );
}
