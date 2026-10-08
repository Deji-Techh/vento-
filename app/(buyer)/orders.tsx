import { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, RefreshControl, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { buzz } from "../../src/lib/haptics";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { EmptyState } from "../../src/components/ui/Cards";
import { Skeleton } from "../../src/components/ui/Skeleton";
import { StatusChip } from "../../src/components/ui/SectionHeader";
import { Enter } from "../../src/components/motion";
import { Icon } from "../../src/components/ui/Icon";
import { Wallet01Icon } from "../../src/components/icons";

type Order = { id: string; status: string; total: number; created_at: string; seller_id: string; seller_name: string; item_name: string; image_url: string | null };
const ONGOING = ["pending", "accepted", "preparing", "picked_up", "on_the_way"];

function toneFor(status: string): "success" | "warning" | "info" | "neutral" {
  if (status === "delivered") return "success";
  if (status === "cancelled") return "neutral";
  if (status === "pending") return "warning";
  return "info";
}

export default function Orders() {
  const router = useRouter();
  const { user } = useAuth();
  const { dark } = useTheme();
  const [tab, setTab] = useState<"Ongoing" | "History">("Ongoing");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    if (!user) { setOrders([]); setLoading(false); setRefreshing(false); return; }
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total, created_at, seller_id, sellers(store_name), order_items(name, image_url)")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      setOrders(
        (data || []).map((o: any) => ({
          id: o.id, status: o.status, total: o.total, created_at: o.created_at, seller_id: o.seller_id,
          seller_name: o.sellers?.store_name || "Kitchen",
          item_name: o.order_items?.[0]?.name || `${o.order_items?.length || 0} items`,
          image_url: o.order_items?.[0]?.image_url || null,
        }))
      );
    } catch (e: any) {
      setError(e.message || "Couldn't load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const ongoing = orders.filter((o) => ONGOING.includes(o.status));
  const history = orders.filter((o) => !ONGOING.includes(o.status));
  const list = tab === "Ongoing" ? ongoing : history;

  const timeAgo = (iso: string) => {
    const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (m < 1) return "now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <View className="px-6 pt-2 pb-2">
        <Text className={`text-[28px] font-display-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Orders</Text>
        <View className="flex-row mt-3">
          {(["Ongoing", "History"] as const).map((t) => {
            const active = tab === t;
            const count = t === "Ongoing" ? ongoing.length : history.length;
            return (
              <TouchableOpacity key={t} onPress={() => { setTab(t); buzz(); }} accessibilityRole="tab" accessibilityState={{ selected: active }} activeOpacity={0.85} className="mr-5 items-center">
                <Text className={`text-[15px] ${active ? "font-inter-bold" : "font-inter"} ${dark ? (active ? "text-white" : "text-white/45") : active ? "text-ink" : "text-ink/40"}`}>{t}{count > 0 ? ` (${count})` : ""}</Text>
                <View className={`h-[2px] rounded-full mt-1 self-stretch ${active ? (dark ? "bg-white" : "bg-ink") : "bg-transparent"}`} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 px-6 pt-4 gap-3"><Skeleton width="100%" height={96} radius={24} /><Skeleton width="100%" height={96} radius={24} /><Skeleton width="100%" height={96} radius={24} /></View>
      ) : error ? (
        <View className="flex-1 px-6 pt-4"><EmptyState title="Couldn't load orders" subtitle={error} actionLabel="Retry" onAction={load} /></View>
      ) : !user ? (
        <View className="flex-1 px-6 pt-4"><EmptyState title="Sign in to see orders" subtitle="Your live and past orders appear here." actionLabel="Log in" onAction={() => router.push("/auth/login" as any)} /></View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(o) => o.id}
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); buzz(); load(); }} tintColor={dark ? "#fff" : "#0A0A0E"} />}
          initialNumToRender={10}
          windowSize={5}
          removeClippedSubviews
          ListHeaderComponent={
            <TouchableOpacity onPress={() => router.push("/(buyer)/vento-pay" as any)} activeOpacity={0.9} className={`rounded-[24px] px-4 py-4 flex-row items-center gap-3 mb-2 mt-3 ${dark ? "bg-white/[0.06]" : "bg-ink/[0.05]"}`}>
              <View className={`w-11 h-11 rounded-2xl items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}>
                <Icon icon={Wallet01Icon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
              </View>
              <View className="flex-1">
                <Text className={`text-[15px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Vento Pay transactions</Text>
                <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`}>Receipts, refunds and wallet</Text>
              </View>
            </TouchableOpacity>
          }
          ListEmptyComponent={
            tab === "Ongoing" ? (
              <View className="mt-3"><EmptyState title="No live orders" subtitle="Active orders and rider tracking appear here." actionLabel="Browse kitchens" onAction={() => router.push("/(buyer)/browse" as any)} /></View>
            ) : (
              <View className="mt-3"><EmptyState title="No history yet" subtitle="Delivered and cancelled orders land here." actionLabel="Order something" onAction={() => router.push("/(buyer)/browse" as any)} /></View>
            )
          }
          renderItem={({ item: order, index }) => (
            <Enter key={order.id} delay={Math.min(index * 40, 160)}>
              <TouchableOpacity onPress={() => router.push("/(buyer)/track-delivery" as any)} activeOpacity={0.9} className="flex-row items-center py-3">
                {order.image_url ? (
                  <Image source={{ uri: order.image_url }} style={{ width: 64, height: 64, borderRadius: 18 }} contentFit="cover" transition={200} />
                ) : (
                  <View style={{ width: 64, height: 64, borderRadius: 18 }} className={dark ? "bg-white/10" : "bg-ink/10"} />
                )}
                <View className="flex-1 ml-3">
                  <Text className={`text-[15px] font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>{order.seller_name}</Text>
                  <Text className={`text-[13px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`} numberOfLines={1}>{order.item_name} · {timeAgo(order.created_at)}</Text>
                  <View className="mt-1.5 self-start"><StatusChip label={order.status.replaceAll("_", " ")} tone={toneFor(order.status)} /></View>
                </View>
                <View className="items-end ml-2">
                  <Text className={`text-[14px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>₦{order.total.toLocaleString()}</Text>
                  <Text className={`text-[13px] font-inter-bold mt-2 ${dark ? "text-white" : "text-ink"}`}>Track ›</Text>
                </View>
              </TouchableOpacity>
            </Enter>
          )}
        />
      )}
    </SafeAreaView>
  );
}
