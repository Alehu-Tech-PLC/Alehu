import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import { LoginForm } from '@/components/LoginForm';
import { AlehuWatchHero } from '@/components/illustrations/AlehuWatchHero';

export const metadata: Metadata = {
  title: 'Officer sign in — Alehu Technologies',
  robots: { index: false, follow: false },
};

export default function PoliceLoginPage() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      {/* Left panel — dark */}
      <div className="hidden flex-col justify-between p-12 md:flex"
        style={{ background: 'var(--ink)' }}>
        <BrandMark inverted />
        <div className="space-y-8">
          <AlehuWatchHero className="w-48 mx-auto drop-shadow-2xl" />
          <div>
            <p className="font-display text-3xl text-white leading-snug">
              Respond faster to child safety incidents.
            </p>
            <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>
              Critical alerts, SOS events, and last-known GPS coordinates ready for rapid dispatch.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {[
              ['Critical alert feed', 'Unacknowledged only'],
              ['SOS event tracking',  'Silent press + audio'],
              ['GPS coordinates',     'Last confirmed point'],
              ['One-click resolve',   'Acknowledge & close'],
            ].map(([term, desc]) => (
              <div key={term as string} className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
                <dt className="text-xs font-semibold text-white">{term}</dt>
                <dd className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Alehu Technologies PLC · Addis Ababa
        </p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8"
        style={{ background: 'var(--canvas)' }}>
        <div className="w-full max-w-md">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-[var(--accent)]"
            style={{ color: 'var(--ink-muted)' }}>
            ← Alehu Technologies
          </Link>
          <h1 className="mt-6 font-display text-4xl" style={{ color: 'var(--ink)' }}>Officer sign in</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
            Demo: <code className="rounded-lg px-1.5 py-0.5 text-xs font-mono"
              style={{ background: 'var(--surface-2)', color: 'var(--ink)' }}>officer@alehu.com</code>
            {' '}/ <code className="rounded-lg px-1.5 py-0.5 text-xs font-mono"
              style={{ background: 'var(--surface-2)', color: 'var(--ink)' }}>Officer123!</code>
          </p>
          <LoginForm defaultEmail="officer@alehu.com" defaultPassword="Officer123!" />
        </div>
      </div>
    </main>
  );
}
