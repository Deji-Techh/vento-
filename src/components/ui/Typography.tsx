import { Text } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

// Locked type roles: Fraunces heroes, SpaceGrotesk eyebrows/numbers, Inter body.
export function Hero({ children }: { children: React.ReactNode }) {
  const { dark } = useTheme();
  return <Text className={`text-[30px] font-serif-bold tracking-tight leading-[32px] ${dark ? "text-white" : "text-ink"}`}>{children}</Text>;
}
export function Title({ children }: { children: React.ReactNode }) {
  const { dark } = useTheme();
  return <Text className={`text-[22px] font-serif-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>{children}</Text>;
}
export function Body({ children }: { children: React.ReactNode }) {
  const { dark } = useTheme();
  return <Text className={`text-[15px] font-inter leading-[22px] ${dark ? "text-white/70" : "text-ink/70"}`}>{children}</Text>;
}
export function Caption({ children }: { children: React.ReactNode }) {
  const { dark } = useTheme();
  return <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/60"}`}>{children}</Text>;
}
