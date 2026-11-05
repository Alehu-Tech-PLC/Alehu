'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BrandMark } from './BrandMark';
import { ThemeToggle } from './ThemeToggle';

const nav = [
  { href: '/app',            label: 'Overview' },
  { href: '/app/devices',    label: 'Wearables' },
  { href: '/app/alerts',     label: 'Alerts' },
  { href: '/app/customers',  label: 'Guardians' },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

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
    <div className="min-h-screen" style={{ background: 'var(--color-canvas)' }}>
      {/* ── Sidebar ── */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r p-6 md:flex"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <BrandMark />
        <nav className="mt-10 grid gap-1.5 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-4 py-3 font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-rose text-white'
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
        <header className="flex items-center justify-between border-b px-4 py-4 md:px-6"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
            Guardian operations
          </p>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-rose">Marketing site</Link>
            <ThemeToggle className="md:hidden" />
            <button type="button" onClick={logout} className="text-sm md:hidden" style={{ color: 'var(--color-ink)' }}>
              Sign out
            </button>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="flex gap-2 overflow-x-auto border-b px-4 py-3 md:hidden"
          style={{ borderColor: 'var(--color-border)' }}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-rose text-white'
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
