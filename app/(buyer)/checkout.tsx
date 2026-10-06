import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../src/stores/cartStore";
import { useTheme } from "../../src/contexts/ThemeContext";
import * as Haptics from "expo-haptics";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import { ArrowLeft01Icon, BanknoteIcon, CreditCardIcon, CheckmarkCircle01Icon } from "../../src/components/icons";
import { toast } from "sonner-native";
import Animated, { ZoomIn, FadeIn } from "react-native-reanimated";

export default function Checkout() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { dark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [pay, setPay] = useState<"paystack" | "pod">("pod");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [notes, setNotes] = useState("");
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    if (items.length === 0) router.replace("/(buyer)/cart" as any);
  }, [items.length]);

  useEffect(() => {
    if (!placed) return;
    const t = setTimeout(() => {
      clearCart();
      router.replace("/(buyer)/orders" as any);
    }, 1900);
    return () => clearTimeout(t);
  }, [placed]);

  const place = async () => {
    if (address.trim().length < 10) {
      setAddressError("Add a full address — street, hostel, landmark (10+ characters)");
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
      setPlaced(true);
    } catch (e: any) {
      toast.error(e.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  const subtotal = getTotal();
  const freeDelivery = subtotal >= 10000;
  const total = subtotal + (freeDelivery ? 0 : 1500);

  const methods = [
    { id: "pod", label: "Pay on delivery", hint: "Cash or transfer at the door", icon: BanknoteIcon },
    { id: "paystack", label: "Pay now with Paystack", hint: "Card, bank or USSD", icon: CreditCardIcon },
  ] as const;

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center pt-1 mb-6">
          <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 items-center justify-center">
            <Icon icon={ArrowLeft01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
          </TouchableOpacity>
          <Text className={`text-[20px] font-inter-bold tracking-tight ml-3 ${dark ? "text-white" : "text-ink"}`}>Checkout</Text>
        </View>

        <Eyebrow>Dropoff</Eyebrow>
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
          <Eyebrow>Payment</Eyebrow>
        </View>
        {methods.map((m) => (
          <TouchableOpacity
            key={m.id}
            onPress={() => {
              setPay(m.id);
              if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
            }}
            activeOpacity={0.9}
            className={`flex-row items-center px-5 py-4 rounded-[20px] mb-2 border ${
              pay === m.id
                ? dark
                  ? "bg-white border-white"
                  : "bg-ink border-ink"
                : dark
                  ? "bg-white/[0.06] border-white/10"
                  : "bg-white border-border"
            }`}
          >
            <View className={`w-11 h-11 rounded-2xl items-center justify-center mr-3.5 ${pay === m.id ? (dark ? "bg-ink" : "bg-white") : dark ? "bg-white/10" : "bg-ink/[0.05]"}`}>
              <Icon icon={m.icon} size={20} color={pay === m.id ? (dark ? "#fff" : "#0A0A0E") : dark ? "rgba(255,255,255,0.7)" : "rgba(10,10,14,0.6)"} />
            </View>
            <View className="flex-1">
              <Text className={`text-[15px] font-inter-bold ${pay === m.id ? (dark ? "text-ink" : "text-white") : dark ? "text-white" : "text-ink"}`}>{m.label}</Text>
              <Text className={`text-[12px] font-inter mt-0.5 ${pay === m.id ? (dark ? "text-ink/55" : "text-white/55") : dark ? "text-white/45" : "text-ink/50"}`}>{m.hint}</Text>
            </View>
            <View className={`w-5 h-5 rounded-full items-center justify-center ${pay === m.id ? (dark ? "bg-ink" : "bg-white") : dark ? "border-2 border-white/25" : "border-2 border-ink/20"}`}>
              {pay === m.id && <Text className={`text-[10px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}

        <View className="mt-7 mb-2.5">
          <Eyebrow>Summary</Eyebrow>
        </View>
        <View className="gap-2">
          {items.map((i) => (
            <View key={i.id} className="flex-row justify-between">
              <Text className={`text-[14px] font-inter ${dark ? "text-white/60" : "text-ink/60"}`}>{i.name} × {i.quantity}</Text>
              <Text className={`text-[14px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>₦{(i.price * i.quantity).toLocaleString()}</Text>
            </View>
          ))}
          <View className="flex-row justify-between mt-1">
            <Text className={`text-[14px] font-inter ${dark ? "text-white/60" : "text-ink/60"}`}>Delivery</Text>
            <Text className={`text-[14px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>{freeDelivery ? "Free" : "₦1,500"}</Text>
          </View>
          <View className={`flex-row justify-between mt-2 pt-3 border-t ${dark ? "border-white/10" : "border-ink/10"}`}>
            <Text className={`text-[17px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Total</Text>
            <Text className={`text-[17px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>₦{total.toLocaleString()}</Text>
          </View>
        </View>

        <View className="mt-6">
          <AppButton title={pay === "paystack" ? `Pay ₦${total.toLocaleString()} now` : `Place order · ₦${total.toLocaleString()}`} variant={dark ? "white" : "ink"} loading={loading} onPress={place} />
        </View>
      </ScrollView>

      {placed && (
        <Animated.View entering={FadeIn.duration(250)} className={`absolute inset-0 items-center justify-center ${dark ? "bg-ink" : "bg-cream"}`}>
          <Animated.View entering={ZoomIn.springify().damping(15).stiffness(180)}>
            <View className={`w-24 h-24 rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}>
              <Icon icon={CheckmarkCircle01Icon} size={44} color={dark ? "#0A0A0E" : "#fff"} />
            </View>
          </Animated.View>
          <Animated.View entering={FadeIn.delay(150).duration(350)} className="items-center px-8">
            <Text className={`text-[28px] font-display-bold tracking-tight mt-6 text-center ${dark ? "text-white" : "text-ink"}`}>
              Order received!
            </Text>
            <Text className={`text-[14px] font-inter mt-2 text-center ${dark ? "text-white/55" : "text-ink/55"}`}>
              Demo checkout · live ordering wires next — the kitchen confirms within 5 min. Total ₦{total.toLocaleString()}.
            </Text>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
