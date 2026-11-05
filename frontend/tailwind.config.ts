import type { Config } from 'tailwindcss';

/**
 * Alehu AI — two-color design system
 *
 * PRIMARY:   Rose  #E8637A  — accent, CTAs, active states, highlights
 * BASE:      Midnight-scale — backgrounds, text, borders (near-blacks & warm whites)
 *
 * Zero teal / green / sage anywhere.
 */
const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Single accent ────────────────────────────────────────────
        rose: {
          DEFAULT: '#E8637A',   // primary accent
          dark:    '#C94D63',   // hover / pressed
          light:   '#F2A0AE',   // disabled / muted accent
          soft:    '#FDF0F2',   // tinted background (light mode)
          dim:     'rgba(232,99,122,0.15)', // subtle tint on dark
        },

        // ── Midnight scale (base neutrals) ───────────────────────────
        midnight: {
          DEFAULT: '#0D0D0D',   // richest black
          90:      '#1A1A1A',   // sidebar / dark surfaces
          80:      '#2A2A2A',   // card bg on dark
          70:      '#3D3D3D',   // borders on dark
          60:      '#5C5C5C',   // muted text on dark
        },

        // ── Warm whites (light mode) ─────────────────────────────────
        parchment: '#FAF7F4',   // page bg
        paper:     '#FFFFFF',   // card bg
        mist:      '#F2EFEC',   // subtle tinted area
        stone:     '#E8E4DF',   // borders, dividers

        // ── Semantic (still no green — use rose/gold) ────────────────
        gold:   '#D4943A',      // warning / info accent
        crimson:'#C93040',      // destructive / critical only

        // ── Legacy aliases so old classes don't break hard ───────────
        // These remap old names to new palette values
        navy:   '#0D0D0D',      // → midnight
        ink:    '#1A1A1A',      // → midnight-90
        cream:  '#FAF7F4',      // → parchment
        sand:   '#F2EFEC',      // → mist
        amber:  '#D4943A',      // → gold
        coral:  '#C93040',      // → crimson
        teal: {
          DEFAULT: '#E8637A',   // !! remapped to rose — kills any leftover text-teal
          soft:    '#FDF0F2',   // !! remapped to rose-soft
          deep:    '#C94D63',   // !! remapped to rose-dark
        },
        sage:   '#E8637A',      // !! remapped to rose — kills text-sage
      },

      fontFamily: {
        sans:    ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },

      boxShadow: {
        card:      '0 2px 16px rgba(13,13,13,0.08)',
        'card-lg': '0 8px 40px rgba(13,13,13,0.12)',
        'card-dark': '0 4px 24px rgba(0,0,0,0.40)',
        glow:      '0 0 0 3px rgba(232,99,122,0.30)',
      },
    },
  },
  plugins: [],
};

export default config;
