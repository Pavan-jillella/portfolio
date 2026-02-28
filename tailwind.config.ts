import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        charcoal: {
          950: "#080a0f",
          900: "#0d1117",
          800: "#131920",
          700: "#1a2230",
        },
        glass: {
          white: "rgba(255,255,255,0.04)",
          border: "rgba(255,255,255,0.08)",
          hover: "rgba(255,255,255,0.07)",
        },
        neon: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          glow: "rgba(59,130,246,0.15)",
        },
        border: "rgba(255,255,255,0.08)",
        input: "rgba(255,255,255,0.08)",
        ring: "#3b82f6",
        background: "#080a0f",
        foreground: "#e8eaf0",
        primary: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "rgba(255,255,255,0.04)",
          foreground: "#e8eaf0",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "rgba(255,255,255,0.04)",
          foreground: "rgba(255,255,255,0.5)",
        },
        accent: {
          DEFAULT: "rgba(255,255,255,0.07)",
          foreground: "#e8eaf0",
        },
        popover: {
          DEFAULT: "#0d1117",
          foreground: "#e8eaf0",
        },
        card: {
          DEFAULT: "rgba(255,255,255,0.04)",
          foreground: "#e8eaf0",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-medium": "float 6s ease-in-out infinite 1s",
        "float-fast": "float 4s ease-in-out infinite 0.5s",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        grain: "grain 0.5s steps(1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-20px) rotate(3deg)" },
          "66%": { transform: "translateY(10px) rotate(-2deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "20%": { transform: "translate(2%, 1%)" },
          "30%": { transform: "translate(-1%, 2%)" },
          "40%": { transform: "translate(3%, -1%)" },
          "50%": { transform: "translate(-2%, 2%)" },
          "60%": { transform: "translate(1%, -2%)" },
          "70%": { transform: "translate(-3%, 1%)" },
          "80%": { transform: "translate(2%, 3%)" },
          "90%": { transform: "translate(-1%, -1%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
