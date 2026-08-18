/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#050816',
        midnight: '#111827',
        panel: '#0B1020',
        ink: '#080B14',
        ivory: '#F4EFE6',
        bone: '#C8C2B8',
        mute: '#7C8496',
        cyan: {
          DEFAULT: '#00F5FF',
          dim: 'rgba(0,245,255,0.14)',
        },
        violet: {
          DEFAULT: '#8B5CF6',
          dim: 'rgba(139,92,246,0.16)',
        },
        emerald: {
          DEFAULT: '#10B981',
          dim: 'rgba(16,185,129,0.16)',
        },
        amber: {
          DEFAULT: '#F59E0B',
          dim: 'rgba(245,158,11,0.16)',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['Sora', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        orb: '0 0 40px rgba(0,245,255,0.12)',
        lift: '0 24px 60px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(0,245,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.045) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '28px 28px',
      },
      letterSpacing: {
        brand: '0.22em',
      },
    },
  },
  plugins: [],
}
