'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BrandMark } from './BrandMark';

const links = [
  { href: '/product', label: 'Product' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/hardware', label: 'Hardware' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/about', label: 'About' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" aria-label="Alehu home" onClick={() => setOpen(false)}>
          <BrandMark />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-navy/80 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-teal">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-semibold text-navy sm:inline">
            Sign in
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-cream hover:bg-teal"
          >
            Request a pilot
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-navy/15 lg:hidden"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-4 bg-navy" />
              <span className="block h-0.5 w-4 bg-navy" />
              <span className="block h-0.5 w-4 bg-navy" />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <nav className="grid gap-2 border-t border-navy/10 bg-cream px-4 py-4 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl px-3 py-2 text-sm font-medium text-navy hover:bg-teal-soft"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="rounded-2xl px-3 py-2 text-sm font-semibold text-navy" onClick={() => setOpen(false)}>
            Sign in
          </Link>
        </nav>
      )}
    </header>
  );
}
