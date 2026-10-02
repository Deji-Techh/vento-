import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../src/stores/cartStore";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import { ArrowLeft01Icon, BanknoteIcon, CreditCardIcon } from "../../src/components/icons";
import { toast } from "sonner-native";

export default function Checkout() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [pay, setPay] = useState<"paystack" | "pod">("pod");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (items.length === 0) router.replace("/(buyer)/cart" as any);
  }, [items.length]);

  const place = async () => {
    if (!address.trim()) {
      setAddressError("Where should your rider go?");
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      clearCart();
      toast.success("Order placed — the kitchen has it");
      router.replace("/(buyer)/orders" as any);
    } catch (e: any) {
      toast.error(e.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  const methods = [
    { id: "pod", label: "Pay on delivery", hint: "Cash or transfer at the door", icon: BanknoteIcon },
    { id: "paystack", label: "Pay now with Paystack", hint: "Card, bank or USSD", icon: CreditCardIcon },
  ] as const;

  return (
    <SafeAreaView className="flex-1 bg-ink" edges={["top"]}>
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center pt-1 mb-6">
          <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full bg-white/10 items-center justify-center">
            <Icon icon={ArrowLeft01Icon} size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-[20px] font-inter-bold tracking-tight ml-3">Checkout</Text>
        </View>

        <Eyebrow dark>Dropoff</Eyebrow>
        <View className="mt-2.5">
          <TextField
            placeholder="Street, hostel, landmark…"
            value={address}
            onChangeText={(v) => {
              setAddress(v);
              if (addressError) setAddressError("");
            }}
            multiline
            numberOfLines={3}
            error={addressError}
          />
        </View>
        <View className="mt-3">
          <TextField
            placeholder="Note for the kitchen (optional)"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <View className="mt-7 mb-2.5">
          <Eyebrow dark>Payment</Eyebrow>
        </View>
        {methods.map((m) => (
          <TouchableOpacity
            key={m.id}
            onPress={() => setPay(m.id)}
            activeOpacity={0.9}
            className={`flex-row items-center px-5 py-4 rounded-[20px] mb-2 ${pay === m.id ? "bg-white" : "bg-white/[0.06] border border-white/10"}`}
          >
            <View className={`w-11 h-11 rounded-2xl items-center justify-center mr-3.5 ${pay === m.id ? "bg-ink" : "bg-white/10"}`}>
              <Icon icon={m.icon} size={20} color={pay === m.id ? "#fff" : "rgba(255,255,255,0.7)"} />
            </View>
            <View className="flex-1">
              <Text className={`text-[15px] font-inter-bold ${pay === m.id ? "text-ink" : "text-white"}`}>{m.label}</Text>
              <Text className={`text-[12px] font-inter mt-0.5 ${pay === m.id ? "text-ink/55" : "text-white/45"}`}>{m.hint}</Text>
            </View>
            <View className={`w-5 h-5 rounded-full items-center justify-center ${pay === m.id ? "bg-ink" : "border-2 border-white/25"}`}>
              {pay === m.id && <Text className="text-white text-[10px] font-inter-bold">✓</Text>}
            </View>
          </TouchableOpacity>
        ))}

        <View className="mt-7 mb-2.5">
          <Eyebrow dark>Summary</Eyebrow>
        </View>
        <View className="gap-2">
          {items.map((i) => (
            <View key={i.id} className="flex-row justify-between">
              <Text className="text-white/60 text-[14px] font-inter">{i.name} × {i.quantity}</Text>
              <Text className="text-white text-[14px] font-inter-semibold">₦{(i.price * i.quantity).toLocaleString()}</Text>
            </View>
          ))}
          <View className="flex-row justify-between mt-2 pt-3 border-t border-white/10">
            <Text className="text-white text-[17px] font-inter-bold">Total</Text>
            <Text className="text-white text-[17px] font-inter-bold">₦{getTotal().toLocaleString()}</Text>
          </View>
        </View>

        <View className="mt-6">
          <AppButton title={pay === "paystack" ? "Pay now" : "Place order"} variant="white" loading={loading} onPress={place} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
