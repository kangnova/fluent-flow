/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f172a',    /* slate-900 */
          card: '#1e293b',  /* slate-800 */
          text: '#f1f5f9',  /* slate-100 */
          accent: '#38bdf8' /* sky-400 */
        }
      }
    },
  },
  plugins: [],
}
