/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        offBitBold: ['OffBit', 'bold'],
        supplySans: ['SupplySans', 'regular'],
        supplySansLight: ['SupplySans', 'lighter']
      },
      fontSize: {
        'h1': ['61.04px', { lineHeight: '64px' }],
        'h2': ['48.83px', { lineHeight: '58px' }],
        'h3': ['39.06px', { lineHeight: '47px' }],
        'h4': ['31.25px', { lineHeight: '38px' }],
        'h5': ['25px', { lineHeight: '30px' }],
        'h6': ['20px', { lineHeight: '24px' }],
        'p': ['16px', { lineHeight: '24px' }],
        'small': ['12.8px', { lineHeight: '18px' }],
        'tiny': ['10.24px', { lineHeight: '14px' }],
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
