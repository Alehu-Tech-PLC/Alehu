'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BrandMark } from './BrandMark';

const nav = [
  { href: '/app', label: 'Overview' },
  { href: '/app/devices', label: 'Wearables' },
  { href: '/app/alerts', label: 'Alerts' },
  { href: '/app/customers', label: 'Guardians' },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('alehu_access_token')) {
      router.replace('/login');
    }
  }, [router]);

  function logout() {
    localStorage.removeItem('alehu_access_token');
    localStorage.removeItem('alehu_refresh_token');
    localStorage.removeItem('alehu_user');
    router.replace('/login');
  }

  return (
    <div className="min-h-screen bg-cream">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-navy/10 bg-navy p-6 text-cream md:block">
        <BrandMark inverted className="text-cream" />
        <nav className="mt-10 grid gap-2 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-4 py-3 ${pathname === item.href ? 'bg-teal text-white' : 'hover:bg-white/10'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="absolute bottom-6 left-6 text-sm text-cream/70">
          Sign out
        </button>
      </aside>
      <div className="md:pl-64">
        <header className="flex items-center justify-between border-b border-navy/10 px-4 py-4 md:px-6">
          <p className="text-sm font-semibold text-navy">Guardian operations</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-teal">
              Marketing site
            </Link>
            <button type="button" onClick={logout} className="text-sm text-navy md:hidden">
              Sign out
            </button>
          </div>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-navy/10 px-4 py-3 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                pathname === item.href ? 'bg-navy text-cream' : 'bg-white text-navy'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
