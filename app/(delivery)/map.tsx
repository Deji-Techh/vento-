import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Navigation, RefreshCw, Map as MapIcon } from "lucide-react-native";

const mockActiveDelivery = {
  id: "delivery-001",
  order_id: "order-001",
  status: "heading_to_seller",
  delivery_fee: 500,
};

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

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FAF5EA]">
        <ActivityIndicator size="large" color="#1B1B8F" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#FAF5EA] px-5 pt-14" contentContainerStyle={{ paddingBottom: 120, gap: 16 }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">
            Route
          </Text>
          <Text className="text-[28px] font-bold text-ink mt-1">Live Map</Text>
          <Text className="text-sm text-ink/55">
            Track your delivery route in real-time
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className={`px-3 py-1.5 rounded-full border ${isTracking ? "bg-[#E3F2E8] border-[#E3F2E8]" : "bg-white border-[#E7E0D2]"}`}>
            <Text className="text-[11px] font-bold" style={{ color: isTracking ? "#12805C" : "#6E6A75" }}>
              {isTracking ? "Tracking" : "Paused"}
            </Text>
          </View>
          <TouchableOpacity className="w-11 h-11 rounded-full bg-white border border-[#E7E0D2] items-center justify-center">
            <RefreshCw color="#0A0A0E" size={16} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Placeholder */}
      <View className="bg-white rounded-[28px] overflow-hidden border border-[#E7E0D2]" style={{ height: 380 }}>
        <View className="flex-1 items-center justify-center bg-[#FAF5EA]">
          <View className="w-16 h-16 rounded-full bg-white border border-[#E7E0D2] items-center justify-center mb-4">
            <MapIcon color="#1B1B8F" size={22} />
          </View>
          <Text className="text-ink font-bold">Map View</Text>
          <Text className="text-sm text-ink/55 mt-1">
            Requires react-native-maps
          </Text>
        </View>
      </View>

      {/* Location Controls */}
      <View className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]">
        <View className="flex-row items-center gap-2 mb-3">
          <View className="w-9 h-9 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
            <Navigation color="#1B1B8F" size={16} />
          </View>
          <Text className="font-bold text-ink">Location Tracking</Text>
        </View>
        <View className="flex-row items-center justify-between gap-3">
          <View>
            <Text className="text-sm font-bold text-ink">Your Location</Text>
            <Text className="text-xs text-ink/55 mt-0.5">
              6.4541, 3.3947
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsTracking(!isTracking)}
            className={`px-5 h-14 rounded-full items-center justify-center ${
              isTracking ? "bg-white border border-[#E7E0D2]" : "bg-ink"
            }`}
          >
            <Text className={`text-sm font-bold ${isTracking ? "text-ink" : "text-white"}`}>
              {isTracking ? "Stop Tracking" : "Start Tracking"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Delivery Info */}
      {activeDelivery ? (
        <View className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]">
          <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-3">
            Active Delivery
          </Text>
          <View className="bg-[#FAF5EA] border border-[#E7E0D2] rounded-2xl p-4 gap-2.5">
            <View className="flex-row justify-between">
              <Text className="text-sm text-ink/55">Order ID</Text>
              <Text className="text-sm font-bold text-ink">
                #{activeDelivery.order_id.slice(0, 8)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-ink/55">Status</Text>
              <View className="bg-[#E8EDFF] px-2.5 py-1 rounded-full">
                <Text className="text-[11px] font-bold text-[#1B1B8F] capitalize">
                  {activeDelivery.status.replaceAll("_", " ")}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-ink/55">Delivery Fee</Text>
              <Text className="text-sm font-bold text-[#1B1B8F]">
                ₦{activeDelivery.delivery_fee}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View className="bg-white rounded-[26px] p-8 items-center border border-[#E7E0D2]">
          <Navigation color="#6E6A75" size={22} />
          <Text className="text-ink font-bold mt-3">No active delivery</Text>
          <Text className="text-sm text-ink/55 mt-1">
            Start a delivery to see the route on the map
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
