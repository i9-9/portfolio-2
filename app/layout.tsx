import './globals.css'
import type { Metadata, Viewport } from 'next'
import { ClientLayout } from '@/components/ClientLayout'
import { ThemeProvider } from "@/lib/theme/ThemeContext";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Analytics } from "@vercel/analytics/react";
import { helveticaNow, helveticaNowText, inter } from "@/lib/fonts";

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#141414' },
  ],
}

export const metadata: Metadata = {
  title: 'Ivan Nevares — graphic design & front end development',
  description:
    'Graphic design and front end development. Wohl Studio and freelance. Graphic Design at UBA. Based in Buenos Aires, Argentina — local and international clients.',
  keywords: [
    'Ivan Nevares',
    'graphic design',
    'front end development',
    'Wohl Studio',
    'Buenos Aires',
    'Portfolio',
  ],
  authors: [{ name: 'Ivan Nevares' }],
  openGraph: {
    title: 'Ivan Nevares — graphic design & front end development',
    description:
      'Graphic design and front end development. Wohl Studio and freelance. Graphic Design at UBA. Based in Buenos Aires, Argentina — local and international clients.',
    url: 'https://ivannevares.com',
    siteName: 'Ivan Nevares Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: 'Ivan Nevares - UX/UI Designer & Front-End Developer',
    card: 'summary_large_image',
  },
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`${helveticaNow.variable} ${helveticaNowText.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon_v2.ico" />
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
      </head>
      <body className="font-sans bg-background text-foreground antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
