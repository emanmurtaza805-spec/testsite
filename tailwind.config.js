/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        // Botanical palette
        ivory: {
          50: '#fdfcf8',
          100: '#faf7ef',
          200: '#f5f0e2',
          300: '#efe7d0',
          400: '#e4d7b3',
        },
        sage: {
          50: '#f4f7f1',
          100: '#e6ede0',
          200: '#cdddc4',
          300: '#a8c499',
          400: '#82a874',
          500: '#5f8a52',
          600: '#4a6f42',
          700: '#3b5836',
          800: '#2f4530',
          900: '#243528',
        },
        eucalyptus: {
          400: '#7ba894',
          500: '#5a8a76',
          600: '#456b59',
        },
        lavender: {
          200: '#e8e1f0',
          300: '#d4c5e3',
          400: '#b8a3d0',
          500: '#9d83ba',
          600: '#7d6598',
        },
        blush: {
          100: '#fbf0f0',
          200: '#f5dada',
          300: '#ecc4c4',
          400: '#dfa6a6',
          500: '#cf8888',
        },
        olive: {
          400: '#9a9468',
          500: '#7d7852',
          600: '#615d40',
        },
        charcoal: {
          700: '#3a3733',
          800: '#2a2825',
          900: '#1c1b19',
        },
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-med': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin-slow': 'spin 60s linear infinite',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
        'orbit-1': 'orbit1 30s linear infinite',
        'orbit-2': 'orbit2 40s linear infinite',
        'orbit-3': 'orbit3 50s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        orbit1: {
          from: { transform: 'rotate(0deg) translateX(180px) rotate(0deg)' },
          to: { transform: 'rotate(360deg) translateX(180px) rotate(-360deg)' },
        },
        orbit2: {
          from: { transform: 'rotate(0deg) translateX(240px) rotate(0deg)' },
          to: { transform: 'rotate(360deg) translateX(240px) rotate(-360deg)' },
        },
        orbit3: {
          from: { transform: 'rotate(0deg) translateX(300px) rotate(0deg)' },
          to: { transform: 'rotate(360deg) translateX(300px) rotate(-360deg)' },
        },
      },
      boxShadow: {
        soft: '0 2px 12px rgba(95, 138, 82, 0.08)',
        card: '0 4px 24px rgba(95, 138, 82, 0.1)',
        float: '0 8px 32px rgba(95, 138, 82, 0.12)',
        glow: '0 0 24px rgba(168, 196, 153, 0.4)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
