import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Officer Portal — Alehu AI',
  robots: { index: false, follow: false },
};

export default function PoliceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
