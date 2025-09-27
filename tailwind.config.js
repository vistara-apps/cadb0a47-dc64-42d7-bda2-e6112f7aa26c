/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        fg: 'var(--color-fg)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-neon': {
          '0%': { boxShadow: '0 0 5px var(--color-accent), 0 0 10px var(--color-accent), 0 0 15px var(--color-accent)' },
          '100%': { boxShadow: '0 0 10px var(--color-accent), 0 0 20px var(--color-accent), 0 0 30px var(--color-accent)' },
        },
        'glow': {
          '0%': { textShadow: '0 0 5px var(--color-accent)' },
          '100%': { textShadow: '0 0 10px var(--color-accent), 0 0 20px var(--color-accent)' },
        },
      },
    },
  },
  plugins: [],
}
