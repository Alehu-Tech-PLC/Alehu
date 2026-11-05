import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import { LoginForm } from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Admin sign in — Alehu AI',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <div className="hidden p-12 md:flex md:flex-col md:justify-between"
        style={{ background: 'linear-gradient(135deg, #D4A04A, #C9607A)' }}>
        <BrandMark inverted />
        <div>
          <p className="font-display text-4xl text-white leading-snug">
            Full control over the Alehu platform.
          </p>
          <p className="mt-4 text-white/75">
            Manage users, monitor all devices, review every alert.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            {[
              ['User management',  'Activate / deactivate'],
              ['System stats',     'Users, devices, alerts'],
              ['Role breakdown',   'Per-role distribution'],
              ['Fleet health',     'Low-battery devices'],
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
          <h1 className="mt-4 font-display text-4xl" style={{ color: 'var(--color-ink)' }}>Admin sign in</h1>
          <p className="mt-2 text-sm opacity-60" style={{ color: 'var(--color-ink)' }}>
            Demo: <code className="rounded bg-blush-soft px-1">admin@alehu.com</code> / <code className="rounded bg-blush-soft px-1">Admin123!</code>
          </p>
          <LoginForm defaultEmail="admin@alehu.com" defaultPassword="Admin123!" />
        </div>
      </div>
    </main>
  );
}
