const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Next.js 16 uses Turbopack by default - empty config to silence warning
  turbopack: {},
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      {
        source: '/contentful-guide',
        destination: '/contentful',
        permanent: true,
      },
    ]
  },
  // Note: i18n config removed - not needed with App Router
  // Language handling is done via LanguageContext
}

module.exports = withBundleAnalyzer(nextConfig)
