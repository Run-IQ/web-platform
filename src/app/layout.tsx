import type { Metadata } from 'next';
import { Crimson_Pro, Figtree, DM_Mono } from 'next/font/google';
import './globals.css';

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Run-IQ | Parametric Rule Engine for Regulated Domains',
  description:
    'A deterministic, stateless, and auditable rule engine designed for law, tax, and compliance. Open-source core, domain-expert plugins.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${crimsonPro.variable} ${figtree.variable} ${dmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
