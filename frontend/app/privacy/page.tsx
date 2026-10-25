import type { Metadata } from 'next';
import { MarketingShell } from '@/components/MarketingShell';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'Alehu AI keeps child data private with local inference and encrypted telemetry only.',
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-5xl text-navy">Privacy is a safety feature.</h1>
        <div className="mt-8 space-y-5 text-ink/80">
          <p>Alehu does not store raw audio or images from children. Inference happens on the wearable whenever possible.</p>
          <p>The cloud receives encrypted telemetry: battery, last known location, firmware version, and structured alert types such as fall, SOS, or geofence.</p>
          <p>Guardian accounts use JWT authentication, role-based access, and acknowledgement workflows so sensitive events are not left unattended in a shared inbox.</p>
          <p>This page is product policy for the MVP. Formal legal terms will be issued with the first paid school deployment.</p>
        </div>
      </section>
    </MarketingShell>
  );
}
