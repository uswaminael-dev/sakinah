import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          deep: "#0B3D2E",
          DEFAULT: "#1B5E3F",
          light: "#2F7A57",
          gold: "#C9A861",
        },
        midnight: {
          navy: "#0F1729",
          DEFAULT: "#1A2438",
          silver: "#B8C2D9",
        },
        desert: {
          sand: "#E8DCC8",
          beige: "#D4C4A8",
          brown: "#8B6F47",
        },
        moonlight: {
          grey: "#E5E7EB",
          white: "#FAFAFA",
          blue: "#A8C5E0",
        },
        garden: {
          olive: "#6B7B4F",
          emerald: "#3D6B52",
          cream: "#F5F0E1",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config