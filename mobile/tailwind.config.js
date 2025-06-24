/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dfbg: '#B1A2FF',
        footerbg: '#8C79EA',
        primary: '#5060EE',
        primaryLight: '#9EA8FF',
        error: '#EE5052',
        errorDark: '#D74042',
        light: {
          100: '#ECECEC',
          200: '#EAE7FF'
        },
        dark: {
          heading: '#292626',
          footer: '#6448F4',
          button: '#0014C7',
          green: "#009732"
        },
        button: {
          error: '#FF9F9F',
          good: '#AEF9AE',
          warning: '#F9E1AE',
          primaryDisabled: '#A3ACFF'
        },
        link: '#705DFF'
      }
    },
  },
  plugins: [],
}