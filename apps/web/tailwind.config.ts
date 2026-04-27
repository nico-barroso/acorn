import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFCFB',
        brown: {
          DEFAULT: '#43281C',
          mid: '#48392A',
        },
        salmon: '#A14D36',
        black: '#1B1B1B',
        white: '#FFFFFF',
      },
      fontFamily: {
        primary: [
          'CabinetGrotesk',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '20px',
        xl: '28px',
      },
    },
  },
  plugins: [],
}

export default config