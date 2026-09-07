import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Phone,
  ShoppingBag,
  Navigation,
} from "lucide-react-native";
import { AppButton } from "../../src/components/ui/AppButton";

const { width, height } = Dimensions.get("window");

export default function LiveMap() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-ink">
      {/* Map background — dark with route line */}
      <View className="absolute inset-0" style={{ backgroundColor: "#0A0A0E" }}>
        {/* Route — white line */}
        <View
          className="absolute rounded-full bg-white/40"
          style={{
            top: 200,
            left: 120,
            width: 3,
            height: 200,
            transform: [{ rotate: "15deg" }],
            opacity: 0.9,
          }}
        />

        {/* Origin marker (restaurant) */}
        <View
          className="absolute flex-col items-center"
          style={{ top: 180, left: 105 }}
        >
          <View className="w-11 h-11 bg-white/10 border border-white/15 rounded-full items-center justify-center">
            <Text className="text-white text-sm font-bold">R</Text>
          </View>
          <View className="mt-1.5 bg-[#16161C] border border-white/10 px-3 py-1 rounded-full">
            <Text className="text-[11px] font-bold uppercase tracking-[2px] text-white/50">
              Restaurant
            </Text>
          </View>
        </View>

        {/* Current location marker (rider) */}
        <View
          className="absolute flex-row items-center"
          style={{ top: 300, left: 140 }}
        >
          <View className="w-14 h-14 bg-white rounded-full items-center justify-center">
            <Navigation color="#0A0A0E" size={22} />
          </View>
          <View className="ml-2 bg-[#16161C] px-3 py-1.5 rounded-full border border-white/10 flex-row items-center gap-1.5">
            <Navigation color="#FFFFFF" size={12} />
            <Text className="text-white text-xs font-bold">1 KM</Text>
          </View>
        </View>

        {/* Destination marker (home) */}
        <View
          className="absolute flex-col items-center"
          style={{ top: 390, left: 240 }}
        >
          <View className="w-11 h-11 bg-white rounded-full items-center justify-center">
            <Text className="text-ink text-sm font-bold">D</Text>
          </View>
          <View className="mt-1.5 bg-[#16161C] border border-white/10 px-3 py-1 rounded-full">
            <Text className="text-[11px] font-bold uppercase tracking-[2px] text-white/50">
              Home
            </Text>
          </View>
        </View>
      </View>

      <SafeAreaView edges={["top", "left", "right"]} className="z-50">
        {/* Top bar */}
        <View className="w-full flex-row justify-between items-center px-6 h-14 mt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.85}
            className="w-11 h-11 rounded-full bg-[#16161C] border border-white/10 items-center justify-center"
          >
            <ArrowLeft color="#FFFFFF" size={20} />
          </TouchableOpacity>
          <View className="bg-[#16161C] border border-white/10 px-5 py-2 rounded-full">
            <Text className="text-[13px] font-bold text-white">Food</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            className="w-11 h-11 rounded-full bg-[#16161C] border border-white/10 items-center justify-center"
          >
            <Heart color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>

        {/* Floating ETA card — dark */}
        <View className="mx-6 mt-3 bg-[#16161C] border border-white/10 rounded-[24px] p-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-11 h-11 rounded-2xl bg-white items-center justify-center">
              <ShoppingBag color="#0A0A0E" size={20} />
            </View>
            <View>
              <Text className="text-white text-[15px] font-bold tracking-tight">
                Arriving in 10:32
              </Text>
              <Text className="text-white/55 text-xs mt-0.5">
                Invoice 12A394 · Rider nearby
              </Text>
            </View>
          </View>
          <View className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-full">
            <Text className="text-white text-[11px] font-bold tracking-[1px]">
              LIVE
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Spacer */}
      <View className="flex-1" />

      {/* Bottom sheet */}
      <View className="w-full bg-[#16161C] rounded-t-[32px] border-t border-x border-white/10 pb-8 z-50">
        {/* Drag handle */}
        <View className="w-full items-center pt-4 pb-2">
          <View className="w-12 h-1.5 bg-white/15 rounded-full" />
        </View>

        <View className="px-6 pb-2 pt-2 items-center">
          {/* Header info */}
          <Text className="text-[11px] text-white/50 uppercase tracking-[2px] font-bold mb-2">
            Invoice 12A394
          </Text>
          <Text className="text-white text-[22px] font-bold mb-1 text-center tracking-tight">
            Tracking order
          </Text>

          {/* ETA */}
          <View className="flex-row items-baseline gap-2 mb-7 mt-2">
            <Text className="text-[15px] text-white/55">Arrived in</Text>
            <Text className="text-white text-3xl font-bold">10 : 32</Text>
            <Text className="text-[15px] text-white/55">min</Text>
          </View>

          {/* Action buttons */}
          <View className="flex-row justify-center gap-10 mb-7 w-full">
            <TouchableOpacity
              activeOpacity={0.85}
              className="items-center gap-2"
              onPress={() => router.push("/(buyer)/chat")}
            >
              <View className="w-14 h-14 rounded-full bg-white/10 border border-white/10 items-center justify-center">
                <MessageCircle color="#FFFFFF" size={22} />
              </View>
              <Text className="text-xs text-white/55 font-semibold">
                Message
              </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} className="items-center gap-2">
              <View className="w-14 h-14 rounded-full bg-white/10 border border-white/10 items-center justify-center">
                <Phone color="#FFFFFF" size={22} />
              </View>
              <Text className="text-xs text-white/55 font-semibold">
                Call driver
              </Text>
            </TouchableOpacity>
          </View>

          {/* Primary CTA — white */}
          <AppButton
            title="Order Details"
            variant="white"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </View>
  );
}
