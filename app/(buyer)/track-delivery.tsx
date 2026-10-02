import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { Eyebrow } from "../../src/components/ui/SectionHeader";
import { PinBoxes } from "../../src/components/ui/PinBoxes";
import { Enter } from "../../src/components/motion";
import { Icon } from "../../src/components/ui/Icon";
import {
  ArrowLeft01Icon,
  FavouriteIcon,
  Clock01Icon,
  MapPinIcon,
  Package01Icon,
  Navigation01Icon,
} from "../../src/components/icons";

const steps = [
  { id: 1, title: "Order received", time: "09:10 AM, Today", state: "done" as const },
  { id: 2, title: "On the way", time: "09:15 AM, Today", state: "active" as const },
  { id: 3, title: "Delivered", time: "Arriving in 3 min", state: "pending" as const },
];

export default function TrackDelivery() {
  const router = useRouter();
  const { dark } = useTheme();
  const insets = useSafeAreaInsets();
  const [fav, setFav] = useState(false);

  const toggleFav = () => {
    setFav(!fav);
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => {});
    }
  };

  const confirm = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    toast.success("Delivery confirmed — enjoy!");
    setTimeout(() => router.push("/(buyer)/orders" as any), 1200);
  };

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <View className="flex-row justify-between items-center px-5 h-14">
        <TouchableOpacity
          onPress={() => router.push("/(buyer)/orders" as any)}
          activeOpacity={0.85}
          className={`w-11 h-11 items-center justify-center rounded-full ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}
        >
          <Icon icon={ArrowLeft01Icon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
        </TouchableOpacity>
        <Text className={`text-[17px] font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Order status</Text>
        <TouchableOpacity
          onPress={toggleFav}
          activeOpacity={0.85}
          className={`w-11 h-11 items-center justify-center rounded-full ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}
        >
          <Icon icon={FavouriteIcon} size={20} color={fav ? "#FF5A1F" : dark ? "#fff" : "#0A0A0E"} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View className="items-center mt-2 mb-5">
          <View className={`border px-4 py-2 rounded-full ${dark ? "border-white/10" : "border-ink/10"}`}>
            <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/50" : "text-ink/50"}`}>
              Invoice 12A394
            </Text>
          </View>
        </View>

        <Enter>
          <View className="items-start mb-6">
            <Eyebrow>Rider is nearby</Eyebrow>
            <Text className={`text-[34px] font-inter-bold tracking-tight mt-2 leading-tight ${dark ? "text-white" : "text-ink"}`}>
              Arriving in 3 min
            </Text>
            <Text className={`text-[14px] font-inter mt-1.5 ${dark ? "text-white/55" : "text-ink/55"}`}>Live GPS · 1 km away</Text>
          </View>
        </Enter>

        {/* Map placeholder */}
        <Enter delay={60}>
          <View className={`border rounded-[28px] overflow-hidden mb-4 ${dark ? "bg-card-dark border-white/10" : "bg-white border-border"}`}>
            <View className="h-44 items-center justify-center">
              <View
                className="absolute rounded-full bg-white/25"
                style={{ width: 3, height: 120, transform: [{ rotate: "18deg" }] }}
              />
              <View className="absolute" style={{ top: 30 }}>
                <View className={`w-10 h-10 rounded-full items-center justify-center border ${dark ? "bg-white/10 border-white/15" : "bg-ink/[0.05] border-ink/10"}`}>
                  <Icon icon={MapPinIcon} size={18} color={dark ? "#fff" : "#0A0A0E"} />
                </View>
              </View>
              <View className="absolute" style={{ top: 92 }}>
                <View className={`w-12 h-12 rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}>
                  <Icon icon={Navigation01Icon} size={20} color={dark ? "#0A0A0E" : "#fff"} />
                </View>
              </View>
              <View className={`absolute bottom-3 right-3 border px-3 py-1.5 rounded-full flex-row items-center gap-1.5 ${dark ? "bg-ink/80 border-white/10" : "bg-white/90 border-ink/10"}`}>
                <Icon icon={Navigation01Icon} size={12} color={dark ? "#fff" : "#0A0A0E"} />
                <Text className={`text-[11px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>1 KM away</Text>
              </View>
            </View>
            <View className={`px-5 py-4 flex-row items-center justify-between border-t ${dark ? "border-white/10" : "border-ink/10"}`}>
              <View>
                <Text className={`text-[15px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Rider is nearby</Text>
                <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`}>Arriving in around 3 min</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(buyer)/live-map" as any)}
                activeOpacity={0.85}
                className={`px-4 py-2.5 rounded-full flex-row items-center gap-1.5 ${dark ? "bg-white" : "bg-ink"}`}
              >
                <Text className={`text-[13px] font-inter-bold ${dark ? "text-ink" : "text-white"}`}>Tracking</Text>
                <Icon icon={Navigation01Icon} size={14} color={dark ? "#0A0A0E" : "#fff"} />
              </TouchableOpacity>
            </View>
          </View>
        </Enter>

        {/* Timeline */}
        <View className={`border rounded-[28px] px-5 py-6 mb-4 ${dark ? "border-white/10" : "bg-white border-border"}`}>
          <View className={`h-1.5 rounded-full overflow-hidden mb-7 ${dark ? "bg-white/10" : "bg-ink/10"}`}>
            <View className={`h-full w-2/3 rounded-full ${dark ? "bg-white" : "bg-ink"}`} />
          </View>
          {steps.map((s, i) => (
            <View key={s.id} className={`flex-row gap-4 ${i < steps.length - 1 ? "mb-7" : ""}`}>
              <View
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  s.state === "pending" ? (dark ? "bg-white/10 border border-white/10" : "bg-ink/[0.05] border border-ink/10") : dark ? "bg-white" : "bg-ink"
                }`}
              >
                <Icon
                  icon={s.id === 1 ? Clock01Icon : s.id === 2 ? MapPinIcon : Package01Icon}
                  size={20}
                  color={s.state === "pending" ? (dark ? "rgba(255,255,255,0.45)" : "rgba(10,10,14,0.4)") : dark ? "#0A0A0E" : "#fff"}
                />
              </View>
              <View className="pt-1 flex-1">
                <Text className={`text-[16px] font-inter-bold mb-1 tracking-tight ${s.state === "pending" ? (dark ? "text-white/45" : "text-ink/40") : dark ? "text-white" : "text-ink"}`}>
                  {s.title}
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Icon icon={Clock01Icon} size={14} color={s.state === "pending" ? (dark ? "rgba(255,255,255,0.25)" : "rgba(10,10,14,0.25)") : dark ? "rgba(255,255,255,0.45)" : "rgba(10,10,14,0.45)"} />
                  <Text className={`text-[13px] font-inter ${s.state === "pending" ? (dark ? "text-white/45" : "text-ink/40") : dark ? "text-white/55" : "text-ink/55"}`}>
                    {s.time}
                  </Text>
                </View>
                {s.state === "active" && (
                  <View className="flex-row items-center gap-1.5 mt-1.5">
                    <View className={`w-1.5 h-1.5 rounded-full ${dark ? "bg-white" : "bg-ink"}`} />
                    <Text className={`text-[12px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Rider en route</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* PIN */}
        <View className={`border rounded-[28px] p-5 ${dark ? "border-white/10" : "bg-white border-border"}`}>
          <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-3 ${dark ? "text-white/50" : "text-ink/50"}`}>
            Delivery PIN
          </Text>
          <PinBoxes value="4821" />
          <Text className={`text-[12px] font-inter mt-3 ${dark ? "text-white/45" : "text-ink/50"}`}>Share only with your rider</Text>
        </View>
      </ScrollView>

      <View className="px-5 pt-2" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <AppButton title="Confirm Delivery" variant={dark ? "white" : "ink"} onPress={confirm} />
      </View>
    </SafeAreaView>
  );
}
