/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'loma-green': '#2b5329',
        'loma-light': '#496d47',
        'loma-accent': '#c48c26',
        'loma-wood': '#65773e',
        'loma-bg': '#f3efe6',
        'loma-card': '#ffffff',
        'loma-dark': '#1e381c'
      },
      fontFamily: {
        serif: ['Lora', 'serif'],
        sans: ['Nunito', 'sans-serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
