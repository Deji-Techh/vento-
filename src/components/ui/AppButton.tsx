import { Text, TouchableOpacity, ActivityIndicator, Pressable, Platform } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useTheme } from "../../contexts/ThemeContext";
import * as Haptics from "expo-haptics";

// Single-accent rule: white on dark, ink on light. Ember reserved for promos.
type Variant = "white" | "ink" | "primary" | "ghost-dark" | "ghost-light";

const container: Record<Variant, string> = {
  white: "bg-white",
  ink: "bg-ink",
  primary: "bg-primary",
  "ghost-dark": "bg-white/10 border border-white/15",
  "ghost-light": "bg-ink/5 border border-ink/10",
};

const label: Record<Variant, string> = {
  white: "text-ink",
  ink: "text-white",
  primary: "text-white",
  "ghost-dark": "text-white",
  "ghost-light": "text-ink",
};

export function AppButton({
  title,
  onPress,
  variant = "white",
  loading,
  disabled,
}: {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress?.();
  };

  return (
    <Animated.View style={animatedStyle} className={`w-full ${disabled ? "opacity-40" : ""}`}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.9}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 18, stiffness: 400 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 18, stiffness: 400 });
        }}
        className={`w-full h-[56px] rounded-full items-center justify-center flex-row ${container[variant]}`}
      >
        {loading ? (
          <ActivityIndicator color={variant === "white" ? "#0A0A0E" : "#fff"} />
        ) : (
          <Text className={`text-[16px] font-inter-bold tracking-tight ${label[variant]}`}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// Text-link with press fade for secondary actions
export function TextAction({ label, onPress, dark: darkProp }: { label: string; onPress?: () => void; dark?: boolean }) {
  const dark = darkProp ?? useTheme().dark;
  return (
    <Pressable onPress={onPress} className="items-center active:opacity-60">
      <Text className={`text-[14px] font-inter-medium ${dark ? "text-white/60" : "text-ink/60"}`}>{label}</Text>
    </Pressable>
  );
}
