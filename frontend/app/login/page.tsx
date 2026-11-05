import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import { LoginForm } from '@/components/LoginForm';
import { AlehuWatchHero } from '@/components/illustrations/AlehuWatchHero';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      {/* Left panel */}
      <div className="hidden flex-col justify-between p-12 md:flex"
        style={{ background: 'var(--ink)' }}>
        <BrandMark inverted />
        <div className="flex flex-col items-center gap-8">
          <AlehuWatchHero className="w-56 drop-shadow-2xl" />
          <div>
            <p className="font-display text-3xl text-white leading-snug">
              A calm command center for people who love a child.
            </p>
            <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Use the seeded demo accounts while you explore the MVP.
            </p>
          </div>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>
          Alehu Technologies PLC · Addis Ababa
        </p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8"
        style={{ background: 'var(--canvas)' }}>
        <div className="w-full max-w-md">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-[var(--accent)]"
            style={{ color: 'var(--ink-muted)' }}>
            ← Back to Alehu Technologies
          </Link>
          <h1 className="mt-6 font-display text-4xl" style={{ color: 'var(--ink)' }}>Welcome back</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
            Sign in to your portal — you'll be redirected based on your role.
          </p>
          <LoginForm />
          <div className="mt-8 grid gap-2 rounded-2xl p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>Demo portals</p>
            {[
              { label: 'Parent portal',  href: '/parent/login' },
              { label: 'Officer portal', href: '/police_officer/login' },
              { label: 'Admin portal',   href: '/admin/login' },
            ].map(({ label, href }) => (
              <Link key={href} href={href}
                className="rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:text-[var(--accent)]"
                style={{ color: 'var(--ink-muted)' }}>
                → {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
