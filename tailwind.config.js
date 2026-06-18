/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          deep: "rgb(var(--color-emerald-deep) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-emerald) / <alpha-value>)",
          light: "rgb(var(--color-emerald-light) / <alpha-value>)",
          gold: "rgb(var(--color-emerald-gold) / <alpha-value>)",
        },
        app: {
          bg: "rgb(var(--app-bg) / <alpha-value>)",
          panel: "rgb(var(--app-panel) / <alpha-value>)",
          field: "rgb(var(--app-field) / <alpha-value>)",
          border: "rgb(var(--app-border) / <alpha-value>)",
          muted: "rgb(var(--app-muted) / <alpha-value>)",
          accent: "rgb(var(--app-accent) / <alpha-value>)",
          accentHover: "rgb(var(--app-accent-hover) / <alpha-value>)",
          accentText: "rgb(var(--app-accent-text) / <alpha-value>)",
          ring: "rgb(var(--app-ring) / <alpha-value>)",
          danger: "rgb(var(--app-danger) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
