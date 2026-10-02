import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import { useTheme } from "../../src/contexts/ThemeContext";
import {
  MapPinIcon,
  Navigation01Icon,
  RefreshIcon,
  Package01Icon,
} from "../../src/components/icons";

const mockActiveDelivery = {
  id: "delivery-001",
  order_id: "order-001",
  status: "heading_to_seller",
  delivery_fee: 500,
};

const statusLabel = (status: string) => status.replaceAll("_", " ");

export default function DeliveryMap() {
  const { dark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeDelivery, setActiveDelivery] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setActiveDelivery(mockActiveDelivery);
      setLoading(false);
    }, 800);
  }, []);

  const toggleTracking = () => {
    const next = !isTracking;
    setIsTracking(next);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    toast.success(next ? "Location tracking started" : "Location tracking stopped");
  };

  const refreshLocation = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    toast.success("Location refreshed");
  };

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${dark ? "bg-ink" : "bg-cream"}`}>
        <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
      </View>
    );
  }

  return (
    <ScrollView className={`flex-1 px-5 pt-14 ${dark ? "bg-ink" : "bg-cream"}`} contentContainerStyle={{ paddingBottom: 120, gap: 16 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Eyebrow>Route</Eyebrow>
          <Text className={`text-[28px] font-inter-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>Live Map</Text>
          <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
            Track your delivery route in real-time
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <StatusChip label={isTracking ? "Tracking" : "Paused"} tone={isTracking ? "success" : "neutral"} />
          <TouchableOpacity
            onPress={refreshLocation}
            activeOpacity={0.85}
            className={`w-11 h-11 rounded-full border items-center justify-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
          >
            <Icon icon={RefreshIcon} size={16} color={dark ? "#FFFFFF" : "#0A0A0E"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map placeholder */}
      <View className={`rounded-[28px] overflow-hidden border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`} style={{ height: 380 }}>
        <View className={`flex-1 items-center justify-center px-8 ${dark ? "bg-transparent" : "bg-cream"}`}>
          <View className={`w-16 h-16 rounded-full border items-center justify-center mb-4 ${dark ? "bg-white/10 border-white/10" : "bg-white border-border"}`}>
            <Icon icon={MapPinIcon} size={22} color={dark ? "#FFFFFF" : "#0A0A0E"} />
          </View>
          <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Map view</Text>
          <Text className={`text-[13px] font-inter mt-1 text-center ${dark ? "text-white/55" : "text-ink/55"}`}>
            Live route preview will appear here when tracking starts
          </Text>
        </View>
      </View>

      {/* Location controls */}
      <View className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
        <View className="flex-row items-center gap-2 mb-4">
          <View className={`w-9 h-9 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
            <Icon icon={Navigation01Icon} size={16} color={dark ? "#FFFFFF" : "#0A0A0E"} />
          </View>
          <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Location tracking</Text>
        </View>
        <View className="mb-4">
          <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Your location</Text>
          <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`}>
            6.4541, 3.3947
          </Text>
        </View>
        <AppButton
          title={isTracking ? "Stop Tracking" : "Start Tracking"}
          variant={isTracking ? (dark ? "ghost-dark" : "ghost-light") : dark ? "white" : "ink"}
          onPress={toggleTracking}
        />
      </View>

      {/* Active delivery info */}
      {activeDelivery ? (
        <View className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-3 ${dark ? "text-white/55" : "text-ink/55"}`}>
            Active delivery
          </Text>
          <View className={`border rounded-[20px] p-4 gap-2.5 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
            <View className="flex-row justify-between">
              <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Order ID</Text>
              <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
                #{activeDelivery.order_id.slice(0, 8)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Status</Text>
              <StatusChip label={statusLabel(activeDelivery.status)} tone="info" />
            </View>
            <View className="flex-row justify-between">
              <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Delivery fee</Text>
              <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
                ₦{activeDelivery.delivery_fee}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View className={`rounded-[24px] p-8 items-center border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <View className={`w-12 h-12 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
            <Icon icon={Package01Icon} size={20} color={dark ? "rgba(255,255,255,0.4)" : "rgba(10,10,14,0.4)"} />
          </View>
          <Text className={`font-inter-bold mt-3 ${dark ? "text-white" : "text-ink"}`}>No active delivery</Text>
          <Text className={`text-[13px] font-inter mt-1 text-center ${dark ? "text-white/55" : "text-ink/55"}`}>
            Start a delivery to see the route on the map
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
