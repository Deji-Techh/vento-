import { Text, TouchableOpacity, ActivityIndicator, Pressable } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

// Single-accent rule: white on dark, ink on light. Ember reserved for promos.
type Variant = "white" | "ink" | "primary" | "ghost-dark" | "ghost-light";

const styles: Record<Variant, string> = {
  white: "bg-white",
  ink: "bg-ink",
  primary: "bg-primary",
  "ghost-dark": "bg-white/10 border border-white/15",
  "ghost-light": "bg-ink/5 border border-ink/10",
};

const textStyles: Record<Variant, string> = {
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

  return (
    <Animated.View style={animatedStyle} className={`w-full ${disabled ? "opacity-40" : ""}`}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.9}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 18, stiffness: 400 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 18, stiffness: 400 });
        }}
        className={`w-full h-[56px] rounded-full items-center justify-center flex-row ${styles[variant]}`}
      >
        {loading ? (
          <ActivityIndicator color={variant === "white" ? "#0A0A0E" : "#fff"} />
        ) : (
          <Text className={`text-[16px] font-bold tracking-tight ${textStyles[variant]}`}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// Text-link with press fade for secondary actions
export function TextAction({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} className="items-center active:opacity-60">
      <Text className="text-white/60 text-[14px] font-medium">{label}</Text>
    </Pressable>
  );
}
