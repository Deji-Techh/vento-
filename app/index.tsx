import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function Splash() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-ink">
      <View className="w-[88px] h-[88px] rounded-[28px] bg-white items-center justify-center mb-6">
        <Text className="text-ink text-4xl font-bold">V</Text>
      </View>
      <Text className="text-white text-[30px] font-bold tracking-tight">Vento</Text>
      <Text className="text-white/50 text-[14px] mt-1">Good food, close by</Text>
      <View className="mt-6 h-6 items-center justify-center">
        <Text className="text-white/70 text-2xl font-bold tracking-widest w-12 text-center">{dots}</Text>
      </View>
    </View>
  );
}
