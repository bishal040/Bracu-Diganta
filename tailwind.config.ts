import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-space': '#eef2f5',
        'space-secondary': '#f8fafc',
        'telemetry-cyan': '#2563EB', // Electric Indigo (renamed hex, kept class name for simplicity)
        'mission-blue': '#0369A1',
        'aerospace-orange': '#E11D48', // Crimson/Coral
      },
      fontFamily: {
        aeonik: ['Aeonik', 'Inter', 'system-ui', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(80px, 10vw, 140px)', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '900' }],
        section: ['clamp(48px, 6vw, 72px)', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        body: ['clamp(16px, 1.5vw, 18px)', { lineHeight: '1.6', fontWeight: '400' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow-pulse': 'glowPulse 4s infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '10%': { opacity: '0.1' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%': { filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.2))' },
          '100%': { filter: 'drop-shadow(0 0 30px rgba(0, 229, 255, 0.6))' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config
