import { useState, useRef } from "react";
import { View, Text, ScrollView, Dimensions, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { AppButton } from "../src/components/ui/AppButton";
import { Reveal } from "../src/components/ui/Reveal";

const { width } = Dimensions.get("window");

const slides = [
  {
    eyebrow: "01 — Discover",
    title: "Good food,\nclose by.",
    description: "Kitchens around campus, curated daily. No endless menus — just what hits.",
    shape: "#FF5A1F",
  },
  {
    eyebrow: "02 — Track",
    title: "Watch it\ncome to you.",
    description: "Live map, honest ETAs, and a secure PIN handoff at your door.",
    shape: "#FFFFFF",
  },
  {
    eyebrow: "03 — Control",
    title: "You call\nthe swaps.",
    description: "Something out of stock? Approve a smart alternative before we charge you.",
    shape: "#1B1B8F",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: any) => {
    setCurrent(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const isLast = current === slides.length - 1;

  const handleContinue = () => {
    if (!isLast) {
      // Optimistic update: programmatic scrollTo doesn't reliably fire
      // momentum events (esp. on web), which left dots stale and the next
      // press scrolling to the same page.
      const next = current + 1;
      setCurrent(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      return;
    }
    router.push("/auth/signup");
  };

  return (
    <SafeAreaView className="flex-1 bg-ink" edges={["top", "bottom"]}>
      <View className="px-6 pt-4 flex-row items-center justify-between">
        <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
          <Text className="text-ink text-lg font-bold">V</Text>
        </View>
        <Pressable onPress={() => router.push("/auth/login")} className="active:opacity-60">
          <Text className="text-white/55 text-[14px] font-semibold">Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScroll}
      >
        {slides.map((s, i) => (
          <View key={i} className="px-6 justify-center" style={{ width }}>
            <Animated.View key={`mark-${current}`} entering={FadeIn.duration(450)}>
              <View className="h-[240px] items-start justify-end mb-10">
                <View
                  className="rounded-full"
                  style={{ width: 168, height: 168, backgroundColor: s.shape, opacity: s.shape === "#FFFFFF" ? 0.92 : 0.94 }}
                />
                <View
                  className="rounded-full bg-white/10 border border-white/15 absolute"
                  style={{ width: 92, height: 92, left: 120, top: 110 }}
                />
                <View className="absolute rounded-full bg-white" style={{ width: 14, height: 14, left: 158, top: 60 }} />
              </View>
            </Animated.View>
            <Animated.View key={`copy-${current}`} entering={FadeIn.duration(450).delay(80)}>
              <Text className="text-white/50 text-[11px] font-bold tracking-[2px] uppercase">{s.eyebrow}</Text>
              <Text className="text-white text-[44px] font-bold tracking-tight leading-[46px] mt-3">
                {s.title}
              </Text>
              <Text className="text-white/60 text-[16px] leading-[24px] mt-4 max-w-[300px]">
                {s.description}
              </Text>
            </Animated.View>
          </View>
        ))}
      </ScrollView>

      <View className="px-6 pb-2">
        <View className="flex-row items-center gap-1.5 mb-6">
          {slides.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => {
                setCurrent(i);
                scrollRef.current?.scrollTo({ x: i * width, animated: true });
              }}
              className={`h-2 rounded-full ${current === i ? "w-8 bg-white" : "w-2 bg-white/20"}`}
            />
          ))}
        </View>
        <Reveal delay={100}>
          <AppButton title={isLast ? "Get started" : "Continue"} variant="white" onPress={handleContinue} />
        </Reveal>
        <Pressable onPress={() => router.push("/auth/login")} className="mt-4 items-center active:opacity-60">
          <Text className="text-white/60 text-[14px] font-medium">
            Have an account? <Text className="font-bold text-white">Log in</Text>
          </Text>
        </Pressable>
        <Text className="text-center text-[11px] text-white/35 mt-4">
          By continuing you agree to our Terms and Privacy policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}
