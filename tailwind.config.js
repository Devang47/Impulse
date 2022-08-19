/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red_accent: '#e63946',
        chat_bg: '#eeeeee',
        time: '#98C1DB',
        msg_bg: '#254355',
        accent: '#1D3557',
        header: '#CDEAE5',
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [],
}
