'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BrandMark } from './BrandMark';
import { ThemeToggle } from './ThemeToggle';

export type NavItem = { href: string; label: string };

interface RoleDashboardShellProps {
  children: React.ReactNode;
  requiredRole: string;
  portalLabel: string;
  /** Tailwind bg class for active nav item — keep role-specific accent */
  accentBg?: string;
  nav: NavItem[];
  loginPath: string;
}

export function RoleDashboardShell({
  children,
  requiredRole,
  portalLabel,
  accentBg = 'bg-rose',
  nav,
  loginPath,
}: RoleDashboardShellProps) {
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('alehu_access_token');
    if (!token) { router.replace(loginPath); return; }
    try {
      const user = JSON.parse(localStorage.getItem('alehu_user') || '{}');
      if (user.role !== requiredRole) router.replace(loginPath);
    } catch {
      router.replace(loginPath);
    }
  }, [router, requiredRole, loginPath]);

  function logout() {
    localStorage.removeItem('alehu_access_token');
    localStorage.removeItem('alehu_refresh_token');
    localStorage.removeItem('alehu_user');
    router.replace(loginPath);
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-canvas)' }}>
      {/* ── Sidebar ── */}
      <aside
        className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r p-6 md:flex"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <BrandMark />
        <p className="mt-1.5 text-xs font-semibold uppercase tracking-widest opacity-40"
          style={{ color: 'var(--color-ink)' }}>
          {portalLabel}
        </p>

        <nav className="mt-8 grid gap-1.5 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-4 py-3 font-medium transition-colors ${
                pathname === item.href
                  ? `${accentBg} text-white`
                  : 'hover:bg-blush-soft dark:hover:bg-plum-light/20'
              }`}
              style={pathname !== item.href ? { color: 'var(--color-ink)' } : {}}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex items-center justify-between">
          <button
            onClick={logout}
            className="text-sm opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--color-ink)' }}
          >
            Sign out
          </button>
          <ThemeToggle />
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="md:pl-64">
        <header
          className="flex items-center justify-between border-b px-4 py-4 md:px-6"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
            {portalLabel}
          </p>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-rose">alehu.ai</Link>
            <ThemeToggle className="md:hidden" />
            <button type="button" onClick={logout} className="text-sm md:hidden" style={{ color: 'var(--color-ink)' }}>
              Sign out
            </button>
          </div>
        </header>

        {/* Mobile nav */}
        <nav
          className="flex gap-2 overflow-x-auto border-b px-4 py-3 md:hidden"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? `${accentBg} text-white`
                  : 'bg-blush-soft dark:bg-plum-light/20'
              }`}
              style={pathname !== item.href ? { color: 'var(--color-ink)' } : {}}
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
