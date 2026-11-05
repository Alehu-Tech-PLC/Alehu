import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell } from '@/components/MarketingShell';

export const metadata: Metadata = { title: 'Register', robots: { index: false, follow: false } };

export default function RegisterPage() {
  return (
    <MarketingShell>
      <section className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-16">
        <div className="card w-full p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl"
            style={{ background: 'var(--accent-bg)' }}>🔒</div>
          <h1 className="mt-6 font-display text-4xl" style={{ color: 'var(--ink)' }}>
            Guardian registration
          </h1>
          <p className="mt-4 text-base" style={{ color: 'var(--ink-muted)' }}>
            Public self-serve sign-up is deferred until school pilots begin. Request access from
            the contact page, or use the seeded demo accounts to explore the dashboards.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/contact" className="btn px-8 py-3">Request a pilot</Link>
            <Link href="/login"   className="btn-ghost px-8 py-3">Sign in</Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
