/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This enables our dark mode strategy
  theme: {
    extend: {
      colors: {
        // "Starlight" Palette
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        'primary-text': 'var(--color-primary-text)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        success: 'var(--color-success)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Lexend', 'sans-serif'],
      },
    },
  },
  plugins: [],
}