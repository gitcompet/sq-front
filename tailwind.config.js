/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#E0311E",
        secondary: "#F8F9FA"
      },
      colors: {
        "button-color": {
          700: "#FF6622",
        },
      },
    },
  },
  plugins: [],
};
