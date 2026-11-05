'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BrandMark } from './BrandMark';
import { ThemeToggle } from './ThemeToggle';

const nav = [
  { href: '/app',           label: 'Overview' },
  { href: '/app/devices',   label: 'Wearables' },
  { href: '/app/alerts',    label: 'Alerts' },
  { href: '/app/customers', label: 'Guardians' },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('alehu_access_token')) router.replace('/login');
  }, [router]);

  function logout() {
    ['alehu_access_token','alehu_refresh_token','alehu_user'].forEach(k => localStorage.removeItem(k));
    router.replace('/login');
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--canvas)' }}>
      {/* ── Sidebar ── */}
      <aside
        className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r p-5 md:flex"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <BrandMark />

        <nav className="mt-8 flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
              style={
                pathname === item.href
                  ? { background: 'var(--accent)', color: '#fff' }
                  : { color: 'var(--ink-muted)' }
              }
              onMouseEnter={e => { if (pathname !== item.href) (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
              onMouseLeave={e => { if (pathname !== item.href) (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={logout}
            className="text-xs font-medium transition-colors hover:text-[var(--accent)]"
            style={{ color: 'var(--ink-muted)' }}
          >
            Sign out
          </button>
          <ThemeToggle />
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="md:pl-60">
        <header
          className="flex items-center justify-between border-b px-4 py-3 md:px-6"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
            Guardian operations
          </p>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-medium transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--ink-muted)' }}>
              alehu.tech
            </Link>
            <ThemeToggle className="md:hidden" />
            <button onClick={logout} className="text-xs font-medium md:hidden" style={{ color: 'var(--ink-muted)' }}>
              Sign out
            </button>
          </div>
        </header>

        {/* Mobile tab bar */}
        <nav className="flex gap-1.5 overflow-x-auto border-b px-4 py-2 md:hidden" style={{ borderColor: 'var(--border)' }}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              style={
                pathname === item.href
                  ? { background: 'var(--accent)', color: '#fff' }
                  : { background: 'var(--surface-2)', color: 'var(--ink-muted)' }
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
