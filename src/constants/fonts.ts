// Inter cuts, loaded in app/_layout.tsx via @expo-google-fonts/inter.
// Use font-inter-* NativeWind classes for true faces — fontWeight alone
// only synthesizes from the regular cut.
export const FontFamily = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
} as const;

// Locked premium-minimal scale
export const FontSize = {
  hero: 28,
  title: 22,
  section: 17,
  body: 15,
  label: 13,
  eyebrow: 11,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;
