import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "../../src/stores/cartStore";
import { useAuth } from "../../src/contexts/AuthContext";

export default function Checkout() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "pay_on_delivery">("pay_on_delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/(buyer)/cart");
    }
  }, [items.length]);

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert("Error", "Please enter a delivery address");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearCart();
      Alert.alert("Order placed successfully!", "Your order has been sent to the seller(s)");
      router.replace("/(buyer)/orders");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <ScrollView className="flex-1 bg-white px-4 py-8">
      <Text className="text-3xl font-bold mb-8">Checkout</Text>

      <View className="gap-8">
        {/* Delivery Information */}
        <View className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <Text className="text-xl font-semibold mb-4">Delivery Information</Text>
          <View className="gap-4">
            <View>
              <Text className="text-sm font-medium mb-1">Delivery Address *</Text>
              <TextInput
                placeholder="Enter your delivery address"
                placeholderTextColor="#9CA3AF"
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                multiline
                numberOfLines={3}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                textAlignVertical="top"
              />
            </View>
            <View>
              <Text className="text-sm font-medium mb-1">Order Notes (Optional)</Text>
              <TextInput
                placeholder="Any special instructions?"
                placeholderTextColor="#9CA3AF"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={2}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <Text className="text-xl font-semibold mb-4">Payment Method</Text>
          <TouchableOpacity
            onPress={() => setPaymentMethod("pay_on_delivery")}
            className="flex-row items-center gap-2 mb-3"
          >
            <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${paymentMethod === "pay_on_delivery" ? "border-blue-900" : "border-gray-300"}`}>
              {paymentMethod === "pay_on_delivery" && <View className="w-2.5 h-2.5 rounded-full bg-blue-900" />}
            </View>
            <Text className="text-sm">Pay on Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPaymentMethod("paystack")}
            className="flex-row items-center gap-2"
          >
            <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${paymentMethod === "paystack" ? "border-blue-900" : "border-gray-300"}`}>
              {paymentMethod === "paystack" && <View className="w-2.5 h-2.5 rounded-full bg-blue-900" />}
            </View>
            <Text className="text-sm">Pay with Paystack (Online Payment)</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <Text className="text-xl font-semibold mb-4">Order Summary</Text>
          <View className="gap-3 mb-6">
            {items.map((item) => (
              <View key={item.id} className="flex-row justify-between text-sm">
                <Text>
                  {item.name} x{item.quantity}
                </Text>
                <Text>₦{(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
          </View>
          <View className="border-t border-gray-300 pt-4 mb-6">
            <View className="flex-row justify-between font-semibold text-lg">
              <Text className="text-lg font-semibold">Total:</Text>
              <Text className="text-lg font-semibold text-blue-900">
                ₦{getTotal().toFixed(2)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-blue-900 h-12 rounded-lg items-center justify-center flex-row"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-white font-semibold">
                {paymentMethod === "paystack" ? "Pay with Paystack" : "Place Order"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
