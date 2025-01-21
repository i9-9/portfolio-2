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
        helveticaNowDisplayBlack: ['HelveticaNowDisplay-Black', 'sans-serif'],
        helveticaNowTextRegular: ['HelveticaNowText-Regular', 'sans-serif'],
        helveticaNowDisplayBold: ['HelveticaNowDisplay-Bold', 'sans-serif'],
        helveticaNowDisplayItalic: ['HelveticaNowDisplay-Italic', 'sans-serif'],
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
        'lima': '#B2CF53',
        'bluer': '#535A9B',
        'black': '#0C0F14',
        'mid-gray': '#B5B5B6',
        'light-gray': '#D8D8D8',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
