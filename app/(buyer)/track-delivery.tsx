import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Heart, Clock, Map, Package, Navigation } from "lucide-react-native";

const steps = [
  { id: 1, title: "Order received", time: "09:10 AM, Today", status: "completed" },
  { id: 2, title: "On the way", time: "09:15 AM, Today", status: "active" },
  { id: 3, title: "Delivered", time: "Arriving in 3 min", status: "pending" },
];

export default function TrackDelivery() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 h-14 bg-white">
        <TouchableOpacity
          onPress={() => router.push("/(buyer)/orders")}
          className="w-10 h-10 items-center justify-center rounded-full"
        >
          <ArrowLeft color="#000080" size={20} />
        </TouchableOpacity>
        <Text className="text-base font-bold text-blue-900">Order Status</Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full">
          <Heart color="#000080" size={20} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-5 py-4">
        {/* Invoice Info */}
        <View className="items-center mb-8">
          <Text className="text-xs text-gray-500 uppercase tracking-[0.2em] font-semibold">
            INVOICE : 12A394
          </Text>
        </View>

        {/* Illustration */}
        <View className="items-center h-48 mb-8">
          <Text className="text-6xl">🍔</Text>
        </View>

        {/* Timeline */}
        <View className="flex-1 px-4">
          {/* Step 1: Order Received */}
          <View className="flex-row gap-4 mb-8">
            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center">
              <Clock color="#000080" size={20} />
            </View>
            <View className="pt-1">
              <Text className="text-base font-bold mb-1">Order received</Text>
              <View className="flex-row items-center gap-1 text-gray-500 text-sm">
                <Clock color="#9CA3AF" size={16} />
                <Text className="text-sm text-gray-500">{steps[0].time}</Text>
              </View>
            </View>
          </View>

          {/* Step 2: On the Way (Active) */}
          <View className="flex-row gap-4 mb-8">
            <View className="w-12 h-12 rounded-full bg-blue-900 items-center justify-center shadow-md">
              <Map color="#FFFFFF" size={20} />
            </View>
            <View className="pt-1">
              <Text className="text-base font-bold mb-1">On the way</Text>
              <View className="flex-row items-center gap-1 mb-2">
                <Clock color="#9CA3AF" size={16} />
                <Text className="text-sm text-gray-500">{steps[1].time}</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(buyer)/live-map")}
                className="bg-blue-900 px-4 py-1.5 rounded-full flex-row items-center gap-2 shadow-md"
              >
                <Text className="text-white text-sm font-semibold">TRACKING</Text>
                <Navigation color="#FFFFFF" size={14} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Step 3: Delivered (Pending) */}
          <View className="flex-row gap-4">
            <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
              <Package color="#9CA3AF" size={20} />
            </View>
            <View className="pt-1">
              <Text className="text-base font-bold text-gray-500 mb-1">Delivered</Text>
              <View className="flex-row items-center gap-1">
                <Clock color="#D1D5DB" size={16} />
                <Text className="text-sm text-gray-400">{steps[2].time}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Action */}
      <View className="px-5 bg-white pb-8 pt-4">
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Delivery confirmed", "Thank you for your order!");
            setTimeout(() => router.push("/(buyer)/orders"), 1500);
          }}
          className="w-full h-14 bg-blue-900 rounded-full items-center justify-center shadow-lg"
        >
          <Text className="text-white font-bold text-base">Confirm Delivery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
