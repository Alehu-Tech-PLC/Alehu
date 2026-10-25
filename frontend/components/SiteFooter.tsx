import Link from 'next/link';
import { site } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-navy/10 bg-navy text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Alehu AI</p>
          <p className="mt-3 max-w-sm text-sm text-cream/75">
            Next-generation child safety systems. Wearable sensors, on-device AI, and guardian peace of mind.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber">Explore</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link href="/product">Product</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/hardware">Hardware</Link>
            <Link href="/privacy">Privacy first</Link>
            <Link href="/about">Company</Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber">Contact</p>
          <p className="mt-3">{site.city}</p>
          <p>{site.email}</p>
          <p>{site.partnerships}</p>
        </div>
      </div>
      <p className="border-t border-cream/10 px-4 py-4 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} {site.legalName}. Confidential product materials.
      </p>
    </footer>
  );
}
