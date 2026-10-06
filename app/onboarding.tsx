import { useState, useRef } from "react";
import { View, Text, Pressable, FlatList, Dimensions, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { AppButton } from "../src/components/ui/AppButton";
import { DiscoverArt, TrackArt, ControlArt } from "../src/components/art/OnboardingArt";
import { markOnboardingSeen } from "../src/lib/firstRun";

const { width } = Dimensions.get("window");

const slides = [
  {
    eyebrow: "01 — Discover",
    title: "Good food,\nclose by.",
    description: "Kitchens around campus, curated daily. No endless menus — just what hits.",
    Art: DiscoverArt,
  },
  {
    eyebrow: "02 — Track",
    title: "Watch it\ncome to you.",
    description: "Live progress, honest ETAs, and a secure PIN handoff at your door.",
    Art: TrackArt,
  },
  {
    eyebrow: "03 — Control",
    title: "You call\nthe swaps.",
    description: "Something out of stock? Approve a smart alternative before we charge you.",
    Art: ControlArt,
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const listRef = useRef<FlatList>(null);
  const isLast = current === slides.length - 1;

  const goTo = (i: number) => {
    setCurrent(i);
    listRef.current?.scrollToOffset({ offset: i * width, animated: true });
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => {});
    }
  };

  const opacity = useSharedValue(1);
  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const exiting = useRef(false);

  // Fade through cream before leaving — no hard cuts into the app.
  const exitTo = (fn: () => void) => {
    if (exiting.current) return;
    exiting.current = true;
    markOnboardingSeen();
    opacity.value = withTiming(0, { duration: 280, easing: Easing.out(Easing.quad) });
    setTimeout(fn, 300);
  };

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: "#FAF5EA" }, fadeStyle]}>
      <SafeAreaView edges={["top"]} className="z-10">
        <View className="px-6 pt-3 flex-row items-center justify-between">
          <View className="w-10 h-10 rounded-full bg-ink items-center justify-center">
            <Text className="text-cream text-lg font-inter-bold">V</Text>
          </View>
          <Pressable onPress={() => exitTo(() => router.replace("/(buyer)/browse" as any))} className="active:opacity-60" accessibilityLabel="Skip onboarding" accessibilityRole="button">
            <Text className="text-ink/60 text-[14px] font-inter-semibold">Skip</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => setCurrent(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item, index }) => (
          <View style={{ width }} className="flex-1 justify-center px-8">
            <Animated.View key={`${index}-${current === index}`} entering={FadeIn.duration(400)}>
              <item.Art />
            </Animated.View>
          </View>
        )}
      />

      <SafeAreaView edges={["bottom"]}>
        <View className="px-6 pb-4">
          <View className="flex-row gap-1.5 mb-5">
            {slides.map((_, i) => (
              <Pressable key={i} onPress={() => goTo(i)} accessibilityLabel={`Go to slide ${i + 1}`} className="flex-1 h-8 justify-center">
                <View className={`h-1 rounded-full ${i <= current ? "bg-ink" : "bg-ink/15"}`} />
              </Pressable>
            ))}
          </View>
          <Text className="text-ink/50 text-[11px] font-inter-bold tracking-[2px] uppercase">
            {slides[current].eyebrow}
          </Text>
          <Animated.View key={current} entering={FadeIn.duration(320)}>
            <Text className="text-ink text-[36px] font-display-bold tracking-tight leading-[38px] mt-2">
              {slides[current].title}
            </Text>
            <Text className="text-ink/60 text-[15px] font-inter leading-[23px] mt-3 max-w-[300px]">
              {slides[current].description}
            </Text>
          </Animated.View>
          <View className="mt-6">
            <AppButton
              title={isLast ? "Get started" : "Continue"}
              variant="ink"
              onPress={() => (isLast ? exitTo(() => router.replace("/(buyer)/browse" as any)) : goTo(current + 1))}
            />
          </View>
          <Pressable onPress={() => exitTo(() => router.push("/auth/login" as any))} className="mt-4 items-center active:opacity-60">
            <Text className="text-ink/55 text-[14px] font-inter-medium">
              Have an account? <Text className="font-inter-bold text-ink">Log in</Text>
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
