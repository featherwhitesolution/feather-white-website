/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          900: '#022c22', // Deep Emerald
          800: '#064e3b',
        },
        navy: {
          900: '#002366', // Royal Navy
          800: '#003380',
          700: '#0047b3',
          600: '#005ce6',
          500: '#4169e1', // Royal Blue
        },
        gold: {
          500: '#d4af37', // Brushed Gold
          600: '#b5952f',
        },
        cream: {
          100: '#f5f5dc', // Creamy Marble
          200: '#ebebb0',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
