/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#1366D9',
        textSmall: '#858D9D',
        textMedium: '#383E49',
      }
    },
  },
  plugins: [],
}