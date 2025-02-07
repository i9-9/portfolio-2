import Footer from '../components/Footer';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Ivan Nevares',
  description: 'Web developer and UI designer interested in generating creative and performant digital experiences',
  icons: {
    icon: { url: '/favicon_v2.ico' },
  },
  metadataBase: new URL('https://inevares.com'),
  openGraph: {
    title: 'Ivan Nevares',
    description: 'Web developer and UI designer interested in generating creative and performant digital experiences',
    url: 'https://inevares.com',
    images: [
      {
        url: '/logo_rrss.png',
        width: 1200,
        height: 630,
        alt: 'Imagen de Ivan Nevares',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ivan Nevares',
    description: 'Web developer and UI designer interested in generating creative and performant digital experiences',
    image: ['/logo_rrss.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="custom no-scrollbar">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
