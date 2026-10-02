import { useEffect } from "react";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  useReducedMotion,
} from "react-native-reanimated";
import { useFly } from "../stores/flyStore";

const DOT = 22;

// Global fly-to-bag layer. Screens fire coordinates via useFly.fire();
// a dot arcs to the bag button, then clears. Mounted once in root Shell.
export function FlyLayer() {
  const burst = useFly((s) => s.burst);
  const clear = useFly((s) => s.clear);
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!burst) return;
    const { width: W, height: H } = Dimensions.get("window");
    const tx = W - 20 - 29;
    const ty = H - Math.max(insets.bottom, 12) - 29;
    x.value = burst.x;
    y.value = burst.y;
    opacity.value = 1;
    if (reduced) {
      const t = setTimeout(clear, 60);
      return () => clearTimeout(t);
    }
    const ease = Easing.out(Easing.quad);
    x.value = withTiming(tx, { duration: 480, easing: ease });
    y.value = withTiming(ty, { duration: 480, easing: ease });
    opacity.value = withDelay(330, withTiming(0, { duration: 150 }));
    const t = setTimeout(clear, 540);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burst]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value - DOT / 2 }, { translateY: y.value - DOT / 2 }],
    opacity: opacity.value,
  }));

  if (!burst) return null;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          width: DOT,
          height: DOT,
          borderRadius: DOT / 2,
          backgroundColor: "#fff",
          zIndex: 999,
          pointerEvents: "none" as const,
        },
        style,
      ]}
    />
  );
}
