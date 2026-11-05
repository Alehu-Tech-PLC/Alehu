import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import { LoginForm } from '@/components/LoginForm';
import { AlehuWatchHero } from '@/components/illustrations/AlehuWatchHero';
import { ChildrenScene } from '@/components/illustrations/ChildrenScene';

export const metadata: Metadata = {
  title: 'Parent sign in — Alehu Technologies',
  robots: { index: false, follow: false },
};

export default function ParentLoginPage() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      {/* Left panel */}
      <div className="hidden flex-col justify-between p-12 md:flex"
        style={{ background: 'var(--accent)' }}>
        <BrandMark inverted />
        <div className="space-y-8">
          <ChildrenScene className="w-full max-w-sm mx-auto drop-shadow-xl" />
          <div>
            <p className="font-display text-3xl text-white leading-snug">
              Stay close to your child — wherever they are.
            </p>
            <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>
              Live location, battery status, and instant alerts for your child's Alehu band.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {[
              ['Real-time location', 'Every 30 s'],
              ['Instant SOS alerts', 'Push + SMS'],
              ['Battery warnings',   'Low-battery alert'],
              ['Safe zone alerts',   'Geofence in / out'],
            ].map(([term, desc]) => (
              <div key={term as string} className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.12)' }}>
                <dt className="text-xs font-semibold text-white">{term}</dt>
                <dd className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
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
          <h1 className="mt-6 font-display text-4xl" style={{ color: 'var(--ink)' }}>Parent sign in</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
            Demo: <code className="rounded-lg px-1.5 py-0.5 text-xs font-mono"
              style={{ background: 'var(--surface-2)', color: 'var(--ink)' }}>parent@alehu.com</code>
            {' '}/ <code className="rounded-lg px-1.5 py-0.5 text-xs font-mono"
              style={{ background: 'var(--surface-2)', color: 'var(--ink)' }}>Parent123!</code>
          </p>
          <LoginForm defaultEmail="parent@alehu.com" defaultPassword="Parent123!" />
        </div>
      </div>
    </main>
  );
}
