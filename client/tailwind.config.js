const colors = require('tailwindcss/colors');

module.exports = {
  theme: {
    extend: {
      colors: {
        ...colors,
        sky: colors.sky,
        stone: colors.stone,
        neutral: colors.neutral,
        gray: colors.gray,
        slate: colors.slate,
        transparent: 'transparent',
        current: 'currentColor',
        white: '#ffffff',
        purple: '#3f3cbb',
        midnight: '#121063',
        metal: '#565584',
        tahiti: '#3ab7bf',
        silver: '#ecebff',
        'bubble-gum': '#ff77e9',
        bermuda: '#78dcca',
        bluebrand: '#0066b2'
      }
    }
  },
  variants: {
    extend: {}
  },
  content: ['./index.html', './src/**/*.{js,jsx}'],
  plugins: []
};
