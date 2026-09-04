import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Navigation, RefreshCw } from "lucide-react-native";

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
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-6 gap-6">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Live Map</Text>
          <Text className="text-gray-500">
            Track your delivery route in real-time
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className={`px-2 py-1 rounded-full ${isTracking ? "bg-green-100" : "bg-gray-100"}`}>
            <Text className={`text-xs font-semibold ${isTracking ? "text-green-700" : "text-gray-700"}`}>
              {isTracking ? "Tracking" : "Not tracking"}
            </Text>
          </View>
          <TouchableOpacity className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center">
            <RefreshCw color="#1C1B1B" size={16} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Placeholder */}
      <View className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200" style={{ height: 400 }}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-6xl mb-4">🗺️</Text>
          <Text className="text-gray-500 font-medium">Map View</Text>
          <Text className="text-sm text-gray-400 mt-1">
            Requires react-native-maps
          </Text>
        </View>
      </View>

      {/* Location Controls */}
      <View className="bg-white rounded-xl p-4 border border-gray-200">
        <View className="flex-row items-center gap-2 mb-3">
          <Navigation color="#000080" size={16} />
          <Text className="font-semibold text-gray-900">Location Tracking</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium">Your Location</Text>
            <Text className="text-xs text-gray-500">
              6.4541, 3.3947
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsTracking(!isTracking)}
            className={`px-4 py-2 rounded-xl ${
              isTracking ? "bg-red-500" : "bg-blue-900"
            }`}
          >
            <Text className="text-white text-sm font-semibold">
              {isTracking ? "Stop Tracking" : "Start Tracking"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Delivery Info */}
      {activeDelivery ? (
        <View className="bg-white rounded-xl p-4 border border-gray-200">
          <Text className="font-semibold text-gray-900 mb-3">
            Active Delivery
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-500">Order ID</Text>
              <Text className="text-sm font-medium">
                #{activeDelivery.order_id.slice(0, 8)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-500">Status</Text>
              <View className="bg-blue-100 px-2 py-0.5 rounded-full">
                <Text className="text-xs font-semibold text-blue-700 capitalize">
                  {activeDelivery.status.replace("_", " ")}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-500">Delivery Fee</Text>
              <Text className="text-sm font-medium">
                ₦{activeDelivery.delivery_fee}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View className="bg-white rounded-xl p-8 items-center border border-gray-200">
          <Navigation color="#9CA3AF" size={48} />
          <Text className="text-gray-500 mt-3">No active delivery</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Start a delivery to see the route on the map
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
