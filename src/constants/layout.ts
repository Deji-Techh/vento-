import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const Layout = {
  window: {
    width,
    height,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 12,
    md: 18,
    lg: 24,
    xl: 32,
    full: 9999,
  },
  card: {
    heroRadius: 28,
    snapWidth: 220,
    heroHeight: 300,
  },
} as const;
