import Link from 'next/link';
import { site } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl" style={{ color: 'var(--color-ink)' }}>Alehu AI</p>
          <p className="mt-3 max-w-sm text-sm opacity-70" style={{ color: 'var(--color-ink)' }}>
            Next-generation child safety systems. Wearable sensors, on-device AI, and guardian peace of mind.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Explore</p>
          <div className="mt-3 grid gap-2 text-sm opacity-70" style={{ color: 'var(--color-ink)' }}>
            {['/product', '/how-it-works', '/hardware', '/privacy', '/about'].map((href) => (
              <Link key={href} href={href}
                className="hover:opacity-100 hover:text-rose transition-all capitalize">
                {href.replace('/', '').replace('-', ' ')}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Contact</p>
          <div className="mt-3 space-y-1 opacity-70" style={{ color: 'var(--color-ink)' }}>
            <p>{site.city}</p>
            <p>{site.email}</p>
            <p>{site.partnerships}</p>
          </div>
        </div>
      </div>
      <p className="border-t px-4 py-4 text-center text-xs opacity-50"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}>
        © {new Date().getFullYear()} {site.legalName}. Confidential product materials.
      </p>
    </footer>
  );
}
