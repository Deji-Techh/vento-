import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";

export default function Splash() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image
        source={require("../assets/vento-logo.png")}
        className="w-48 h-48"
        resizeMode="contain"
      />
      <View className="mt-8 h-6 items-center justify-center">
        <Text className="text-primary text-2xl font-bold tracking-widest w-12 text-center">
          {dots}
        </Text>
      </View>
    </View>
  );
}
