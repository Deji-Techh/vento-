/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#000080",
        "primary-foreground": "#FFFFFF",
        background: "#FFFFFF",
        foreground: "#1C1B1B",
        muted: "#F0EDEE",
        "muted-foreground": "#797587",
        card: "#FCF9F8",
        border: "#C9C3D9",
        destructive: "#BA1A1A",
      },
      fontFamily: {
        sans: ["Campton"],
        heading: ["Campton"],
      },
    },
  },
  plugins: [],
};
