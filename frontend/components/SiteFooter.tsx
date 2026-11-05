import Link from 'next/link';
import { BrandMark } from './BrandMark';
import { site } from '@/lib/site';

const explore = [
  { href: '/product',      label: 'Product' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/hardware',     label: 'Hardware' },
  { href: '/privacy',      label: 'Privacy' },
  { href: '/about',        label: 'About' },
];

export function SiteFooter() {
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        {/* Brand */}
        <div>
          <BrandMark />
          <p className="mt-3 max-w-xs text-sm leading-6" style={{ color: 'var(--ink-muted)' }}>
            Next-generation child safety systems built in Addis Ababa. Wearable sensors, on-device AI, guardian peace of mind.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="section-label mb-4">Explore</p>
          <div className="grid gap-2">
            {explore.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm transition-colors hover:text-[var(--accent)]"
                style={{ color: 'var(--ink-muted)' }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="section-label mb-4">Contact</p>
          <div className="grid gap-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
            <p>{site.city}</p>
            <p>{site.email}</p>
            <p>{site.partnerships}</p>
            <p>{site.investors}</p>
          </div>
        </div>
      </div>

      <div
        className="border-t px-4 py-5 text-center text-xs"
        style={{ borderColor: 'var(--border)', color: 'var(--ink-muted)' }}
      >
        © {new Date().getFullYear()} <span style={{ color: 'var(--ink)' }} className="font-semibold">{site.legalName}</span>. All rights reserved.
      </div>
    </footer>
  );
}
