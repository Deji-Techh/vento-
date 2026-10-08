import { View, Text, TouchableOpacity, Switch, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import { Icon } from "./Icon";

const buzz = () => {
  if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
};

export function SettingsCard({ children }: { children: React.ReactNode }) {
  const { dark } = useTheme();
  return (
    <View className={`rounded-[24px] p-6 mb-4 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
      {children}
    </View>
  );
}

export function SettingsRow({
  icon,
  tint,
  label,
  subtitle,
  onPress,
  danger,
  last,
}: {
  icon: any;
  tint?: string;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
}) {
  const { dark } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        buzz();
        onPress?.();
      }}
      activeOpacity={0.85}
      className={`flex-row items-center py-3.5 ${last ? "" : dark ? "border-b border-white/10" : "border-b border-border"}`}
    >
      <View
        className={`w-11 h-11 rounded-full border items-center justify-center mr-3 ${
          danger ? "bg-destructive/10 border-transparent" : dark ? "bg-white/10 border-white/10" : "bg-cream border-border"
        }`}
      >
        <Icon icon={icon} size={20} color={danger ? "#D92D20" : tint ?? (dark ? "#fff" : "#0A0A0E")} />
      </View>
      <View className="flex-1">
        <Text className={`font-inter-bold ${danger ? "text-destructive" : dark ? "text-white" : "text-ink"}`}>{label}</Text>
        {subtitle ? (
          <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>{subtitle}</Text>
        ) : null}
      </View>
      {!danger && <Text className={`text-lg font-inter ${dark ? "text-white/55" : "text-ink/40"}`}>›</Text>}
    </TouchableOpacity>
  );
}

export function SettingsSwitchRow({
  label,
  subtitle,
  value,
  onValueChange,
  last,
}: {
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  last?: boolean;
}) {
  const { dark } = useTheme();
  return (
    <View className={`flex-row items-center justify-between py-3.5 ${last ? "" : dark ? "border-b border-white/10" : "border-b border-border"}`}>
      <View className="flex-1 pr-3">
        <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>{label}</Text>
        {subtitle ? (
          <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>{subtitle}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={(v) => {
          buzz();
          onValueChange(v);
        }}
        trackColor={{ true: dark ? "#FFFFFF" : "#0A0A0E", false: dark ? "rgba(255,255,255,0.2)" : "#D1D1D1" }}
      />
    </View>
  );
}

export function AppearanceCard() {
  const { dark, mode, setMode } = useTheme();
  const pick = (m: "dark" | "light") => {
    if (m !== mode) {
      buzz();
      setMode(m);
    }
  };
  return (
    <SettingsCard>
      <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-3 ${dark ? "text-white/50" : "text-ink/50"}`}>
        Appearance
      </Text>
      <View className={`flex-row rounded-full p-1 ${dark ? "bg-white/10" : "bg-ink/[0.06]"}`}>
        {(["dark", "light"] as const).map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => pick(m)}
            activeOpacity={0.9}
            className={`flex-1 py-2.5 rounded-full items-center ${mode === m ? (dark ? "bg-white" : "bg-ink") : ""}`}
          >
            <Text className={`text-[13px] font-inter-bold capitalize ${mode === m ? (dark ? "text-ink" : "text-white") : dark ? "text-white/55" : "text-ink/55"}`}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SettingsCard>
  );
}
