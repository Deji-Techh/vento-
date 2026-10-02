import { useState, useRef } from "react";
import { View, Text, Pressable, FlatList, Dimensions, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { AppButton } from "../src/components/ui/AppButton";

const { width } = Dimensions.get("window");

const slides = [
  {
    eyebrow: "01 — Discover",
    title: "Good food,\nclose by.",
    description: "Kitchens around campus, curated daily. No endless menus — just what hits.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900",
  },
  {
    eyebrow: "02 — Track",
    title: "Watch it\ncome to you.",
    description: "Live progress, honest ETAs, and a secure PIN handoff at your door.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900",
  },
  {
    eyebrow: "03 — Control",
    title: "You call\nthe swaps.",
    description: "Something out of stock? Approve a smart alternative before we charge you.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900",
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

  return (
    <View className="flex-1 bg-ink">
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => setCurrent(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <Image
              source={{ uri: item.image }}
              style={{ width, height: "100%" }}
              contentFit="cover"
              transition={400}
            />
            <LinearGradient
              colors={["rgba(10,10,14,0)", "rgba(10,10,14,0.55)", "#0A0A0E"]}
              locations={[0.35, 0.62, 0.85]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            />
          </View>
        )}
      />

      <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0">
        <View className="px-6 pt-3 flex-row items-center justify-between">
          <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
            <Text className="text-ink text-lg font-inter-bold">V</Text>
          </View>
          <Pressable onPress={() => router.replace("/(buyer)/browse" as any)} className="active:opacity-60">
            <Text className="text-white text-[14px] font-inter-semibold">Skip</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0">
        <SafeAreaView edges={["bottom"]}>
          <View className="px-6 pb-4">
            <View className="flex-row gap-1.5 mb-5">
              {slides.map((_, i) => (
                <Pressable key={i} onPress={() => goTo(i)} className="flex-1 h-8 justify-center">
                  <View
                    className={`h-1 rounded-full ${i <= current ? "bg-white" : "bg-white/25"}`}
                  />
                </Pressable>
              ))}
            </View>
            <Text className="text-white/50 text-[11px] font-inter-bold tracking-[2px] uppercase">
              {slides[current].eyebrow}
            </Text>
            <Text className="text-white text-[36px] font-display-bold tracking-tight leading-[38px] mt-2">
              {slides[current].title}
            </Text>
            <Text className="text-white/60 text-[15px] font-inter leading-[23px] mt-3 max-w-[300px]">
              {slides[current].description}
            </Text>
            <View className="mt-6">
              <AppButton
                title={isLast ? "Get started" : "Continue"}
                variant="white"
                onPress={() => (isLast ? router.replace("/(buyer)/browse" as any) : goTo(current + 1))}
              />
            </View>
            <Pressable onPress={() => router.push("/auth/login" as any)} className="mt-4 items-center active:opacity-60">
              <Text className="text-white/60 text-[14px] font-inter-medium">
                Have an account? <Text className="font-inter-bold text-white">Log in</Text>
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}
