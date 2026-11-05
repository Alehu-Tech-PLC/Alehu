import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import { LoginForm } from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Guardian sign in',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <div className="hidden p-12 md:flex md:flex-col md:justify-between"
        style={{ background: 'var(--color-accent)' }}>
        <BrandMark inverted />
        <div>
          <p className="font-display text-4xl text-white leading-snug">
            A calm command center for people who love a child.
          </p>
          <p className="mt-4 text-white/70">Use the seeded admin account while you explore the MVP.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-8"
        style={{ background: 'var(--color-canvas)' }}>
        <div className="w-full max-w-md">
          <Link href="/" className="text-sm text-rose">← Back to Alehu</Link>
          <h1 className="mt-4 font-display text-4xl" style={{ color: 'var(--color-ink)' }}>Sign in</h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
