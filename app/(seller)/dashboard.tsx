import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
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
    case "completed":
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
  const { profile, loading: authLoading } = useAuth();
  const { dark } = useTheme();
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [stats] = useState(mockStats);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSellerInfo(mockSellerInfo);
      setRecentOrders(mockRecentOrders);
      setLoading(false);
    }, 800);
  }, [profile, authLoading]);

  const getTimeAgo = (date: string) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const toggleOnline = () => {
    setIsOnline((v) => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      toast.success(!v ? "You are online" : "You are offline");
      return !v;
    });
  };

  const completeOrder = (id: string) => {
    setRecentOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "completed" } : o)));
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    toast.success("Order completed");
  };

  if (authLoading || loading) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
      </SafeAreaView>
    );
  }

  const quickActions = [
    { icon: PlusSignIcon, label: "Add Item", onPress: () => router.push("/(seller)/menu" as any) },
    { icon: ChartLineIcon, label: "Promote", onPress: () => toast.success("Promotions coming soon") },
    { icon: ReceiptIcon, label: "Orders", onPress: () => router.push("/(seller)/orders" as any) },
    { icon: ListViewIcon, label: "More", onPress: () => router.push("/(seller)/settings" as any) },
  ];

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
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
                  ₦{stats.totalEarnings.toFixed(2)}
                </Text>
                <View className="flex-row items-center mt-4">
                  <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-white">
                    <Icon icon={ChartLineIcon} size={14} color="#0A0A0E" />
                    <Text className="text-xs font-inter-bold text-ink">+12.5% today</Text>
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
                4.8<Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}> / 5.0</Text>
              </Text>
              <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Store rating</Text>
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

          {recentOrders.length === 0 ? (
            <View className={`rounded-[24px] p-8 items-center border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
              <Text className={`font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>No orders yet</Text>
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
                          {order.items?.[0]?.name || "Order"}
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
                    {order.status === "preparing" && (
                      <TouchableOpacity
                        onPress={() => completeOrder(order.id)}
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
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
