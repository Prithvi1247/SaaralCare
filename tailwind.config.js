/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#050d1a",
          900: "#0a1628",
          800: "#0f2040",
          700: "#152a55",
          600: "#1e3a6e",
        },
        rain: {
          400: "#60b8f0",
          500: "#3a9fd4",
          600: "#1e7fb8",
          700: "#125e8a",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        slate: {
          850: "#172033",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "rain-gradient": "linear-gradient(135deg, #050d1a 0%, #0f2040 50%, #125e8a 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(15,32,64,0.9) 0%, rgba(18,94,138,0.4) 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "rain": "rain 1.5s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        rain: {
          "0%": { transform: "translateY(-10px)", opacity: 0 },
          "50%": { opacity: 1 },
          "100%": { transform: "translateY(20px)", opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
