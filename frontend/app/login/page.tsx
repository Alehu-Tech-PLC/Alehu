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
      <div className="hidden bg-navy p-12 text-cream md:flex md:flex-col md:justify-between">
        <BrandMark className="text-cream" />
        <div>
          <p className="font-display text-4xl">A calm command center for people who love a child.</p>
          <p className="mt-4 text-cream/70">Use the seeded admin account while you explore the MVP.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="text-sm text-teal">← Back to Alehu</Link>
          <h1 className="mt-4 font-display text-4xl text-navy">Sign in</h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
