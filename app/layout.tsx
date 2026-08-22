import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'tu-scraper | Tribhuvan University Notices Scraper NPM Package',
  description: 'Production-ready TypeScript scraper and npm package to scrape official Tribhuvan University notices across all 8 verified faculties and institutes.',
  icons: {
    icon: [
      { url: '/tulogo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/tulogo.png', type: 'image/png' }],
    shortcut: ['/tulogo.png'],
  },
  openGraph: {
    title: 'tu-scraper - Official TU Notices Scraper',
    description: 'Production-ready TypeScript scraper for Tribhuvan University notices.',
    type: 'website',
    images: [{ url: '/tulogo.png', width: 512, height: 512, alt: 'tu-scraper logo' }],
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

