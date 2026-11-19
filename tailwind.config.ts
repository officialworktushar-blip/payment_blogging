import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        navy: {
          50: "#f4f6fb",
          100: "#e8ecf6",
          200: "#cbd4e8",
          300: "#a3b3d4",
          400: "#7389ba",
          500: "#506aa1",
          600: "#3b5287",
          700: "#2e416d",
          800: "#243357",
          900: "#17233d",
          950: "#0f182b",
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d5d9e2",
          300: "#b1b9c9",
          400: "#8793ab",
          500: "#67748f",
          600: "#525d76",
          700: "#444d61",
          800: "#3b4252",
          900: "#343a47",
        },
        success: {
          DEFAULT: "#16a34a",
          light: "#dcfce7",
          dark: "#15803d",
        },
        error: {
          DEFAULT: "#dc2626",
          light: "#fee2e2",
          dark: "#b91c1c",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      boxShadow: {
        card: "0 6px 22px -14px rgba(23, 35, 61, 0.35)",
        lift: "0 22px 46px -24px rgba(23, 35, 61, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
