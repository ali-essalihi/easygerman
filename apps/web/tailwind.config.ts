import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0ff',
          100: '#bad2fe',
          200: '#8cb4fe',
          300: '#5e96fe',
          400: '#3078fd',
          DEFAULT: '#025afd',
          600: '#024acf',
          700: '#0139a1',
          800: '#012973',
          900: '#011945',
          950: '#000817',
        },
      },
    },
    container: {
      center: true,
      padding: '1rem',
      screens: ['768px'],
    },
  },
}
export default config
