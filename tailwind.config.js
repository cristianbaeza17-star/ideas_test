/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          'primary': '#3ecf8e',
          'secondary': '#1e293b',
          'accent': '#0f172a'
        }
      }
    },
  },
  plugins: [],
}
