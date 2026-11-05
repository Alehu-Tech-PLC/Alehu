'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BrandMark } from './BrandMark';
import { ThemeToggle } from './ThemeToggle';

const links = [
  { href: '/product',      label: 'Product' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/hardware',     label: 'Hardware' },
  { href: '/privacy',      label: 'Privacy' },
  { href: '/about',        label: 'About' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur"
      style={{
        background: 'color-mix(in srgb, var(--color-canvas) 92%, transparent)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" aria-label="Alehu home" onClick={() => setOpen(false)}>
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium lg:flex"
          style={{ color: 'var(--color-ink)' }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}
              className="opacity-70 hover:opacity-100 hover:text-rose transition-all">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login"
            className="hidden text-sm font-semibold sm:inline opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--color-ink)' }}>
            Sign in
          </Link>
          <Link href="/contact"
            className="rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: 'var(--color-accent)' }}>
            Request a pilot
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border lg:hidden"
            style={{ borderColor: 'var(--color-border)' }}
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-4" style={{ background: 'var(--color-ink)' }} />
              <span className="block h-0.5 w-4" style={{ background: 'var(--color-ink)' }} />
              <span className="block h-0.5 w-4" style={{ background: 'var(--color-ink)' }} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="grid gap-2 border-t px-4 py-4 lg:hidden"
          style={{ background: 'var(--color-canvas)', borderColor: 'var(--color-border)' }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}
              className="rounded-2xl px-3 py-2 text-sm font-medium hover:bg-blush-soft dark:hover:bg-plum-light/20 transition-colors"
              style={{ color: 'var(--color-ink)' }}
              onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/login"
            className="rounded-2xl px-3 py-2 text-sm font-semibold"
            style={{ color: 'var(--color-ink)' }}
            onClick={() => setOpen(false)}>
            Sign in
          </Link>
        </nav>
      )}
    </header>
  );
}
