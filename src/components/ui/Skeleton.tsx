import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  useReducedMotion,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";

// Loading placeholder. Gentle opacity pulse; static when Reduced Motion is on.
export function Skeleton({
  width,
  height,
  radius = 16,
  dark: darkProp,
}: {
  width: number | string;
  height: number;
  radius?: number;
  dark?: boolean;
}) {
  const dark = darkProp ?? useTheme().dark;
  const reduced = useReducedMotion();
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    if (!reduced) {
      opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
    }
  }, [reduced]);

  const style = useAnimatedStyle(() => ({ opacity: reduced ? 0.6 : opacity.value }));

  return (
    <View style={{ width: width as any, height, borderRadius: radius, overflow: "hidden" }} className={dark ? "bg-white/10" : "bg-ink/10"}>
      <Animated.View style={[{ width: "100%", height, borderRadius: radius }, style]} className={dark ? "bg-white/10" : "bg-ink/10"}>
        {!reduced && (
          <LinearGradient colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.25)", "rgba(255,255,255,0)"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ flex: 1 }} />
        )}
      </Animated.View>
    </View>
  );
}
