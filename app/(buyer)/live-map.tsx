import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { Enter } from "../../src/components/motion";
import { Icon } from "../../src/components/ui/Icon";
import {
  ArrowLeft01Icon,
  FavouriteIcon,
  BubbleChatIcon,
  PhoneIcon,
  ShoppingBag02Icon,
  Navigation01Icon,
} from "../../src/components/icons";

export default function LiveMap() {
  const router = useRouter();
  const { dark } = useTheme();

  return (
    <View className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`}>
      {/* Map background — route line + markers */}
      <View className="absolute inset-0" style={{ backgroundColor: dark ? "#000000" : "#F2F2F2" }}>
        <View
          className="absolute rounded-full bg-white/40"
          style={{ top: 200, left: 120, width: 3, height: 200, transform: [{ rotate: "15deg" }], opacity: 0.9, backgroundColor: dark ? "rgba(255,255,255,0.4)" : "rgba(10,10,14,0.25)" }}
        />

        <View className="absolute flex-col items-center" style={{ top: 180, left: 105 }}>
          <View className={`w-11 h-11 rounded-full items-center justify-center border ${dark ? "bg-white/10 border-white/15" : "bg-ink/[0.05] border-ink/10"}`}>
            <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>R</Text>
          </View>
          <View className={`mt-1.5 border px-3 py-1 rounded-full ${dark ? "bg-card-dark border-white/10" : "bg-white border-border"}`}>
            <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/50" : "text-ink/50"}`}>Restaurant</Text>
          </View>
        </View>

        <View className="absolute flex-row items-center" style={{ top: 300, left: 140 }}>
          <View className={`w-14 h-14 rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}>
            <Icon icon={Navigation01Icon} size={22} color={dark ? "#0A0A0E" : "#fff"} />
          </View>
          <View className={`ml-2 px-3 py-1.5 rounded-full border flex-row items-center gap-1.5 ${dark ? "bg-card-dark border-white/10" : "bg-white border-border"}`}>
            <Icon icon={Navigation01Icon} size={12} color={dark ? "#fff" : "#0A0A0E"} />
            <Text className={`text-[12px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>1 KM</Text>
          </View>
        </View>

        <View className="absolute flex-col items-center" style={{ top: 390, left: 240 }}>
          <View className={`w-11 h-11 rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}>
            <Text className={`text-[13px] font-inter-bold ${dark ? "text-ink" : "text-white"}`}>D</Text>
          </View>
          <View className={`mt-1.5 border px-3 py-1 rounded-full ${dark ? "bg-card-dark border-white/10" : "bg-white border-border"}`}>
            <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/50" : "text-ink/50"}`}>Home</Text>
          </View>
        </View>
      </View>

      <SafeAreaView edges={["top", "left", "right"]} className="z-50">
        <View className="w-full flex-row justify-between items-center px-6 h-14 mt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.85}
            className={`w-11 h-11 rounded-full border items-center justify-center ${dark ? "bg-card-dark border-white/10" : "bg-white border-border"}`}
          >
            <Icon icon={ArrowLeft01Icon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
          </TouchableOpacity>
          <View className={`border px-5 py-2 rounded-full ${dark ? "bg-card-dark border-white/10" : "bg-white border-border"}`}>
            <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Food</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            className={`w-11 h-11 rounded-full border items-center justify-center ${dark ? "bg-card-dark border-white/10" : "bg-white border-border"}`}
          >
            <Icon icon={FavouriteIcon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
          </TouchableOpacity>
        </View>

        <View className={`mx-6 mt-3 border rounded-[24px] p-4 flex-row items-center justify-between ${dark ? "bg-card-dark border-white/10" : "bg-white border-border"}`}>
          <View className="flex-row items-center gap-3">
            <View className={`w-11 h-11 rounded-2xl items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}>
              <Icon icon={ShoppingBag02Icon} size={20} color={dark ? "#0A0A0E" : "#fff"} />
            </View>
            <View>
              <Text className={`text-[15px] font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Arriving in 10:32</Text>
              <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`}>Invoice 12A394 · Rider nearby</Text>
            </View>
          </View>
          <View className={`border px-3 py-1.5 rounded-full ${dark ? "bg-white/10 border-white/10" : "bg-ink/[0.05] border-ink/10"}`}>
            <Text className={`text-[11px] font-inter-bold tracking-[1px] ${dark ? "text-white" : "text-ink"}`}>LIVE</Text>
          </View>
        </View>
      </SafeAreaView>

      <View className="flex-1" />

      <Enter delay={80}>
        <View className={`w-full rounded-t-[32px] border-t border-x pb-8 z-50 ${dark ? "bg-card-dark border-white/10" : "bg-white border-border"}`}>
        <View className="w-full items-center pt-4 pb-2">
          <View className={`w-12 h-1.5 rounded-full ${dark ? "bg-white/15" : "bg-ink/15"}`} />
        </View>

        <View className="px-6 pb-2 pt-2 items-center">
          <Text className={`text-[11px] uppercase tracking-[2px] font-inter-bold mb-2 ${dark ? "text-white/50" : "text-ink/50"}`}>
            Invoice 12A394
          </Text>
          <Text className={`text-[22px] font-inter-bold mb-1 text-center tracking-tight ${dark ? "text-white" : "text-ink"}`}>
            Tracking order
          </Text>

          <View className="flex-row items-baseline gap-2 mb-7 mt-2">
            <Text className={`text-[15px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Arrived in</Text>
            <Text className={`text-3xl font-inter-bold ${dark ? "text-white" : "text-ink"}`}>10 : 32</Text>
            <Text className={`text-[15px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>min</Text>
          </View>

          <View className="flex-row justify-center gap-10 mb-7 w-full">
            <TouchableOpacity activeOpacity={0.85} className="items-center gap-2" onPress={() => router.push("/(buyer)/chat" as any)}>
              <View className={`w-14 h-14 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-ink/[0.05] border-ink/10"}`}>
                <Icon icon={BubbleChatIcon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
              </View>
              <Text className={`text-[12px] font-inter-semibold ${dark ? "text-white/55" : "text-ink/55"}`}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} className="items-center gap-2" onPress={() => toast("Calling your rider…")}>
              <View className={`w-14 h-14 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-ink/[0.05] border-ink/10"}`}>
                <Icon icon={PhoneIcon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
              </View>
              <Text className={`text-[12px] font-inter-semibold ${dark ? "text-white/55" : "text-ink/55"}`}>Call driver</Text>
            </TouchableOpacity>
          </View>

          <AppButton title="Order Details" variant={dark ? "white" : "ink"} onPress={() => router.back()} />
        </View>
      </View>
      </Enter>
    </View>
  );
}
