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
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{ background: 'color-mix(in srgb, var(--canvas) 90%, transparent)', borderColor: 'var(--border)' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" aria-label="Alehu Technologies home" onClick={() => setOpen(false)}>
          <BrandMark />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[var(--accent)]"
              style={{ color: 'var(--ink-muted)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden text-sm font-semibold transition-colors hover:text-[var(--accent)] sm:inline"
            style={{ color: 'var(--ink-muted)' }}
          >
            Sign in
          </Link>
          <Link
            href="/contact"
            className="btn hidden sm:inline-flex items-center"
          >
            Request a pilot
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border transition-colors hover:border-[var(--accent)] lg:hidden"
            style={{ borderColor: 'var(--border)' }}
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-[5px]">
              <span className="block h-px w-4 transition-all" style={{ background: 'var(--ink)' }} />
              <span className="block h-px w-4 transition-all" style={{ background: 'var(--ink)' }} />
              <span className="block h-px w-3 transition-all" style={{ background: 'var(--ink)' }} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav
          className="grid gap-1 border-t px-4 py-4 lg:hidden"
          style={{ background: 'var(--canvas)', borderColor: 'var(--border)' }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
              style={{ color: 'var(--ink)' }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr style={{ borderColor: 'var(--border)' }} className="my-1" />
          <Link
            href="/login"
            className="rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:text-[var(--accent)]"
            style={{ color: 'var(--ink)' }}
            onClick={() => setOpen(false)}
          >
            Sign in
          </Link>
          <Link href="/contact" className="btn mt-1 text-center" onClick={() => setOpen(false)}>
            Request a pilot
          </Link>
        </nav>
      )}
    </header>
  );
}
