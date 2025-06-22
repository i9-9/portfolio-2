import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import JsonLd from '../components/JsonLd'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ivan Nevares - Designer & Developer',
  description: 'Portfolio of Ivan Nevares, a designer and developer crafting unique digital experiences.',
  keywords: 'Ivan Nevares, Web Developer, Designer, UI/UX, Portfolio, Next.js, React',
  authors: [{ name: 'Ivan Nevares' }],
  openGraph: {
    title: 'Ivan Nevares - Designer & Developer',
    description: 'Portfolio of Ivan Nevares, a designer and developer crafting unique digital experiences.',
    url: 'https://ivannevares.com',
    siteName: 'Ivan Nevares Portfolio',
    images: [
      {
        url: '/logo_rrss.png',
        width: 1200,
        height: 630,
        alt: 'Ivan Nevares Portfolio'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ivan Nevares - Designer & Developer',
    description: 'Portfolio of Ivan Nevares, a designer and developer crafting unique digital experiences.',
    images: ['/logo_rrss.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
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
        <link
          rel="icon"
          href="/favicon_v2.ico"
          type="image/x-icon"
          sizes="16x16"
        />
        <JsonLd />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <header className="fixed top-0 left-0 right-0 bg-nav/80 backdrop-blur-sm z-50">
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 px-12">
            <div className="col-span-6 h-[24px] flex items-center">
              <a href="/" className="text-[9px] tracking-[0.2em] uppercase">Ivan Nevares</a>
            </div>
            <nav className="col-span-3 col-start-10 h-[24px] flex items-center justify-end">
              <ul className="flex gap-6">
                <li>
                  <Link 
                    href="/#work" 
                    className="text-[9px] text-muted-foreground hover:text-foreground transition-colors tracking-[0.2em] uppercase"
                    scroll={true}
                  >
                    Work
                  </Link>
                </li>
                <li>
                  <a 
                    href="/CV_Ivan_Nevares.pdf"
                    download="CV_Ivan_Nevares.pdf"
                    className="text-[9px] text-muted-foreground hover:text-foreground transition-colors tracking-[0.2em] uppercase"
                  >
                    CV
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="relative">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}
