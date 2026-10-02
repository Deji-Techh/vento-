import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
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
      <SafeAreaView className="flex-1 bg-cream items-center justify-center" edges={["top"]}>
        <ActivityIndicator size="large" color="#0A0A0E" />
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
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-2">
          <Eyebrow>Seller overview</Eyebrow>
          <View className="bg-white rounded-[28px] p-5 border border-border mt-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View>
                  <View className="w-14 h-14 rounded-full bg-cream border border-border items-center justify-center">
                    <Text className="text-primary font-inter-bold text-xl">
                      {sellerInfo?.store_name?.charAt(0) || "S"}
                    </Text>
                  </View>
                  <View className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${isOnline ? "bg-success" : "bg-ink/20"}`} />
                </View>
                <View>
                  <Text className="text-[13px] font-inter text-ink/55">Good morning,</Text>
                  <Text className="text-xl font-inter-bold text-ink tracking-tight">
                    Chef {profile?.name?.split(" ")[0] || "Alex"}!
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={toggleOnline}
                activeOpacity={0.85}
                className="flex-row items-center gap-2 pl-3 pr-3 py-2 rounded-full bg-white border border-border"
              >
                <View className={`w-2 h-2 rounded-full ${isOnline ? "bg-success" : "bg-ink/20"}`} />
                <Text className="text-[11px] font-inter-bold tracking-[1px] text-ink">
                  {isOnline ? "ONLINE" : "OFFLINE"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-5 mt-3">
          <View className="bg-ink rounded-[28px] p-6">
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
          <View className="flex-1 bg-white rounded-[24px] p-5 border border-border">
            <View className="w-11 h-11 rounded-full bg-cream border border-border items-center justify-center mb-3">
              <Icon icon={ReceiptIcon} size={20} color="#1B1B8F" />
            </View>
            <Text className="text-2xl font-inter-bold text-ink">{stats.pendingOrders}</Text>
            <Text className="text-[13px] font-inter text-ink/55 mt-0.5">Pending orders</Text>
          </View>
          <View className="flex-1 bg-white rounded-[24px] p-5 border border-border">
            <View className="w-11 h-11 rounded-full bg-cream border border-border items-center justify-center mb-3">
              <Icon icon={Package01Icon} size={20} color="#0A0A0E" />
            </View>
            <Text className="text-2xl font-inter-bold text-ink">{stats.totalOrders}</Text>
            <Text className="text-[13px] font-inter text-ink/55 mt-0.5">Total orders</Text>
          </View>
        </View>

        <View className="px-5 mt-3 flex-row gap-3">
          <View className="flex-1 bg-white rounded-[24px] p-5 border border-border flex-row items-center gap-3">
            <View className="w-11 h-11 rounded-full bg-cream border border-border items-center justify-center">
              <Icon icon={StarIcon} size={20} color="#1B1B8F" />
            </View>
            <View>
              <Text className="text-xl font-inter-bold text-ink">
                4.8<Text className="text-[13px] text-ink/55 font-inter"> / 5.0</Text>
              </Text>
              <Text className="text-[13px] font-inter text-ink/55">Store rating</Text>
            </View>
          </View>
          <View className="flex-1 bg-white rounded-[24px] p-5 border border-border flex-row items-center gap-3">
            <View className="w-11 h-11 rounded-full bg-cream border border-border items-center justify-center">
              <Icon icon={CheckmarkCircle01Icon} size={20} color="#12805C" />
            </View>
            <View>
              <Text className="text-xl font-inter-bold text-ink">{stats.completedOrders}</Text>
              <Text className="text-[13px] font-inter text-ink/55">Completed</Text>
            </View>
          </View>
        </View>

        <View className="px-5 mt-8">
          <Text className="text-[11px] font-inter-bold uppercase tracking-[2px] text-ink/55 mb-4">
            Quick actions
          </Text>
          <View className="flex-row gap-4">
            {quickActions.map((a) => (
              <TouchableOpacity key={a.label} onPress={a.onPress} activeOpacity={0.85} className="items-center gap-2">
                <View className="w-16 h-16 rounded-full bg-white items-center justify-center border border-border">
                  <Icon icon={a.icon} size={22} color="#0A0A0E" />
                </View>
                <Text className="text-xs font-inter-semibold text-ink">{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-5 mt-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-inter-bold text-ink tracking-tight">Live orders</Text>
            <TouchableOpacity onPress={() => router.push("/(seller)/orders" as any)}>
              <Text className="text-[13px] font-inter-bold text-primary">View all</Text>
            </TouchableOpacity>
          </View>

          {recentOrders.length === 0 ? (
            <View className="bg-white rounded-[24px] p-8 items-center border border-border">
              <Text className="text-ink/55 font-inter">No orders yet</Text>
            </View>
          ) : (
            <View className="gap-3">
              {recentOrders.map((order) => (
                <View key={order.id} className="bg-white rounded-[24px] p-4 border border-border">
                  <View className="flex-row items-center gap-3">
                    <View className="w-14 h-14 rounded-full bg-cream border border-border items-center justify-center">
                      <Icon icon={Package01Icon} size={22} color="#1B1B8F" />
                    </View>
                    <View className="flex-1 min-w-0">
                      <View className="flex-row items-start justify-between gap-2">
                        <Text className="font-inter-bold text-ink flex-1" numberOfLines={1}>
                          {order.items?.[0]?.name || "Order"}
                        </Text>
                        <Text className="text-xs font-inter text-ink/55">#{order.id.slice(0, 4)}</Text>
                      </View>
                      <Text className="text-xs font-inter text-ink/55 mt-0.5" numberOfLines={1}>
                        {order.notes || "No special instructions"}
                      </Text>
                      <View className="flex-row items-center gap-2 mt-2">
                        <StatusChip label={order.status} tone={toneFor(order.status)} />
                        <Text className="text-xs font-inter text-ink/55">• {getTimeAgo(order.created_at)}</Text>
                      </View>
                    </View>
                    {order.status === "preparing" && (
                      <TouchableOpacity
                        onPress={() => completeOrder(order.id)}
                        activeOpacity={0.85}
                        className="w-12 h-12 rounded-full bg-ink items-center justify-center"
                      >
                        <Icon icon={CheckmarkCircle01Icon} size={22} color="#fff" />
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
