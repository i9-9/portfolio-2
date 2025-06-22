import './globals.css'
import type { Metadata } from 'next'
import { ClientLayout } from '@/components/ClientLayout'
import { ThemeProvider } from "@/lib/theme/ThemeContext";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Analytics } from "@vercel/analytics/react";
import { helveticaNow, helveticaNowText, inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: 'Ivan Nevares - UX/UI Designer & Front-End Developer',
  description: 'Portfolio of Ivan Nevares, a UX/UI Designer and Front-End Developer based in Buenos Aires, Argentina. Specializing in creating unique digital experiences.',
  keywords: [
    'Ivan Nevares',
    'UX Designer',
    'UI Designer',
    'Front-End Developer',
    'Web Developer',
    'Portfolio',
    'Buenos Aires',
    'Argentina',
  ],
  authors: [{ name: 'Ivan Nevares' }],
  openGraph: {
    title: 'Ivan Nevares - UX/UI Designer & Front-End Developer',
    description: 'Portfolio of Ivan Nevares, a UX/UI Designer and Front-End Developer based in Buenos Aires, Argentina. Specializing in creating unique digital experiences.',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon_v2.ico" />
      </head>
      <body className={`${helveticaNow.className} ${helveticaNowText.className} ${inter.className} font-sans bg-background text-foreground`}>
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
