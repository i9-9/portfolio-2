import Footer from '../components/Footer';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import JsonLd from '../components/JsonLd';

export const metadata = {
  title: 'Ivan Nevares | UX/UI Designer & Front-End Developer',
  description: 'Portfolio of Ivan Nevares, a creative UX/UI Designer and Front-End Developer specializing in visual identity, digital experiences, and web development.',
  icons: {
    icon: { url: '/favicon_v2.ico' },
  },
  metadataBase: new URL('https://inevares.com'),
  alternates: {
    canonical: 'https://inevares.com',
  },
  keywords: 'Ivan Nevares, UI Designer, UX Designer, Front-End Developer, Web Developer, Portfolio, Digital Experiences, Visual Identity, Web Design',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Ivan Nevares | UX/UI Designer & Front-End Developer',
    description: 'Portfolio of Ivan Nevares, a creative UX/UI Designer and Front-End Developer specializing in visual identity, digital experiences, and web development.',
    url: 'https://inevares.com',
    siteName: 'Ivan Nevares Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo_rrss.png',
        width: 1200,
        height: 630,
        alt: 'Ivan Nevares - UX/UI Designer & Front-End Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ivan Nevares | UX/UI Designer & Front-End Developer',
    description: 'Portfolio of Ivan Nevares, a creative UX/UI Designer and Front-End Developer specializing in visual identity, digital experiences, and web development.',
    images: ['/logo_rrss.png'],
    creator: '@inevares',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/HelveticaNowDisplay-Black.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/HelveticaNowText-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/HelveticaNowDisplay-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <JsonLd />
      </head>
      <body className="custom no-scrollbar">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
