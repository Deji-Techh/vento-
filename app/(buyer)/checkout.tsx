import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../src/stores/cartStore";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { buzz } from "../../src/lib/haptics";
import * as Haptics from "expo-haptics";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import { ArrowLeft01Icon, BanknoteIcon, CheckmarkCircle01Icon } from "../../src/components/icons";
import { toast } from "sonner-native";
import Animated, { ZoomIn, FadeIn } from "react-native-reanimated";

const FEE = 1500;
const FREE_AT = 10000;

export default function Checkout() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { dark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [notes, setNotes] = useState("");
  const [placed, setPlaced] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

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
    if (!user) {
      toast.error("Log in to place your order");
      router.push("/auth/login" as any);
      return;
    }
    setLoading(true);
    try {
      // One order per kitchen (single fee each).
      const groups = new Map<string, typeof items>();
      for (const i of items) {
        const g = groups.get(i.seller_id) || [];
        g.push(i);
        groups.set(i.seller_id, g);
      }
      let n = 0;
      for (const [sellerId, g] of groups) {
        const subtotal = g.reduce((s, i) => s + i.price * i.quantity, 0);
        const fee = subtotal >= FREE_AT ? 0 : FEE;
        const { data: order, error } = await supabase
          .from("orders")
          .insert({ buyer_id: user.id, seller_id: sellerId, subtotal, delivery_fee: fee, total: subtotal + fee, delivery_address: address.trim(), notes: notes.trim() || null, payment_method: "pod", status: "pending" })
          .select("id")
          .single();
        if (error) throw error;
        const { error: ie } = await supabase.from("order_items").insert(
          g.map((i) => ({ order_id: (order as any).id, menu_item_id: i.id, name: i.name, price: i.price, quantity: i.quantity, image_url: i.image_url || null }))
        );
        if (ie) throw ie;
        const pin = String(Math.floor(1000 + Math.random() * 9000));
        const { error: de } = await supabase.from("deliveries").insert({ order_id: (order as any).id, status: "assigned", delivery_fee: fee, pin });
        if (de) throw new Error("Order saved, but delivery setup needs migration_checkout.sql — run it, then re-checkout.");
        await supabase.from("notifications").insert({ user_id: user.id, kind: "order", title: "Order placed", body: `Kitchen confirmed within 5 min · PIN ${pin}`, href: "/(buyer)/orders" });
        n++;
      }
      setOrderCount(n);
      buzz("success");
      setPlaced(true);
    } catch (e: any) {
      buzz("error");
      toast.error(e.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  const subtotal = getTotal();
  const freeDelivery = subtotal >= FREE_AT;
  const total = subtotal + (freeDelivery ? 0 : FEE);
  const kitchens = new Set(items.map((i) => i.seller_id)).size;

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
        <View className={`flex-row items-center px-5 py-4 rounded-[20px] mb-2 border ${dark ? "bg-white border-white" : "bg-ink border-ink"}`}>
          <View className={`w-11 h-11 rounded-2xl items-center justify-center mr-3.5 ${dark ? "bg-ink" : "bg-white"}`}>
            <Icon icon={BanknoteIcon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
          </View>
          <View className="flex-1">
            <Text className={`text-[15px] font-inter-bold ${dark ? "text-ink" : "text-white"}`}>Pay on delivery</Text>
            <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-ink/55" : "text-white/55"}`}>Cash or transfer at the door · card payments ship next</Text>
          </View>
        </View>

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

        {kitchens > 1 ? (
          <Text className={`text-[13px] font-inter mt-2 ${dark ? "text-white/55" : "text-ink/55"}`}>Split into {kitchens} kitchen orders · one ₦1,500 fee each (free over ₦10,000).</Text>
        ) : null}
        <View className="mt-6">
          <AppButton title={`Place order · ₦${total.toLocaleString()}`} variant={dark ? "white" : "ink"} loading={loading} onPress={place} />
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
            <Text className={`text-[28px] font-serif-bold tracking-tight mt-6 text-center ${dark ? "text-white" : "text-ink"}`}>
              Order received!
            </Text>
            <Text className={`text-[14px] font-inter mt-2 text-center ${dark ? "text-white/55" : "text-ink/55"}`}>
              {orderCount > 1 ? `${orderCount} kitchen orders placed` : "Order placed"} · kitchen confirms within 5 min. Total ₦{total.toLocaleString()}.
            </Text>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
