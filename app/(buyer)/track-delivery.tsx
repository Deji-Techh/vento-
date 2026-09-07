import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  Clock,
  MapPin,
  Package,
  Navigation,
  Copy,
} from "lucide-react-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { Eyebrow } from "../../src/components/ui/SectionHeader";

const steps = [
  { id: 1, title: "Order received", time: "09:10 AM, Today", status: "completed" },
  { id: 2, title: "On the way", time: "09:15 AM, Today", status: "active" },
  { id: 3, title: "Delivered", time: "Arriving in 3 min", status: "pending" },
];

const DELIVERY_PIN = "4 8 2 1";

export default function TrackDelivery() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-ink" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 h-14">
        <TouchableOpacity
          onPress={() => router.push("/(buyer)/orders")}
          activeOpacity={0.85}
          className="w-11 h-11 items-center justify-center rounded-full bg-white/10 border border-white/10"
        >
          <ArrowLeft color="#FFFFFF" size={20} />
        </TouchableOpacity>
        <Text className="text-[17px] font-bold text-white tracking-tight">
          Order status
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          className="w-11 h-11 items-center justify-center rounded-full bg-white/10 border border-white/10"
        >
          <Heart color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Invoice */}
        <View className="items-center mt-2 mb-5">
          <View className="border border-white/10 px-4 py-2 rounded-full">
            <Text className="text-[11px] text-white/50 font-bold uppercase tracking-[2px]">
              Invoice 12A394
            </Text>
          </View>
        </View>

        {/* ETA hero */}
        <View className="items-start mb-6">
          <Eyebrow dark>Rider is nearby</Eyebrow>
          <Text className="text-white text-[34px] font-bold tracking-tight mt-2 leading-tight">
            Arriving in 3 min
          </Text>
          <Text className="text-white/55 text-[14px] mt-1.5">
            Live GPS · 1 km away
          </Text>
        </View>

        {/* Map placeholder */}
        <View className="bg-[#16161C] border border-white/10 rounded-[28px] overflow-hidden mb-4">
          <View className="h-44 relative items-center justify-center">
            {/* route line */}
            <View
              className="absolute rounded-full bg-white/30"
              style={{ width: 3, height: 120, transform: [{ rotate: "18deg" }] }}
            />
            <View className="absolute flex-row items-center" style={{ top: 36 }}>
              <View className="w-10 h-10 bg-white/10 border border-white/15 rounded-full items-center justify-center">
                <MapPin color="#FFFFFF" size={18} />
              </View>
            </View>
            <View className="absolute" style={{ top: 96 }}>
              <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
                <Navigation color="#0A0A0E" size={20} />
              </View>
            </View>
            <View className="absolute bottom-3 right-3 bg-ink/80 border border-white/10 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
              <Navigation color="#FFFFFF" size={12} />
              <Text className="text-white text-[11px] font-bold">
                1 KM away
              </Text>
            </View>
          </View>
          <View className="px-5 py-4 flex-row items-center justify-between border-t border-white/10">
            <View>
              <Text className="text-white text-[15px] font-bold">
                Rider is nearby
              </Text>
              <Text className="text-white/55 text-xs mt-0.5">
                Arriving in around 3 min
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(buyer)/live-map")}
              activeOpacity={0.85}
              className="bg-white px-4 py-2.5 rounded-full flex-row items-center gap-1.5"
            >
              <Text className="text-ink text-[13px] font-bold">Tracking</Text>
              <Navigation color="#0A0A0E" size={14} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Timeline — white progress */}
        <View className="border border-white/10 rounded-[28px] px-5 py-6 mb-4">
          {/* progress line */}
          <View className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-7">
            <View className="h-full w-2/3 bg-white rounded-full" />
          </View>

          {/* Step 1 */}
          <View className="flex-row gap-4 mb-7">
            <View className="items-center">
              <View className="w-12 h-12 rounded-full bg-white items-center justify-center">
                <Clock color="#0A0A0E" size={20} />
              </View>
            </View>
            <View className="pt-1 flex-1">
              <Text className="text-white text-[16px] font-bold mb-1 tracking-tight">
                Order received
              </Text>
              <View className="flex-row items-center gap-1.5">
                <Clock color="rgba(255,255,255,0.45)" size={14} />
                <Text className="text-[13px] text-white/55">{steps[0].time}</Text>
              </View>
            </View>
          </View>

          {/* Step 2 active */}
          <View className="flex-row gap-4 mb-7">
            <View className="items-center">
              <View className="w-12 h-12 rounded-full bg-white items-center justify-center">
                <MapPin color="#0A0A0E" size={20} />
              </View>
            </View>
            <View className="pt-1 flex-1">
              <Text className="text-white text-[16px] font-bold mb-1 tracking-tight">
                On the way
              </Text>
              <View className="flex-row items-center gap-1.5 mb-1.5">
                <Clock color="rgba(255,255,255,0.45)" size={14} />
                <Text className="text-[13px] text-white/55">{steps[1].time}</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <View className="w-1.5 h-1.5 rounded-full bg-white" />
                <Text className="text-white text-xs font-bold">
                  Rider en route
                </Text>
              </View>
            </View>
          </View>

          {/* Step 3 pending */}
          <View className="flex-row gap-4">
            <View className="w-12 h-12 rounded-full bg-white/10 border border-white/10 items-center justify-center">
              <Package color="rgba(255,255,255,0.45)" size={20} />
            </View>
            <View className="pt-1 flex-1">
              <Text className="text-white/45 text-[16px] font-bold mb-1">
                Delivered
              </Text>
              <View className="flex-row items-center gap-1.5">
                <Clock color="rgba(255,255,255,0.25)" size={14} />
                <Text className="text-[13px] text-white/45">
                  {steps[2].time}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* PIN — bordered card */}
        <View className="border border-white/10 rounded-[28px] p-5 flex-row items-center justify-between">
          <View>
            <Text className="text-white/50 text-[11px] font-bold uppercase tracking-[2px] mb-2">
              Delivery PIN
            </Text>
            <Text className="text-white text-[28px] font-bold tracking-[0.2em]">
              {DELIVERY_PIN}
            </Text>
            <Text className="text-white/45 text-xs mt-1.5">
              Share only with your rider
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 items-center justify-center"
          >
            <Copy color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom action */}
      <View className="px-6 pb-6 pt-2">
        <AppButton
          title="Confirm Delivery"
          variant="white"
          onPress={() => {
            Alert.alert("Delivery confirmed", "Thank you for your order!");
            setTimeout(() => router.push("/(buyer)/orders"), 1500);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
