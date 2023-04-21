/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        'sogreen': '#8EDD64',
        'sogreen-600': '#8EDD64',
        'soblack': '#1D1D2A',
        'soblack-100': '#1D1D2A'
      },  
    },
  },
  plugins: [],
};
