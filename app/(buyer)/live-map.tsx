import { View, Text, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { Enter } from "../../src/components/motion";
import { Icon } from "../../src/components/ui/Icon";
import { LiveMapView } from "../../src/components/LiveMapView";
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
      <View className="absolute inset-0 px-5 pt-24">
        <LiveMapView height={520} />
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
            onPress={() => toast("Saved kitchens live here once favourites ship")}
            accessibilityLabel="Save kitchen"
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
              <Text className={`text-[15px] font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Demo preview</Text>
              <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`}>Live rider appears here with orders</Text>
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
            Demo preview
          </Text>
          <Text className={`text-[22px] font-inter-bold mb-1 text-center tracking-tight ${dark ? "text-white" : "text-ink"}`}>
            Tracking connects with live orders
          </Text>

          <View className="flex-row items-baseline gap-2 mb-7 mt-2">
            <Text className={`text-[15px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Typical delivery</Text>
            <Text className={`text-3xl font-inter-bold ${dark ? "text-white" : "text-ink"}`}>~30</Text>
            <Text className={`text-[15px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>min</Text>
          </View>

          <View className="flex-row justify-center gap-10 mb-7 w-full">
            <TouchableOpacity activeOpacity={0.85} className="items-center gap-2" onPress={() => router.push("/(buyer)/chat" as any)}>
              <View className={`w-14 h-14 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-ink/[0.05] border-ink/10"}`}>
                <Icon icon={BubbleChatIcon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
              </View>
              <Text className={`text-[12px] font-inter-semibold ${dark ? "text-white/55" : "text-ink/55"}`}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} className="items-center gap-2" onPress={() => toast("Rider number appears with live orders")}>
              <View className={`w-14 h-14 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-ink/[0.05] border-ink/10"}`}>
                <Icon icon={PhoneIcon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
              </View>
              <Text className={`text-[12px] font-inter-semibold ${dark ? "text-white/55" : "text-ink/55"}`}>Call driver</Text>
            </TouchableOpacity>
          </View>

          <AppButton title="View orders" variant={dark ? "white" : "ink"} onPress={() => router.push("/(buyer)/orders" as any)} />
        </View>
      </View>
      </Enter>
    </View>
  );
}
