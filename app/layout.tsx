import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'TU Scraper',
  description: 'A production-ready TypeScript scraper and npm package for fetching official Tribhuvan University (TU) notices across all 8 verified faculties and institutes in Nepal.',
  keywords: ['TU Scraper', 'Tribhuvan University', 'Notices', 'Scraper', 'Nepal', 'IOST', 'IOE', 'IOM', 'NPM Package', 'TypeScript'],
  authors: [{ name: 'Ankit Khatri KC' }],
  creator: 'Ankit Khatri KC',
  openGraph: {
    title: 'TU Scraper - Official TU Notices Scraper',
    description: 'A production-ready TypeScript scraper for Tribhuvan University notices. Fetch results from IOST, IOE, IOM, FOHSS, and more.',
    type: 'website',
    images: [{ url: '/preview.png', width: 1200, height: 630, alt: 'TU Scraper Preview' }],
    siteName: 'TU Scraper',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TU Scraper - Official TU Notices Scraper',
    description: 'A production-ready TypeScript scraper for Tribhuvan University notices. Fetch results from IOST, IOE, IOM, FOHSS, and more.',
    images: ['/preview.png'],
  },
  icons: {
    icon: [
      { url: '/tulogo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/tulogo.png', type: 'image/png' }],
    shortcut: ['/tulogo.png'],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/tulogo.png" type="image/png" />
        <link rel="shortcut icon" href="/tulogo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/tulogo.png" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

