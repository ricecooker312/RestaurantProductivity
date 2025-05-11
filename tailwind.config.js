/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dfbg: '#B1A2FF',
        primary: '#5060EE',
        primaryLight: '#9EA8FF',
        error: '#EE5052',
        light: {
          100: '#ECECEC',
          200: '#EAE7FF'
        },
        dark: {
          heading: '#292626'
        }
      }
    },
  },
  plugins: [],
}