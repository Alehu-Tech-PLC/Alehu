import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#12323A',
        navy: '#0B3D4A',
        teal: {
          DEFAULT: '#0F7A6C',
          deep: '#0A5C52',
          soft: '#E8F6F3',
        },
        cream: '#F7F4EE',
        sand: '#EFE7D8',
        amber: '#E8A317',
        coral: '#D64545',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 18px 50px rgba(11, 61, 74, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
