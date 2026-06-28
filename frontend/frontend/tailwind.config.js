/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: "#0D0D0D",
          surface: "#1A1A1A",
          border: "#2A2A2A",
          green: "#00FF41",
          yellow: "#FFA500",
          red: "#FF4444",
          muted: "#666666",
          white: "#E0E0E0",
        }
      },
      fontFamily: {
        mono: ["'Courier New'", "Courier", "monospace"],
      }
    },
  },
  plugins: [],
}
