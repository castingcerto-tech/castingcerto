import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1A1A1A',
          950: '#111111',
          900: '#1A1A1A',
          800: '#2E2E2E',
          700: '#424242',
          600: '#585858',
        },
        brand: {
          DEFAULT: "#FFE501",
          light: "#FFE940",
          dark: "#9D7E22",
        },
        plum: {
          DEFAULT: "#86669a",
          light: "#9E7BB8",
          dark: "#6B5180",
        },
        gold: {
          DEFAULT: "#9D7E22",
        },
        cream: {
          DEFAULT: "#FEEBB9",
        },
        navy: {
          DEFAULT: '#1A1A1A',
          900: '#1A1A1A',
          800: '#242424',
          700: '#2E2E2E',
          600: '#383838',
        },
        dark: {
          DEFAULT: '#1A1A1A',
          950: '#111111',
          900: '#1A1A1A',
          800: '#242424',
          700: '#2E2E2E',
          600: '#383838',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
