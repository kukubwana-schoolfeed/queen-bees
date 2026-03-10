import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        gold:       '#C9A84C',
        'gold-light': '#E2C675',
        'gold-dark':  '#A8872A',
        black:      '#0A0A0A',
        'black-soft': '#111111',
        'card-bg':  '#161616',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'DM Serif Display', 'serif'],
        sans:  ['var(--font-sans)',  'DM Sans', 'sans-serif'],
      },
      animation: {
        marquee:    'marquee 40s linear infinite',
        'float-up': 'floatUp 3s ease forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-gold':  'spinGold 1s linear infinite',
        'draw-check': 'drawCheck 0.6s ease forwards',
        'bounce-y':   'bounceY 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
