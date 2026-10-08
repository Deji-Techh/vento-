import { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { pushToUser } from "../../src/lib/push";
import { buzz } from "../../src/lib/haptics";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { EmptyState } from "../../src/components/ui/Cards";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import {
  PlusSignIcon,
  ChartLineIcon,
  ReceiptIcon,
  ListViewIcon,
  Package01Icon,
  StarIcon,
  CheckmarkCircle01Icon,
  Wallet01Icon,
} from "../../src/components/icons";

const mockSellerInfo = {
  id: "seller-001",
  store_name: "Ada's Kitchen",
  total_earnings: 125000,
  approved: true,
  verification_status: "verified",
};

const mockStats = {
  totalEarnings: 125000,
  totalOrders: 47,
  completedOrders: 42,
  pendingOrders: 3,
  activeItems: 8,
};

const mockRecentOrders = [
  {
    id: "order-001",
    status: "pending",
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    items: [{ name: "Jollof Rice Special", image_url: null }],
    notes: "Extra spicy please",
    profiles: { name: "Chidi", phone: "+2348012345678" },
  },
  {
    id: "order-002",
    status: "preparing",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    items: [{ name: "Fried Rice & Chicken", image_url: null }],
    notes: null,
    profiles: { name: "Amara", phone: "+2348012345679" },
  },
  {
    id: "order-003",
    status: "completed",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    items: [{ name: "Eba with Egusi", image_url: null }],
    notes: null,
    profiles: { name: "Chidera", phone: "+2348012345680" },
  },
];

function toneFor(status: string): "success" | "warning" | "info" | "neutral" {
  switch (status) {
    case "delivered":
      return "success";
    case "preparing":
      return "warning";
    case "accepted":
      return "info";
    default:
      return "neutral";
  }
}

export default function SellerDashboard() {
  const router = useRouter();
  const { profile, loading: authLoading, user } = useAuth();
  const { dark } = useTheme();
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [stats, setStats] = useState({ totalEarnings: 0, totalOrders: 0, completedOrders: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); setRefreshing(false); return; }
    try {
      const { data: stores } = await supabase.from("sellers").select("id, store_name, approved, total_earnings").eq("owner_id", user.id).limit(5);
      const store = (stores || [])[0] || null;
      setSellerInfo(store);
      if (store) {
        const { data: orders } = await supabase.from("orders").select("id, buyer_id, status, created_at, notes, total, order_items(name, image_url)").eq("seller_id", store.id).order("created_at", { ascending: false }).limit(10);
        const list = orders || [];
        setRecentOrders(list);
        setStats({
          totalEarnings: store.total_earnings || 0,
          totalOrders: list.length,
          completedOrders: list.filter((o: any) => o.status === "delivered").length,
          pendingOrders: list.filter((o: any) => o.status === "pending").length,
        });
      } else {
        setRecentOrders([]);
        setStats({ totalEarnings: 0, totalOrders: 0, completedOrders: 0, pendingOrders: 0 });
      }
    } catch {
      // keep honest empty states; errors surface inline
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load, profile, authLoading]);

  const getTimeAgo = (date: string) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const toggleOnline = () => {
    setIsOnline((v) => {
      buzz();
      toast.success(!v ? "You are online" : "You are offline");
      return !v;
    });
  };

  const advanceOrder = async (id: string, status: string) => {
    try {
      const target = recentOrders.find((o) => o.id === id);
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
      setRecentOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      buzz("success");
      toast.success(`Order ${status.replaceAll("_", " ")}`);
      if (target?.buyer_id) {
        await supabase.from("notifications").insert({ user_id: target.buyer_id, kind: "order", title: `Order ${status.replaceAll("_", " ")}`, body: `${sellerInfo?.store_name || "Kitchen"} updated your order`, href: "/(buyer)/orders" });
        pushToUser(target.buyer_id, `Order ${status.replaceAll("_", " ")}`, `${sellerInfo?.store_name || "Kitchen"} updated your order`);
      }
      load();
    } catch (e: any) {
      buzz("error");
      toast.error(e.message || "Couldn't update order");
    }
  };

  if (authLoading || loading) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
      </SafeAreaView>
    );
  }

  const quickActions = [
    { icon: PlusSignIcon, label: "Menu", onPress: () => router.push("/(seller)/menu" as any) },
    { icon: ChartLineIcon, label: "Verify", onPress: () => router.push("/(seller)/verification" as any) },
    { icon: ReceiptIcon, label: "Orders", onPress: () => router.push("/(seller)/orders" as any) },
    { icon: ListViewIcon, label: "More", onPress: () => router.push("/(seller)/settings" as any) },
  ];

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); buzz(); load(); }} tintColor={dark ? "#fff" : "#0A0A0E"} />}>
        <View className="px-5 pt-4 pb-2">
          <Eyebrow>Seller overview</Eyebrow>
          <View className={`rounded-[28px] p-5 border mt-3 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View>
                  <View className={`w-14 h-14 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                    <Text className={`font-inter-bold text-xl ${dark ? "text-white" : "text-ink"}`}>
                      {sellerInfo?.store_name?.charAt(0) || "S"}
                    </Text>
                  </View>
                  <View className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${isOnline ? "bg-success" : dark ? "bg-white/20" : "bg-ink/20"}`} />
                </View>
                <View>
                  <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Good morning,</Text>
                  <Text className={`text-xl font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
                    Chef {profile?.name?.split(" ")[0] || "Alex"}!
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={toggleOnline}
                activeOpacity={0.85}
                className={`flex-row items-center gap-2 pl-3 pr-3 py-2 rounded-full border ${dark ? "bg-white/10 border-white/10" : "bg-white border-border"}`}
              >
                <View className={`w-2 h-2 rounded-full ${isOnline ? "bg-success" : dark ? "bg-white/20" : "bg-ink/20"}`} />
                <Text className={`text-[11px] font-inter-bold tracking-[1px] ${dark ? "text-white" : "text-ink"}`}>
                  {isOnline ? "ONLINE" : "OFFLINE"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-5 mt-3">
          <View className={`bg-ink rounded-[28px] p-6 ${dark ? "border border-white/10" : ""}`}>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-[11px] font-inter-bold uppercase tracking-[2px] text-white/60">
                  Total earnings
                </Text>
                <Text className="text-[32px] font-inter-bold text-white mt-2 tracking-tight">
                  ₦{stats.totalEarnings.toLocaleString()}
                </Text>
                <View className="flex-row items-center mt-4">
                  <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-white">
                    <Icon icon={ChartLineIcon} size={14} color="#0A0A0E" />
                    <Text className="text-xs font-inter-bold text-ink">{stats.totalOrders} orders all time</Text>
                  </View>
                </View>
              </View>
              <View className="w-16 h-16 rounded-full bg-white/10 items-center justify-center border border-white/10">
                <Icon icon={Wallet01Icon} size={28} color="#fff" />
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 mt-4 flex-row gap-3">
          <View className={`flex-1 rounded-[24px] p-5 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className={`w-11 h-11 rounded-full border items-center justify-center mb-3 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
              <Icon icon={ReceiptIcon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
            </View>
            <Text className={`text-2xl font-inter-bold ${dark ? "text-white" : "text-ink"}`}>{stats.pendingOrders}</Text>
            <Text className={`text-[13px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`}>Pending orders</Text>
          </View>
          <View className={`flex-1 rounded-[24px] p-5 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className={`w-11 h-11 rounded-full border items-center justify-center mb-3 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
              <Icon icon={Package01Icon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
            </View>
            <Text className={`text-2xl font-inter-bold ${dark ? "text-white" : "text-ink"}`}>{stats.totalOrders}</Text>
            <Text className={`text-[13px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`}>Total orders</Text>
          </View>
        </View>

        <View className="px-5 mt-3 flex-row gap-3">
          <View className={`flex-1 rounded-[24px] p-5 border flex-row items-center gap-3 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className={`w-11 h-11 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
              <Icon icon={StarIcon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
            </View>
            <View>
              <Text className={`text-xl font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
                {stats.totalOrders}<Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}> orders</Text>
              </Text>
              <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Total volume</Text>
            </View>
          </View>
          <View className={`flex-1 rounded-[24px] p-5 border flex-row items-center gap-3 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className={`w-11 h-11 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
              <Icon icon={CheckmarkCircle01Icon} size={20} color="#12805C" />
            </View>
            <View>
              <Text className={`text-xl font-inter-bold ${dark ? "text-white" : "text-ink"}`}>{stats.completedOrders}</Text>
              <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Completed</Text>
            </View>
          </View>
        </View>

        <View className="px-5 mt-8">
          <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-4 ${dark ? "text-white/55" : "text-ink/55"}`}>
            Quick actions
          </Text>
          <View className="flex-row gap-4">
            {quickActions.map((a) => (
              <TouchableOpacity key={a.label} onPress={a.onPress} activeOpacity={0.85} className="items-center gap-2">
                <View className={`w-16 h-16 rounded-full items-center justify-center border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                  <Icon icon={a.icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
                </View>
                <Text className={`text-xs font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-5 mt-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-lg font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Live orders</Text>
            <TouchableOpacity onPress={() => router.push("/(seller)/orders" as any)}>
              <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>View all</Text>
            </TouchableOpacity>
          </View>

          {sellerInfo ? (
            recentOrders.length === 0 ? (
            <View className={`rounded-[24px] p-8 items-center border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
              <Text className={`font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>No orders yet — new orders appear here live</Text>
            </View>
          ) : (
            <View className="gap-3">
              {recentOrders.map((order) => (
                <View key={order.id} className={`rounded-[24px] p-4 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                  <View className="flex-row items-center gap-3">
                    <View className={`w-14 h-14 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                      <Icon icon={Package01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
                    </View>
                    <View className="flex-1 min-w-0">
                      <View className="flex-row items-start justify-between gap-2">
                        <Text className={`font-inter-bold flex-1 ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>
                          {(order.order_items?.[0]?.name) || "Order"}
                        </Text>
                        <Text className={`text-xs font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>#{order.id.slice(0, 4)}</Text>
                      </View>
                      <Text className={`text-xs font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`} numberOfLines={1}>
                        {order.notes || "No special instructions"}
                      </Text>
                      <View className="flex-row items-center gap-2 mt-2">
                        <StatusChip label={order.status} tone={toneFor(order.status)} />
                        <Text className={`text-xs font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>• {getTimeAgo(order.created_at)}</Text>
                      </View>
                    </View>
                    {order.status === "pending" && (
                      <TouchableOpacity
                        onPress={() => advanceOrder(order.id, "accepted")}
                        accessibilityLabel="Accept order"
                        activeOpacity={0.85}
                        className={`px-4 h-[44px] rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}
                      >
                        <Text className={`text-[13px] font-inter-bold ${dark ? "text-ink" : "text-white"}`}>Accept</Text>
                      </TouchableOpacity>
                    )}
                    {order.status === "accepted" && (
                      <TouchableOpacity
                        onPress={() => advanceOrder(order.id, "preparing")}
                        accessibilityLabel="Start preparing"
                        activeOpacity={0.85}
                        className={`px-4 h-[44px] rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}
                      >
                        <Text className={`text-[13px] font-inter-bold ${dark ? "text-ink" : "text-white"}`}>Prepare</Text>
                      </TouchableOpacity>
                    )}
                    {order.status === "preparing" && (
                      <TouchableOpacity
                        onPress={() => advanceOrder(order.id, "delivered")}
                        accessibilityLabel="Mark delivered"
                        activeOpacity={0.85}
                        className={`w-12 h-12 rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}
                      >
                        <Icon icon={CheckmarkCircle01Icon} size={22} color={dark ? "#0A0A0E" : "#fff"} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )
          ) : (
            <EmptyState title="No store yet" subtitle="Admin creates your store after verification. Start in Verify." actionLabel="Verify account" onAction={() => router.push("/(seller)/verification" as any)} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
