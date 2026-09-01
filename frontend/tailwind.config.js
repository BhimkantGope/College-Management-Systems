/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B2340",
          light: "#2A3358",
          dark: "#12172C",
        },
        parchment: {
          DEFAULT: "#FAF7F0",
          dim: "#F1ECE0",
        },
        slate: {
          DEFAULT: "#5B6478",
          light: "#8A93A6",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#E4C766",
          dark: "#9C7D1A",
        },
        sage: {
          DEFAULT: "#4C7A6B",
          light: "#6FA08F",
          dark: "#375A4F",
        },
        clay: {
          DEFAULT: "#B8465B",
          light: "#D97186",
          dark: "#8F3345",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,35,64,0.06), 0 4px 16px rgba(27,35,64,0.06)",
      },
    },
  },
  plugins: [],
};
