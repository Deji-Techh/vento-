/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1B1B8F",
        "primary-deep": "#00005C",
        "primary-ink": "#1212A8",
        "primary-foreground": "#FFFFFF",
        ink: "#0A0A0E",
        "surface-dark": "#131318",
        "surface-dark-2": "#1B1B22",
        cream: "#FAF5EA",
        paper: "#F4EFE3",
        background: "#FFFFFF",
        foreground: "#141316",
        muted: "#EFEAE2",
        "muted-foreground": "#6E6A75",
        card: "#FFFFFF",
        "card-dark": "#16161C",
        border: "#E7E0D2",
        "border-dark": "rgba(255,255,255,0.09)",
        ember: "#FF5A1F",
        destructive: "#D92D20",
        success: "#12805C",
        warning: "#B54708",
      },
      fontFamily: {
        inter: ["Inter_400Regular", "ui-sans-serif", "system-ui", "sans-serif"],
        "inter-medium": ["Inter_500Medium", "ui-sans-serif", "system-ui", "sans-serif"],
        "inter-semibold": ["Inter_600SemiBold", "ui-sans-serif", "system-ui", "sans-serif"],
        "inter-bold": ["Inter_700Bold", "ui-sans-serif", "system-ui", "sans-serif"],
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
