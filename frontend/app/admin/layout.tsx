import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Portal — Alehu AI',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
