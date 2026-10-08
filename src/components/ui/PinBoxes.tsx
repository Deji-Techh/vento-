import { View, Text, Pressable, Platform } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { useTheme } from "../../contexts/ThemeContext";

// Boxed handoff PIN. Big Inter numerals, tap-to-copy with toast confirm.
export function PinBoxes({ value, dark: darkProp }: { value: string; dark?: boolean }) {
  const dark = darkProp ?? useTheme().dark;
  const digits = value.split("");

  const copy = async () => {
    try {
      await Clipboard.setStringAsync(value);
    } catch {}
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    toast.success("PIN copied to clipboard");
  };

  return (
    <View>
      <View className="flex-row gap-2.5">
        {digits.map((d, i) => (
          <View
            key={i}
            className={`w-14 h-16 rounded-[20px] border items-center justify-center ${
              dark ? "bg-white/[0.06] border-white/10" : "bg-ink/[0.04] border-ink/10"
            }`}
          >
            <Text className={`text-[22px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>{d}</Text>
          </View>
        ))}
      </View>
      <Pressable onPress={copy} className="mt-3 self-start active:opacity-60">
        <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
          Copy PIN
        </Text>
      </Pressable>
    </View>
  );
}
