import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import { LoginForm } from '@/components/LoginForm';
import { WearableLineup } from '@/components/illustrations/WearableLineup';

export const metadata: Metadata = {
  title: 'Admin sign in — Alehu Technologies',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      {/* Left panel — rose gradient */}
      <div className="hidden flex-col justify-between p-12 md:flex"
        style={{ background: 'linear-gradient(145deg, var(--accent) 0%, var(--accent-hv) 100%)' }}>
        <BrandMark inverted />
        <div className="space-y-8">
          <WearableLineup className="w-full drop-shadow-xl" />
          <div>
            <p className="font-display text-3xl text-white leading-snug">
              Full control over the Alehu platform.
            </p>
            <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>
              Manage users, monitor all devices, review every alert, and keep the platform healthy.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {[
              ['User management',  'Activate / deactivate'],
              ['System stats',     'Users, devices, alerts'],
              ['Role breakdown',   'Per-role distribution'],
              ['Fleet health',     'Low-battery devices'],
            ].map(([term, desc]) => (
              <div key={term as string} className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.14)' }}>
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
          <h1 className="mt-6 font-display text-4xl" style={{ color: 'var(--ink)' }}>Admin sign in</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
            Demo: <code className="rounded-lg px-1.5 py-0.5 text-xs font-mono"
              style={{ background: 'var(--surface-2)', color: 'var(--ink)' }}>admin@alehu.com</code>
            {' '}/ <code className="rounded-lg px-1.5 py-0.5 text-xs font-mono"
              style={{ background: 'var(--surface-2)', color: 'var(--ink)' }}>Admin123!</code>
          </p>
          <LoginForm defaultEmail="admin@alehu.com" defaultPassword="Admin123!" />
        </div>
      </div>
    </main>
  );
}
