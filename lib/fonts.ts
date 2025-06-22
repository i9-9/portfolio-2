import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

// Configuración de Inter como fuente de respaldo
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Configuración de HelveticaNow
export const helveticaNow = localFont({
  src: [
    {
      path: '../public/fonts/HelveticaNowDisplay-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/HelveticaNowDisplay-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/HelveticaNowDisplay-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/HelveticaNowDisplay-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-helvetica-now',
})

// Configuración de HelveticaNow Text
export const helveticaNowText = localFont({
  src: [
    {
      path: '../public/fonts/HelveticaNowText-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/HelveticaNowText-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/HelveticaNowText-Light.ttf',
      weight: '300',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-helvetica-now-text',
}) 