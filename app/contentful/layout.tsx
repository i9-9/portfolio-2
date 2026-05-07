import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guía Contentful',
  description:
    'Instrucciones paso a paso para actualizar textos e imágenes de tu sitio en Contentful.',
  robots: { index: false, follow: false },
}

export default function ContentfulGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
