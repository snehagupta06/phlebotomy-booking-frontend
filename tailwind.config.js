
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9f9',
          100: '#e6f6f5',
          200: '#ccefe9',
          300: '#99e0d3',
          400: '#66d1bd',
          500: '#2bb6a6',
          600: '#219488',
          700: '#196f66',
          800: '#124b44',
          900: '#0b2b27',
        },
        accent: {
          50: '#f2fbff',
          100: '#e6f7ff',
          200: '#bfeeff',
          300: '#99e6ff',
          400: '#4dd2ff',
          500: '#00bfff'
        }
      },
      boxShadow: {
        card: '0 8px 24px rgba(14, 22, 33, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
