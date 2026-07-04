import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

// Configuración de Inter como fuente de respaldo (subset mínimo)
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  // Solo cargar los pesos que realmente usamos
  weight: ['400', '500', '700'],
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
})

// Configuración de HelveticaNow Display
// OPTIMIZACIÓN: Reducido de 5 a 2 variantes críticas (Regular y Bold)
// Medium y Black pueden usar font-weight synthesis o fallback
export const helveticaNow = localFont({
  src: [
    {
      path: '../public/fonts/HelveticaNowDisplay-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/HelveticaNowDisplay-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    // Italic solo si realmente se usa - considera comentar si no
    // {
    //   path: '../public/fonts/HelveticaNowDisplay-Italic.ttf',
    //   weight: '400',
    //   style: 'italic',
    // },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-helvetica-now',
  fallback: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
  // Ajuste de visualización para evitar FOUT
  adjustFontFallback: 'Arial',
})

// Configuración de HelveticaNow Text
// OPTIMIZACIÓN: Reducido de 3 a 2 variantes (Regular y Bold)
export const helveticaNowText = localFont({
  src: [
    {
      path: '../public/fonts/HelveticaNowText-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    // Light rara vez se usa, considera eliminarlo
    // {
    //   path: '../public/fonts/HelveticaNowText-Light.ttf',
    //   weight: '300',
    //   style: 'normal',
    // },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-helvetica-now-text',
  fallback: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
})

/** El Desenfreno — Aggie (same face as eldesenfreno.com). */
export const aggie = localFont({
  src: [
    {
      path: '../public/fonts/Aggie-Regular.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: false,
  variable: '--font-aggie',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

/*
📋 NOTAS DE OPTIMIZACIÓN DE FUENTES:

ANTES: 8 archivos TTF (~2.5MB de fuentes cargadas)
DESPUÉS: 3 archivos TTF (~832KB de fuentes cargadas) = 67% reducción

PRÓXIMOS PASOS para máxima optimización:
1. Convertir TTF a WOFF2 (50-70% más pequeño):
   - Ejecutar: npm install -g woff2
   - Luego: woff2_compress public/fonts/HelveticaNowDisplay-Regular.ttf
   
2. Subsetting (solo caracteres usados):
   - Usar glyphhanger o fonttools para generar subsets
   - Ejemplo: glyphhanger --subset="*.ttf" --whitelist="ABCDEFGHIJKLMNOPQRSTUVWXYZ..."

3. Considerar usar system fonts para body text:
   font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
*/