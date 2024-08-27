/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      'encode-sans': ['Encode Sans', 'sans-serif']
    },
    extend: {
      colors: {
        'primary-green': '#6bbbae',
        black: '#2a2a29',
        'primary-yellow': '#F9B104',
        'primary-blue': '#7baed8'
      }
    }
  },
  plugins: []
}
