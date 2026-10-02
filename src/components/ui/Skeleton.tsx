import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  useReducedMotion,
} from "react-native-reanimated";

// Loading placeholder. Gentle opacity pulse; static when Reduced Motion is on.
export function Skeleton({
  width,
  height,
  radius = 16,
  dark = true,
}: {
  width: number | string;
  height: number;
  radius?: number;
  dark?: boolean;
}) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    if (!reduced) {
      opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
    }
  }, [reduced]);

  const style = useAnimatedStyle(() => ({ opacity: reduced ? 0.6 : opacity.value }));

  return (
    <Animated.View
      style={[{ width: width as any, height, borderRadius: radius }, style]}
      className={dark ? "bg-white/10" : "bg-ink/10"}
    />
  );
}
