import type { Metadata } from 'next';
import './globals.css';
import { REPO_URL, SITE_URL } from '@/lib/knowledge';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

const publicBasePath = process.env.GITHUB_ACTIONS === 'true' ? '/openprompting' : '';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'openPrompting — Source-backed guidance for coding agents',
    template: '%s — openPrompting',
  },
  description: 'Deterministic, source-backed prompting guidance for the model, harness, and task you are actually using.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'openPrompting',
    title: 'openPrompting — Source-backed guidance for coding agents',
    description: 'Deterministic, source-backed prompting guidance for the model, harness, and task you are actually using.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary',
    title: 'openPrompting — Source-backed guidance for coding agents',
    description: 'Deterministic, source-backed prompting guidance for the model, harness, and task you are actually using.',
  },
  icons: { icon: `${publicBasePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>{children}</main>
        <SiteFooter repoUrl={REPO_URL} />
      </body>
    </html>
  );
}
