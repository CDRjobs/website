import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-manrope)', 'var(--font-inter)'],
        manrope: ['var(--font-manrope)'],
        inter: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
}
export default config
