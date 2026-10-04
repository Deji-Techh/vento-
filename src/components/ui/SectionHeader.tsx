import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export function Eyebrow({ children, dark: darkProp }: { children: string; dark?: boolean }) {
  const dark = darkProp ?? useTheme().dark;
  return (
    <Text
      className={`text-[11px] font-inter-bold tracking-[2px] uppercase ${dark ? "text-white/50" : "text-ink/50"}`}
    >
      {children}
    </Text>
  );
}

export function SectionHeader({
  title,
  action,
  onAction,
  dark: darkProp,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  dark?: boolean;
}) {
  const dark = darkProp ?? useTheme().dark;
  return (
    <View className="flex-row items-end justify-between mb-3">
      <Text className={`text-[21px] font-display-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
        {title}
      </Text>
      {action ? (
        onAction ? (
          <TouchableOpacity onPress={onAction} hitSlop={8}>
            <Text className={`text-[13px] font-inter-semibold ${dark ? "text-white/55" : "text-ink/55"}`}>
              {action}  ›
            </Text>
          </TouchableOpacity>
        ) : (
          <Text className={`text-[13px] font-inter-semibold ${dark ? "text-white/55" : "text-ink/55"}`}>
            {action}  ›
          </Text>
        )
      ) : null}
    </View>
  );
}

export function RatingPill({ value }: { value: string | number }) {
  return (
    <View className="px-2.5 py-1.5 rounded-full bg-black/55 flex-row items-center">
      <Text className="text-white text-[11px] font-inter-bold">★ {value}</Text>
    </View>
  );
}

export function StatusChip({
  label,
  tone = "neutral",
  dark: darkProp,
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "info" | "danger";
  dark?: boolean;
}) {
  const dark = darkProp ?? useTheme().dark;
  const bg: Record<string, string> = {
    neutral: dark ? "bg-white/10" : "bg-ink/5",
    success: "bg-success/15",
    warning: "bg-warning/15",
    info: dark ? "bg-white/10" : "bg-ink/5",
    danger: "bg-destructive/10",
  };
  const fg: Record<string, string> = {
    neutral: dark ? "text-white/80" : "text-ink/70",
    success: "text-[#0E9F6E]",
    warning: "text-warning",
    info: dark ? "text-white/80" : "text-ink/70",
    danger: "text-destructive",
  };
  return (
    <View className={`px-3 py-1.5 rounded-full self-start ${bg[tone]}`}>
      <Text className={`text-[11px] font-inter-bold uppercase tracking-[0.8px] ${fg[tone]}`}>{label}</Text>
    </View>
  );
}
