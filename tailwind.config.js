/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        "surface-dark": "#0E0E10",
        "surface-dark-2": "#17171A",
        cream: "#FFFFFF",
        paper: "#F4F4F4",
        background: "#FFFFFF",
        foreground: "#171717",
        muted: "#EBEBEB",
        "muted-foreground": "#737373",
        card: "#FFFFFF",
        "card-dark": "#141414",
        border: "#E4E4E4",
        "border-dark": "rgba(255,255,255,0.12)",
        destructive: "#D92D20",
        success: "#12805C",
        warning: "#B54708",
      },
      fontFamily: {
        inter: ["Inter_400Regular", "ui-sans-serif", "system-ui", "sans-serif"],
        "inter-medium": ["Inter_500Medium", "ui-sans-serif", "system-ui", "sans-serif"],
        "inter-semibold": ["Inter_600SemiBold", "ui-sans-serif", "system-ui", "sans-serif"],
        "inter-bold": ["Inter_700Bold", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["SpaceGrotesk_500Medium", "ui-sans-serif", "system-ui", "sans-serif"],
        "display-semibold": ["SpaceGrotesk_600SemiBold", "ui-sans-serif", "system-ui", "sans-serif"],
        "display-bold": ["SpaceGrotesk_700Bold", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "28px",
        "5xl": "32px",
      },
      boxShadow: {
        card: "0 10px 30px rgba(20,19,22,0.10)",
        floating: "0 16px 40px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
