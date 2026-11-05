import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand neutrals ──────────────────────────────────────────
        ink:   'var(--color-ink)',
        canvas: 'var(--color-canvas)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',

        // ── Pinky-cream palette ──────────────────────────────────────
        blush: {
          DEFAULT: '#F2C4CE',   // warm pink
          deep:    '#D4849A',   // dusty rose
          soft:    '#FDF0F3',   // almost-white pink tint
        },
        plum: {
          DEFAULT: '#5C2D4E',   // rich dark plum (replaces navy)
          light:   '#7A3D69',
          dark:    '#3D1A33',
        },
        rose: {
          DEFAULT: '#C9607A',   // vibrant rose accent
          soft:    '#F7E2E7',
        },
        gold: {
          DEFAULT: '#D4A04A',   // warm gold (replaces amber)
          soft:    '#FDF3E0',
        },
        cream: {
          DEFAULT: '#FDF6F0',   // warm cream base
          dark:    '#F0E6DC',
        },
        coral: '#D64565',
        sage:  '#7EB5A6',       // muted teal-green for success states

        // ── Keep teal for backward compat (used in existing pages) ──
        teal: {
          DEFAULT: '#0F7A6C',
          deep:    '#0A5C52',
          soft:    '#E8F6F3',
        },
        // Legacy
        navy:  '#5C2D4E',       // alias → plum
        sand:  '#EFE7D8',
        amber: '#D4A04A',       // alias → gold
      },
      fontFamily: {
        sans:    ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card:   '0 4px 24px rgba(92, 45, 78, 0.10)',
        'card-dark': '0 4px 24px rgba(0, 0, 0, 0.35)',
        glow:   '0 0 0 3px rgba(201, 96, 122, 0.25)',
      },
      backgroundImage: {
        'gradient-radial-plum':
          'radial-gradient(circle at top right, rgba(242,196,206,0.25), transparent 50%), radial-gradient(circle at bottom left, rgba(212,160,74,0.12), transparent 45%)',
      },
    },
  },
  plugins: [],
};

export default config;
