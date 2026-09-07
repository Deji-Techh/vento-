import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  DollarSign,
  ShoppingBag,
  Plus,
  TrendingUp,
  Star,
  Check,
  QrCode,
  MoreHorizontal,
  ChevronDown,
  UtensilsCrossed,
} from "lucide-react-native";

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

export default function SellerDashboard() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [stats, setStats] = useState(mockStats);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-[#E3F2E8]";
      case "preparing":
        return "bg-[#FFF3D6]";
      case "accepted":
        return "bg-[#E8EDFF]";
      default:
        return "bg-[#EDEDF7]";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#12805C";
      case "preparing":
        return "#8A5A00";
      case "accepted":
        return "#1B1B8F";
      default:
        return "#1B1B8F";
    }
  };

  const getTimeAgo = (date: string) => {
    const minutes = Math.floor(
      (Date.now() - new Date(date).getTime()) / 60000
    );
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (authLoading || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FAF5EA]">
        <ActivityIndicator size="large" color="#1B1B8F" />
      </View>
    );
  }

  const quickActions = [
    { icon: Plus, label: "Add Item", onPress: () => router.push("/(seller)/menu" as any) },
    { icon: TrendingUp, label: "Promote", onPress: () => {} },
    { icon: QrCode, label: "Scan QR", onPress: () => {} },
    { icon: MoreHorizontal, label: "More", onPress: () => {} },
  ];

  return (
    <ScrollView className="flex-1 bg-[#FAF5EA]" contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Greeting — white card */}
      <View className="px-5 pt-14 pb-2">
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-3">
          Seller Overview
        </Text>
        <View className="bg-white rounded-[28px] p-5 border border-[#E7E0D2]">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View>
                <View className="w-14 h-14 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
                  <Text className="text-[#1B1B8F] font-bold text-xl">
                    {sellerInfo?.store_name?.charAt(0) || "S"}
                  </Text>
                </View>
                <View
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                    isOnline ? "bg-[#12805C]" : "bg-[#B9B4C0]"
                  }`}
                />
              </View>
              <View>
                <Text className="text-sm text-ink/55">Good Morning,</Text>
                <Text className="text-xl font-bold text-ink">
                  Chef {profile?.name?.split(" ")[0] || "Alex"}!
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setIsOnline(!isOnline)}
              activeOpacity={0.85}
              className="flex-row items-center gap-2 pl-3 pr-2 py-2 rounded-full bg-white border border-[#E7E0D2]"
            >
              <View
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-[#12805C]" : "bg-[#B9B4C0]"
                }`}
              />
              <Text className="text-[11px] font-bold tracking-[1px] text-ink">
                {isOnline ? "ONLINE" : "OFFLINE"}
              </Text>
              <ChevronDown size={14} color="#6E6A75" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Earnings ink hero with single white trend pill */}
      <View className="px-5 mt-3">
        <View className="bg-ink rounded-[28px] p-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-white/60">
                Total Earnings
              </Text>
              <Text className="text-[32px] font-bold text-white mt-2">
                ₦{stats.totalEarnings.toFixed(2)}
              </Text>
              <View className="flex-row items-center mt-4">
                <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-white">
                  <TrendingUp color="#0A0A0E" size={14} />
                  <Text className="text-xs font-bold text-ink">+12.5% today</Text>
                </View>
              </View>
            </View>
            <View className="w-16 h-16 rounded-full bg-white/10 items-center justify-center border border-white/10">
              <DollarSign color="#FFFFFF" size={28} />
            </View>
          </View>
        </View>
      </View>

      {/* Stats 2-col white cards */}
      <View className="px-5 mt-4 flex-row gap-3">
        <View className="flex-1 bg-white rounded-[26px] p-5 border border-[#E7E0D2]">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-3">
            <ShoppingBag color="#1B1B8F" size={20} />
          </View>
          <Text className="text-2xl font-bold text-ink">{stats.pendingOrders}</Text>
          <Text className="text-sm text-ink/55 mt-0.5">Pending Orders</Text>
        </View>
        <View className="flex-1 bg-white rounded-[26px] p-5 border border-[#E7E0D2]">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-3">
            <ShoppingBag color="#0A0A0E" size={20} />
          </View>
          <Text className="text-2xl font-bold text-ink">{stats.totalOrders}</Text>
          <Text className="text-sm text-ink/55 mt-0.5">Total Orders</Text>
        </View>
      </View>

      <View className="px-5 mt-3 flex-row gap-3">
        <View className="flex-1 bg-white rounded-[26px] p-5 border border-[#E7E0D2] flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
            <Star color="#1B1B8F" size={20} />
          </View>
          <View>
            <Text className="text-xl font-bold text-ink">
              4.8<Text className="text-sm text-ink/55 font-normal"> / 5.0</Text>
            </Text>
            <Text className="text-sm text-ink/55">Store Rating</Text>
          </View>
        </View>
        <View className="flex-1 bg-white rounded-[26px] p-5 border border-[#E7E0D2] flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
            <Check color="#12805C" size={20} />
          </View>
          <View>
            <Text className="text-xl font-bold text-ink">{stats.completedOrders}</Text>
            <Text className="text-sm text-ink/55">Completed</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions circular white buttons */}
      <View className="px-5 mt-8">
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-4">
          Quick Actions
        </Text>
        <View className="flex-row gap-4">
          {quickActions.map((a) => (
            <TouchableOpacity
              key={a.label}
              onPress={a.onPress}
              activeOpacity={0.85}
              className="items-center gap-2"
            >
              <View className="w-16 h-16 rounded-full bg-white items-center justify-center border border-[#E7E0D2]">
                <a.icon color="#0A0A0E" size={22} />
              </View>
              <Text className="text-xs font-semibold text-ink">{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Live Orders white cards */}
      <View className="px-5 mt-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-ink">Live Orders</Text>
          <TouchableOpacity onPress={() => router.push("/(seller)/orders" as any)}>
            <Text className="text-sm font-bold text-[#1B1B8F]">View All</Text>
          </TouchableOpacity>
        </View>

        {recentOrders.length === 0 ? (
          <View className="bg-white rounded-[26px] p-8 items-center border border-[#E7E0D2]">
            <Text className="text-ink/55">No orders yet</Text>
          </View>
        ) : (
          <View className="gap-3">
            {recentOrders.map((order) => (
              <View
                key={order.id}
                className="bg-white rounded-[26px] p-4 border border-[#E7E0D2]"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-14 h-14 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
                    <UtensilsCrossed color="#1B1B8F" size={22} />
                  </View>
                  <View className="flex-1 min-w-0">
                    <View className="flex-row items-start justify-between gap-2">
                      <Text className="font-bold text-ink flex-1" numberOfLines={1}>
                        {order.items?.[0]?.name || "Order"}
                      </Text>
                      <Text className="text-xs text-ink/55">
                        #{order.id.slice(0, 4)}
                      </Text>
                    </View>
                    <Text className="text-xs text-ink/55 mt-0.5" numberOfLines={1}>
                      {order.notes || "No special instructions"}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-2">
                      <View className={`px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        <Text
                          className="text-[11px] font-bold uppercase"
                          style={{ color: getStatusTextColor(order.status) }}
                        >
                          {order.status}
                        </Text>
                      </View>
                      <Text className="text-xs text-ink/55">
                        • {getTimeAgo(order.created_at)}
                      </Text>
                    </View>
                  </View>
                  {order.status === "preparing" && (
                    <TouchableOpacity className="w-12 h-12 rounded-full bg-ink items-center justify-center">
                      <Check color="#FFFFFF" size={22} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
