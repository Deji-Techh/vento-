import { useEffect } from "react";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
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
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!burst) return;
    const { width: W, height: H } = Dimensions.get("window");
    const tx = W - 20 - 29;
    const ty = H - Math.max(insets.bottom, 12) - 29;
    x.value = burst.x;
    y.value = burst.y;
    opacity.value = 1;
    scale.value = 1;
    if (reduced) {
      const t = setTimeout(clear, 60);
      return () => clearTimeout(t);
    }
    // Arc: x glides linear, y dips via bezier, dot shrinks 1 → 0.4 with spring.
    const ease = Easing.bezier(0.22, 0.9, 0.3, 1);
    x.value = withTiming(tx, { duration: 480, easing: ease });
    y.value = withTiming(ty, { duration: 480, easing: Easing.bezier(0.5, -0.3, 0.5, 1.3) });
    scale.value = withSpring(0.4, { damping: 16, stiffness: 320 });
    opacity.value = withDelay(330, withTiming(0, { duration: 150 }));
    const t = setTimeout(clear, 540);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burst]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value - DOT / 2 }, { translateY: y.value - DOT / 2 }, { scale: scale.value }],
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
