import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "../../src/stores/cartStore";
import {
  X,
  Search,
  Package,
  ChevronRight,
  Trash2,
  Minus,
  Plus,
  Gift,
  Tag,
} from "lucide-react-native";

export default function Cart() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal } = useCart();

  const subtotal = getTotal();
  const deliveryFee = 1500;
  const total = subtotal + deliveryFee;
  const savings = items.reduce((sum, item) => sum + item.price * 0.1, 0);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 pt-10 pb-2 bg-white">
        <View className="flex-row justify-between items-center h-12">
          <TouchableOpacity
            onPress={() => router.push("/(buyer)/browse")}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <X color="#1C1B1B" size={20} />
          </TouchableOpacity>
          <Text className="text-xl font-bold tracking-tight">My Bag</Text>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
            <Search color="#1C1B1B" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Delivery Info */}
        <TouchableOpacity className="flex-row items-center py-5 border-b border-gray-200 px-5">
          <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-4">
            <Package color="#000080" size={24} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold leading-tight">
              Delivery in 26-43 mins
            </Text>
            <Text className="text-gray-500 text-sm">1723 Locust St</Text>
          </View>
          <ChevronRight color="#9CA3AF" size={24} />
        </TouchableOpacity>

        {items.length === 0 ? (
          <View className="py-16 px-5 items-center">
            <Text className="text-gray-500">Your bag is empty</Text>
            <TouchableOpacity
              onPress={() => router.push("/(buyer)/browse")}
              className="mt-4 px-6 py-3 bg-blue-900 rounded-xl"
            >
              <Text className="text-white font-semibold">Browse Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Cart Items */}
            <View className="py-2 px-5">
              {items.map((item) => (
                <View
                  key={item.id}
                  className="flex-row items-center py-4 border-b border-gray-100"
                >
                  <Image
                    source={{
                      uri: item.image_url || "https://via.placeholder.com/64",
                    }}
                    className="w-16 h-16 rounded-lg mr-4 bg-gray-100"
                    resizeMode="cover"
                  />
                  <View className="flex-1 min-w-0">
                    <Text className="text-[15px] font-bold leading-tight mb-1 truncate">
                      {item.name}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      ₦{item.price.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row items-center bg-gray-100 rounded-full p-1 ml-2">
                    {item.quantity === 1 ? (
                      <TouchableOpacity
                        onPress={() => removeItem(item.id)}
                        className="w-8 h-8 items-center justify-center rounded-full bg-white shadow-sm"
                      >
                        <Trash2 color="#1C1B1B" size={16} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 items-center justify-center rounded-full bg-white shadow-sm"
                      >
                        <Minus color="#1C1B1B" size={16} />
                      </TouchableOpacity>
                    )}
                    <Text className="w-8 text-center font-bold text-[15px]">
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 items-center justify-center rounded-full bg-blue-900 shadow-sm"
                    >
                      <Plus color="#FFFFFF" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Options */}
            <View className="border-t border-gray-200 pt-2 px-5">
              <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-200">
                <View className="flex-row items-center">
                  <Gift color="#1C1B1B" size={24} />
                  <Text className="text-lg font-bold ml-3">
                    Make this order a gift
                  </Text>
                </View>
                <ChevronRight color="#9CA3AF" size={24} />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-200 mb-6">
                <View className="flex-row items-center">
                  <Tag color="#1C1B1B" size={24} />
                  <Text className="text-lg font-bold ml-3">
                    Add promo code
                  </Text>
                </View>
                <ChevronRight color="#9CA3AF" size={24} />
              </TouchableOpacity>
            </View>

            {/* Alerts & Savings */}
            {subtotal < 5000 && (
              <View className="px-5 mb-4">
                <View className="bg-gray-100 rounded-2xl p-4 flex-row items-center justify-between">
                  <Text className="text-[14px] leading-snug flex-1 mr-4">
                    Add ₦{(5000 - subtotal).toLocaleString()} more to avoid the
                    delivery fee.
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(buyer)/browse")}
                    className="bg-blue-900 px-4 py-2.5 rounded-xl"
                  >
                    <Text className="text-white font-bold text-[14px]">
                      Surprise Me!
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {savings > 0 && (
              <View className="px-5 mb-4">
                <View className="bg-blue-50 rounded-2xl p-4 items-center">
                  <Text className="text-[15px]">
                    You're saving ₦{Math.round(savings).toLocaleString()} with{" "}
                    <Text className="font-bold">Vento</Text>
                  </Text>
                </View>
              </View>
            )}

            {/* Subtotal */}
            <View className="flex-row justify-between items-center py-6 mt-2 border-b border-gray-200 px-5">
              <Text className="text-xl font-bold">Order Subtotal</Text>
              <Text className="text-xl font-bold">
                ₦{total.toLocaleString()}
              </Text>
            </View>

            {/* Buy It Again */}
            <View className="pt-6 px-5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold">Buy It Again</Text>
                <TouchableOpacity className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full">
                  <Text className="text-sm font-bold">More items</Text>
                  <ChevronRight size={16} />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer Checkout */}
      {items.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 pt-4 px-5 pb-6">
          <TouchableOpacity
            onPress={() => router.push("/(buyer)/checkout")}
            className="w-full bg-blue-900 h-10 rounded-lg items-center justify-center"
          >
            <Text className="text-white text-sm font-medium">Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
