/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: { sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"] },
      colors: { brand: { 50: "#f0fdfa", 100: "#ccfbf1", 500: "#14b8a6", 600: "#0f766e", 700: "#115e59" } },
      keyframes: { pop: { "0%": { transform: "translateY(8px)", opacity: 0 }, "100%": { transform: "none", opacity: 1 } } },
      animation: { pop: "pop .25s ease-out" },
    },
  },
  plugins: [],
};
