import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

// Logo reveal: V mark springs in, wordmark fades up, then hands off.
// Short, skippable, no spinners.
export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(buyer)/browse" as any);
    }, 2100);
    return () => clearTimeout(timer);
  }, []);

  const skip = () => router.replace("/(buyer)/browse" as any);

  return (
    <Pressable onPress={skip} className="flex-1 items-center justify-center bg-ink">
      <Animated.View entering={ZoomIn.springify().damping(18).stiffness(220)}>
        <View className="w-[88px] h-[88px] rounded-[28px] bg-white items-center justify-center">
          <Text className="text-ink text-4xl font-inter-bold">V</Text>
        </View>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(160).duration(450)} className="items-center">
        <Text className="text-white text-[30px] font-inter-bold tracking-tight mt-6">Vento</Text>
        <Text className="text-white/50 text-[14px] font-inter mt-1">Good food, close by</Text>
      </Animated.View>
    </Pressable>
  );
}
