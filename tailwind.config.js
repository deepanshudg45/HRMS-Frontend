/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0A2540",
        secondary: "#1E90FF",
        success: "#28A745",
        danger: "#DC3545",
      },
    },
  },
  plugins: [],
};