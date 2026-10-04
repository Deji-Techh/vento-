import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useAuth, Role } from "../src/contexts/AuthContext";
import { hasSeenOnboarding } from "../src/lib/firstRun";

const WORD = "Vento";

function homeFor(role: Role | null): string {
  if (role === "seller") return "/(seller)/dashboard";
  if (role === "delivery_agent") return "/(delivery)/dashboard";
  if (role === "admin") return "/(admin)/index";
  return "/(buyer)/browse";
}

// Splash doubles as the launch router: first-timers go to onboarding,
// returners land straight where they belong.
export default function Splash() {
  const router = useRouter();
  const { loading: authLoading, user, role } = useAuth();
  const [count, setCount] = useState(0);
  const [seen, setSeen] = useState<boolean | null>(null);
  const done = count >= WORD.length;
  const ready = done && seen !== null && !authLoading;
  const scale = useSharedValue(1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const gone = useRef(false);

  const go = () => {
    if (gone.current || !ready) return;
    gone.current = true;
    const dest = !seen ? "/onboarding" : !user ? "/(buyer)/browse" : !role ? "/auth/choose-role" : homeFor(role);
    router.replace(dest as any);
  };

  useEffect(() => {
    // Warm the onboarding photos while the wordmark types.
    Image.prefetch([
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1080&q=80",
    ]);
    hasSeenOnboarding().then(setSeen);
  }, []);

  useEffect(() => {
    if (count < WORD.length) {
      timers.current.push(setTimeout(() => setCount((c) => c + 1), 70));
    }
    const stash = timers.current;
    return () => stash.forEach(clearTimeout);
  }, [count]);

  useEffect(() => {
    if (!ready) return;
    timers.current.push(
      setTimeout(() => {
        scale.value = withTiming(1.1, { duration: 300, easing: Easing.out(Easing.quad) });
      }, 200)
    );
    timers.current.push(setTimeout(go, 650));
    const stash = timers.current;
    return () => stash.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const zoomStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={go} className="flex-1 items-center justify-center bg-ink">
      <Animated.View style={[{ alignItems: "center" }, zoomStyle]}>
        <View className="flex-row items-center h-[46px]">
          <Text className="text-white text-[40px] font-display-bold tracking-tight">
            {WORD.slice(0, count)}
          </Text>
          {!done && <View className="w-[3px] h-[32px] bg-white/80 ml-1" />}
        </View>
        {done && (
          <Animated.View entering={FadeIn.duration(350)}>
            <Text className="text-white/50 text-[14px] font-inter mt-2">Good food, close by</Text>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}
