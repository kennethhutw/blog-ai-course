/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js, ts, jsx, tsx}"],
    theme: {
      extend: {
        fontFamily:{
          body:'var(--font-dm-sans)',
          heading:'var(--font-dm-serif)'
        }
      },
    },
    plugins: [],
  }