import { View, Text } from "react-native";

export function Eyebrow({ children, dark }: { children: string; dark?: boolean }) {
  return (
    <Text
      className={`text-[11px] font-bold tracking-[2px] uppercase ${dark ? "text-white/50" : "text-ink/50"}`}
    >
      {children}
    </Text>
  );
}

export function SectionHeader({
  title,
  action,
  dark,
}: {
  title: string;
  action?: string;
  dark?: boolean;
}) {
  return (
    <View className="flex-row items-end justify-between mb-3">
      <Text className={`text-[21px] font-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
        {title}
      </Text>
      {action ? (
        <Text className={`text-[13px] font-semibold ${dark ? "text-white/55" : "text-ink/55"}`}>
          {action}  ›
        </Text>
      ) : null}
    </View>
  );
}

export function RatingPill({ value }: { value: string | number }) {
  return (
    <View className="px-2.5 py-1.5 rounded-full bg-black/55 flex-row items-center">
      <Text className="text-white text-[11px] font-bold">★ {value}</Text>
    </View>
  );
}

export function StatusChip({
  label,
  tone = "neutral",
  dark,
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "info" | "danger";
  dark?: boolean;
}) {
  const bg: Record<string, string> = {
    neutral: dark ? "bg-white/10" : "bg-ink/5",
    success: "bg-[#12805C]/12",
    warning: "bg-[#B54708]/12",
    info: "bg-primary/10",
    danger: "bg-[#D92D20]/10",
  };
  const fg: Record<string, string> = {
    neutral: dark ? "text-white/80" : "text-ink/70",
    success: "text-[#0E9F6E]",
    warning: "text-[#B54708]",
    info: "text-primary",
    danger: "text-[#D92D20]",
  };
  return (
    <View className={`px-3 py-1.5 rounded-full self-start ${bg[tone]}`}>
      <Text className={`text-[11px] font-bold uppercase tracking-[0.8px] ${fg[tone]}`}>{label}</Text>
    </View>
  );
}
