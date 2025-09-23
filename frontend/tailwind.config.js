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
        // "Aurora" Palette
        'background': 'var(--color-background)',
        'foreground': 'var(--color-foreground)',
        'primary-text': 'var(--color-primary-text)',
        'accent': 'var(--color-accent)',
        'accent-glow': 'var(--color-accent-glow)',
        'subtle-border': 'var(--color-subtle-border)',
        'success': 'var(--color-success)',
        'danger': 'var(--color-danger)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Lexend', 'sans-serif'],
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      animation: {
        gradient: 'gradient 20s ease infinite',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
}
