import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../src/stores/cartStore";
import { ChevronLeft } from "lucide-react-native";
import { AppButton } from "../../src/components/ui/AppButton";

export default function Checkout() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [pay, setPay] = useState<"paystack" | "pod">("pod");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (items.length === 0) router.replace("/(buyer)/cart" as any);
  }, [items.length]);

  const place = async () => {
    if (!address.trim()) {
      Alert.alert("Add an address", "Where should your rider go?");
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      clearCart();
      Alert.alert("Order placed", "The kitchen has your order.");
      router.replace("/(buyer)/orders" as any);
    } catch (e: any) {
      Alert.alert("Failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <SafeAreaView className="flex-1 bg-ink" edges={["top"]}>
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center pt-1 mb-6">
          <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full bg-white/10 items-center justify-center">
            <ChevronLeft color="#fff" size={22} />
          </TouchableOpacity>
          <Text className="text-white text-[20px] font-bold tracking-tight ml-3">Checkout</Text>
        </View>

        <Text className="text-white/50 text-[11px] font-bold tracking-[2px] uppercase mb-2.5">Dropoff</Text>
        <TextInput
          placeholder="Street, hostel, landmark…"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={address}
          onChangeText={setAddress}
          multiline
          className="bg-white/[0.06] border border-white/10 rounded-[20px] px-5 py-4 text-[15px] text-white min-h-[88px]"
          textAlignVertical="top"
        />
        <TextInput
          placeholder="Note for the kitchen (optional)"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={notes}
          onChangeText={setNotes}
          className="bg-white/[0.06] border border-white/10 rounded-[20px] px-5 py-4 text-[15px] text-white mt-3"
        />

        <Text className="text-white/50 text-[11px] font-bold tracking-[2px] uppercase mt-7 mb-2.5">Payment</Text>
        {(["pod", "paystack"] as const).map((m) => (
          <TouchableOpacity key={m} onPress={() => setPay(m)} activeOpacity={0.9} className={`flex-row items-center px-5 py-[18px] rounded-[20px] mb-2 ${pay === m ? "bg-white" : "bg-white/[0.06]"}`}>
            <Text className={`text-[15px] font-bold flex-1 ${pay === m ? "text-ink" : "text-white"}`}>
              {m === "pod" ? "Pay on delivery" : "Pay now with Paystack"}
            </Text>
            <View className={`w-5 h-5 rounded-full items-center justify-center ${pay === m ? "bg-ink" : "border-2 border-white/25"}`}>
              {pay === m && <Text className="text-white text-[10px] font-bold">✓</Text>}
            </View>
          </TouchableOpacity>
        ))}

        <Text className="text-white/50 text-[11px] font-bold tracking-[2px] uppercase mt-7 mb-2.5">Summary</Text>
        <View className="gap-2">
          {items.map((i) => (
            <View key={i.id} className="flex-row justify-between">
              <Text className="text-white/60 text-[14px]">{i.name} × {i.quantity}</Text>
              <Text className="text-white text-[14px] font-semibold">₦{(i.price * i.quantity).toLocaleString()}</Text>
            </View>
          ))}
          <View className="flex-row justify-between mt-2 pt-3 border-t border-white/10">
            <Text className="text-white text-[17px] font-bold">Total</Text>
            <Text className="text-white text-[17px] font-bold">₦{getTotal().toLocaleString()}</Text>
          </View>
        </View>

        <View className="mt-6">
          <AppButton title={pay === "paystack" ? "Pay now" : "Place order"} variant="white" loading={loading} onPress={place} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
