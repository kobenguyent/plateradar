/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        plate: ['"FE-Schrift"', '"Euro Plate"', 'monospace', 'sans-serif'],
      },
      colors: {
        plate: {
          blue: '#003399',      // EU blue
          yellow: '#FFCC00',    // EU star yellow / Kurzzeit yellow
          red: '#D91E18',       // Ausfuhr red / dealer red
          green: '#27AE60',     // Tax-free green plate
          black: '#111111',     // Stamped text black
          metal: '#ECEFF1',     // License plate white/metal background
        }
      },
      boxShadow: {
        'plate': 'inset 0 1px 2px rgba(255,255,255,0.7), 0 4px 15px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15)',
        'emboss': 'inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.35)',
      }
    },
  },
  plugins: [],
}
