import { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const slides = [
  {
    image: require("../assets/onboard-1.png"),
    title: "Browse & Shop",
    description:
      "Discover thousands of products from local stores and get them delivered to your doorstep in minutes.",
  },
  {
    image: require("../assets/onboard-2.png"),
    title: "Live Map Tracking & Secure Dropoff",
    description:
      "Watch your Vento shopper navigate to your door and hand over your items safely with a delivery PIN.",
  },
  {
    image: require("../assets/onboard-3.png"),
    title: "Smart Substitution & Confirmation",
    description:
      "Can't find your item? Your shopper suggests smart alternatives — you approve or swap before checkout.",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrent(index);
  };

  const goToSlide = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        snapToInterval={width}
        decelerationRate="fast"
      >
        {slides.map((slide, index) => (
          <View key={index} className="items-center px-5" style={{ width }}>
            <View className="w-full max-w-sm mt-20 mb-8 rounded-3xl overflow-hidden bg-white items-center">
              <Image
                source={slide.image}
                className="w-full"
                style={{ width: width * 0.8, height: width * 0.45 }}
                resizeMode="contain"
              />
            </View>
            <View className="items-center mb-8 px-4 max-w-md">
              <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
                {slide.title}
              </Text>
              <Text className="text-base text-gray-500 text-center leading-relaxed">
                {slide.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row justify-center items-center gap-2 mb-12">
        {slides.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => goToSlide(index)}
            className={`h-2 rounded-full ${
              current === index ? "w-6 bg-primary" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </View>

      <View className="px-5 pb-8 pt-4">
        <Pressable
          onPress={() => router.push("/auth/login")}
          className="w-full h-10 rounded-lg bg-primary items-center justify-center mb-3 active:opacity-80"
        >
          <Text className="text-white text-sm font-semibold">Log in</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/auth/signup")}
          className="w-full h-10 rounded-lg border border-primary items-center justify-center active:opacity-80"
        >
          <Text className="text-primary text-sm font-semibold">
            I'm new, sign me up
          </Text>
        </Pressable>
        <Text className="text-center text-xs text-gray-500 mt-4 px-4">
          By logging in or registering, you agree to our{" "}
          <Text className="text-primary underline">Terms of service</Text> and{" "}
          <Text className="text-primary underline">Privacy policy</Text>.
        </Text>
      </View>
    </View>
  );
}
