import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        forest: {
          50:  "#f0f7f0",
          100: "#dceddc",
          200: "#bcdabc",
          300: "#8dc08d",
          400: "#5a9e5a",
          500: "#3a7d3a",
          600: "#2d6330",
          700: "#254f28",
          800: "#1f3f22",
          900: "#1a341d",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
        cream: "#fdf8f0",
        bark:  "#8b6f47",
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow":  "spin 4s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
