import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Heart, MessageCircle, Phone, ShoppingBag, Navigation } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

export default function LiveMap() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Map Background - Grid Pattern */}
      <View
        className="absolute inset-0"
        style={{
          backgroundColor: "#f8f9fa",
        }}
      >
        {/* Route SVG placeholder - using a View with border */}
        <View
          className="absolute border-l-4 border-blue-900 rounded-full"
          style={{
            top: 200,
            left: 100,
            width: 4,
            height: 200,
            transform: [{ rotate: "15deg" }],
          }}
        />

        {/* Origin Marker (Restaurant) */}
        <View
          className="absolute flex-col items-center"
          style={{ top: 180, left: 100 }}
        >
          <View className="w-10 h-10 bg-blue-900 rounded-full items-center justify-center shadow-lg">
            <Text className="text-white text-sm font-bold">R</Text>
          </View>
        </View>

        {/* Current Location Marker (Rider) */}
        <View
          className="absolute flex-row items-center"
          style={{ top: 300, left: 130 }}
        >
          <View className="w-12 h-12 bg-blue-900 rounded-full items-center justify-center shadow-lg">
            <Navigation color="#FFFFFF" size={20} />
          </View>
          <View className="ml-2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200 flex-row items-center gap-1">
            <Navigation color="#000080" size={12} />
            <Text className="text-blue-900 text-xs font-semibold">1 KM</Text>
          </View>
        </View>

        {/* Destination Marker (Home) */}
        <View
          className="absolute flex-col items-center"
          style={{ top: 380, left: 230 }}
        >
          <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg border border-gray-200">
            <Text className="text-blue-900 text-sm font-bold">D</Text>
          </View>
        </View>
      </View>

      {/* Top App Bar */}
      <View className="w-full flex-row justify-between items-center px-5 h-14 z-50 bg-transparent mt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white shadow-sm items-center justify-center"
        >
          <ArrowLeft color="#1C1B1B" size={20} />
        </TouchableOpacity>
        <Text className="text-base font-bold bg-white/80 px-4 py-1 rounded-full backdrop-blur-sm">
          Food
        </Text>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-white shadow-sm items-center justify-center">
          <Heart color="#000080" size={20} />
        </TouchableOpacity>
      </View>

      {/* Spacer */}
      <View className="flex-1" />

      {/* Bottom Sheet */}
      <View className="w-full bg-white rounded-t-[32px] shadow-[0_-8px_24px_rgba(0,0,128,0.08)] pb-8 z-50">
        {/* Drag Handle */}
        <View className="w-full items-center pt-4 pb-2">
          <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </View>

        <View className="px-5 pb-6 pt-2 items-center">
          {/* Top Icon */}
          <View className="w-14 h-14 bg-blue-900 rounded-2xl items-center justify-center shadow-sm mb-4">
            <ShoppingBag color="#FFFFFF" size={28} />
          </View>

          {/* Header Info */}
          <Text className="text-2xl font-bold mb-1 text-center">
            Tracking Order
          </Text>
          <Text className="text-xs text-blue-900 uppercase tracking-[0.15em] font-semibold mb-6">
            INVOICE : 12A394
          </Text>

          {/* ETA */}
          <View className="flex-row items-baseline gap-2 mb-8">
            <Text className="text-base text-gray-500">Arrived in</Text>
            <Text className="text-3xl font-bold">10 : 32</Text>
            <Text className="text-base text-gray-500">min</Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-center gap-12 mb-8 w-full">
            <TouchableOpacity className="items-center gap-3">
              <View className="w-14 h-14 rounded-full bg-blue-900 items-center justify-center shadow-sm">
                <MessageCircle color="#FFFFFF" size={24} />
              </View>
              <Text className="text-xs text-gray-500">Message</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center gap-3">
              <View className="w-14 h-14 rounded-full bg-blue-900 items-center justify-center shadow-sm">
                <Phone color="#FFFFFF" size={24} />
              </View>
              <Text className="text-xs text-gray-500">Call Driver</Text>
            </TouchableOpacity>
          </View>

          {/* Primary Action */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-full h-14 bg-blue-900 rounded-full items-center justify-center shadow-sm"
          >
            <Text className="text-white font-bold text-sm uppercase tracking-widest">
              Order Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
