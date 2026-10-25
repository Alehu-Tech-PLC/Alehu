import type { Metadata } from 'next';
import { MarketingShell } from '@/components/MarketingShell';
import { ContactForm } from '@/components/ContactForm';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Request an Alehu school, daycare, or family pilot in Addis Ababa and beyond.',
};

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <h1 className="font-display text-5xl text-navy">Let’s run a careful pilot.</h1>
          <p className="mt-4 text-ink/75">
            Initial deployment targets urban parents, primary schools, and daycare centers through direct-to-consumer and B2B education partnerships.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            <li>HQ: {site.city}</li>
            <li>General: {site.email}</li>
            <li>Partnerships: {site.partnerships}</li>
            <li>Investors: {site.investors}</li>
          </ul>
        </div>
        <ContactForm />
      </section>
    </MarketingShell>
  );
}
