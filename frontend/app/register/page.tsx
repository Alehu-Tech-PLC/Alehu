import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Register',
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center px-4">
      <div>
        <h1 className="font-display text-4xl text-navy">Guardian registration</h1>
        <p className="mt-4 text-ink/75">
          Public self-serve signup is deferred until school pilots. Request access from the contact page, or use the seeded admin account to explore the dashboard.
        </p>
        <Link href="/contact" className="mt-6 inline-block rounded-full bg-navy px-5 py-3 font-semibold text-cream">
          Request a pilot
        </Link>
      </div>
    </main>
  );
}
