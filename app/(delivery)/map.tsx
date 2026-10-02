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
      <View className="flex-1 items-center justify-center bg-cream">
        <ActivityIndicator size="large" color="#0A0A0E" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-cream px-5 pt-14" contentContainerStyle={{ paddingBottom: 120, gap: 16 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Eyebrow>Route</Eyebrow>
          <Text className="text-[28px] font-inter-bold text-ink tracking-tight mt-1">Live Map</Text>
          <Text className="text-[13px] font-inter text-ink/55">
            Track your delivery route in real-time
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <StatusChip label={isTracking ? "Tracking" : "Paused"} tone={isTracking ? "success" : "neutral"} />
          <TouchableOpacity
            onPress={refreshLocation}
            activeOpacity={0.85}
            className="w-11 h-11 rounded-full bg-white border border-border items-center justify-center"
          >
            <Icon icon={RefreshIcon} size={16} color="#0A0A0E" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map placeholder */}
      <View className="bg-white rounded-[28px] overflow-hidden border border-border" style={{ height: 380 }}>
        <View className="flex-1 items-center justify-center bg-cream px-8">
          <View className="w-16 h-16 rounded-full bg-white border border-border items-center justify-center mb-4">
            <Icon icon={MapPinIcon} size={22} color="#0A0A0E" />
          </View>
          <Text className="text-ink font-inter-bold">Map view</Text>
          <Text className="text-[13px] font-inter text-ink/55 mt-1 text-center">
            Live route preview will appear here when tracking starts
          </Text>
        </View>
      </View>

      {/* Location controls */}
      <View className="bg-white rounded-[24px] p-6 border border-border">
        <View className="flex-row items-center gap-2 mb-4">
          <View className="w-9 h-9 rounded-full bg-cream border border-border items-center justify-center">
            <Icon icon={Navigation01Icon} size={16} color="#0A0A0E" />
          </View>
          <Text className="font-inter-bold text-ink">Location tracking</Text>
        </View>
        <View className="mb-4">
          <Text className="text-[13px] font-inter-bold text-ink">Your location</Text>
          <Text className="text-[12px] font-inter text-ink/55 mt-0.5">
            6.4541, 3.3947
          </Text>
        </View>
        <AppButton
          title={isTracking ? "Stop Tracking" : "Start Tracking"}
          variant={isTracking ? "ghost-light" : "ink"}
          onPress={toggleTracking}
        />
      </View>

      {/* Active delivery info */}
      {activeDelivery ? (
        <View className="bg-white rounded-[24px] p-6 border border-border">
          <Text className="text-[11px] font-inter-bold uppercase tracking-[2px] text-ink/55 mb-3">
            Active delivery
          </Text>
          <View className="bg-cream border border-border rounded-[20px] p-4 gap-2.5">
            <View className="flex-row justify-between">
              <Text className="text-[13px] font-inter text-ink/55">Order ID</Text>
              <Text className="text-[13px] font-inter-bold text-ink">
                #{activeDelivery.order_id.slice(0, 8)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-[13px] font-inter text-ink/55">Status</Text>
              <StatusChip label={statusLabel(activeDelivery.status)} tone="info" />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[13px] font-inter text-ink/55">Delivery fee</Text>
              <Text className="text-[13px] font-inter-bold text-ink">
                ₦{activeDelivery.delivery_fee}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View className="bg-white rounded-[24px] p-8 items-center border border-border">
          <View className="w-12 h-12 rounded-full bg-cream border border-border items-center justify-center">
            <Icon icon={Package01Icon} size={20} color="rgba(10,10,14,0.4)" />
          </View>
          <Text className="text-ink font-inter-bold mt-3">No active delivery</Text>
          <Text className="text-[13px] font-inter text-ink/55 mt-1 text-center">
            Start a delivery to see the route on the map
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
