/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-mesh': "url('/mesh.png')",
        'hero-mesh2': "url('/mesh2.png')",
        'hero-mesh3': "url('/mesh3.png')",
        'hero-xl': "url('/mesh4.png')",
        'mesh-5': "url('/mesh5.png')",
        'hero-mesh4': "url('/SM-MESH.png')",
        'hero-mesh5': "url('/MD-MESH.png')",
        'hero-mesh6': "url('/XL-MESH.png')",
        'diamond': "url('/diamond.png')"
      },
      fontFamily: {
        baseBlack: ['Base Neue', 'black'],
        baseBold: ['Base Neue', 'bold'],
        baseSemiBold: ['Base Neue', 'semibold'],
        baseMedium: ['Base Neue', 'medium'],
        baseRegular: ['Base Neue', 'regular'],
        baseLight: ['Base Neue', 'light'],
        offBitBold: ['OffBit', 'bold'],
        supplySans: ['SupplySans', 'regular'],
        supplySansLight: ['SupplySans', 'lighter']
      },
      colors: {
        'violeta': '#5226AA',
        'verde': '#262626',
        'gris': '#262626',
        'gris_claro': '#B5B5B5',
        'gris_oscuro': '#262626',
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
