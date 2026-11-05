import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parent Portal — Alehu AI',
  robots: { index: false, follow: false },
};

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
