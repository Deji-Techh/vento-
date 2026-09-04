import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
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
        return "bg-green-100 text-green-700";
      case "preparing":
        return "bg-amber-100 text-amber-700";
      case "accepted":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
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
      <View className="flex-1 items-center justify-center bg-[#f8f6f5]">
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#f8f6f5] pb-4">
      {/* Header */}
      <View className="px-4 pt-6 pb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="relative">
              <View className="w-14 h-14 rounded-full bg-white overflow-hidden items-center justify-center">
                <Text className="text-primary font-bold text-xl">
                  {sellerInfo?.store_name?.charAt(0) || "S"}
                </Text>
              </View>
              <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-[#f8f6f5] rounded-full" />
            </View>
            <View>
              <Text className="text-sm text-gray-500">Good Morning,</Text>
              <Text className="text-xl font-bold text-gray-900">
                Chef {profile?.name?.split(" ")[0] || "Alex"}! 👨‍🍳
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setIsOnline(!isOnline)}
            className={`flex-row items-center gap-2 px-3 py-2 rounded-full border ${
              isOnline
                ? "border-green-500 text-green-600"
                : "border-gray-300 text-gray-500"
            }`}
          >
            <View
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <Text className="text-sm font-medium">
              {isOnline ? "ONLINE" : "OFFLINE"}
            </Text>
            <ChevronDown size={16} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View className="px-4 gap-4">
        {/* Earnings Card */}
        <View className="bg-white rounded-2xl p-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-gray-500">Total Earnings</Text>
              <Text className="text-3xl font-bold text-gray-900 mt-1">
                ₦{stats.totalEarnings.toFixed(2)}
              </Text>
              <View className="flex-row items-center gap-1 mt-1">
                <TrendingUp color="#16A34A" size={16} />
                <Text className="text-sm text-green-600">+12.5% today</Text>
              </View>
            </View>
            <View className="w-16 h-16 rounded-2xl bg-blue-50 items-center justify-center">
              <DollarSign color="#000080" size={32} />
            </View>
          </View>
        </View>

        {/* Orders Stats */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-white rounded-2xl p-4 border-l-4 border-blue-900">
            <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center mb-3">
              <ShoppingBag color="#000080" size={20} />
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              {stats.pendingOrders}
            </Text>
            <Text className="text-sm text-gray-500">Pending Orders</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4">
            <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center mb-3">
              <ShoppingBag color="#1C1B1B" size={20} />
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              {stats.totalOrders}
            </Text>
            <Text className="text-sm text-gray-500">Total Orders</Text>
          </View>
        </View>

        {/* Rating Card */}
        <View className="bg-white rounded-2xl p-4 self-start">
          <View className="w-10 h-10 rounded-xl bg-amber-100 items-center justify-center mb-3">
            <Star color="#F59E0B" size={20} />
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            4.8
            <Text className="text-lg text-gray-500 font-normal">/ 5.0</Text>
          </Text>
          <Text className="text-sm text-gray-500">Store Rating</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-4 mt-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">
          Quick Actions
        </Text>
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={() => router.push("/(seller)/menu")}
            className="items-center gap-2"
          >
            <View className="w-14 h-14 rounded-2xl bg-white items-center justify-center">
              <Plus color="#000080" size={24} />
            </View>
            <Text className="text-xs font-medium text-gray-900">Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center gap-2">
            <View className="w-14 h-14 rounded-2xl bg-white items-center justify-center">
              <TrendingUp color="#1C1B1B" size={24} />
            </View>
            <Text className="text-xs font-medium text-gray-900">Promote</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center gap-2">
            <View className="w-14 h-14 rounded-2xl bg-white items-center justify-center">
              <QrCode color="#1C1B1B" size={24} />
            </View>
            <Text className="text-xs font-medium text-gray-900">Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center gap-2">
            <View className="w-14 h-14 rounded-2xl bg-white items-center justify-center">
              <MoreHorizontal color="#1C1B1B" size={24} />
            </View>
            <Text className="text-xs font-medium text-gray-900">More</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Orders */}
      <View className="px-4 mt-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900">Live Orders</Text>
          <TouchableOpacity
            onPress={() => router.push("/(seller)/orders")}
          >
            <Text className="text-sm font-semibold text-blue-900">View All</Text>
          </TouchableOpacity>
        </View>

        {recentOrders.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center">
            <Text className="text-gray-500">No orders yet</Text>
          </View>
        ) : (
          <View className="gap-3">
            {recentOrders.map((order) => (
              <View key={order.id} className="bg-white rounded-2xl p-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden items-center justify-center">
                    <Text className="text-2xl">🍽️</Text>
                  </View>
                  <View className="flex-1 min-w-0">
                    <View className="flex-row items-start justify-between">
                      <View>
                        <Text className="font-semibold text-gray-900">
                          {order.items?.[0]?.name || "Order"}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-0.5">
                          {order.notes || "No special instructions"}
                        </Text>
                      </View>
                      <Text className="text-xs text-gray-500">
                        #{order.id.slice(0, 4)}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 mt-2">
                      <View className={`px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        <Text className="text-xs font-semibold uppercase">
                          {order.status}
                        </Text>
                      </View>
                      <Text className="text-xs text-gray-500">
                        • {getTimeAgo(order.created_at)}
                      </Text>
                    </View>
                  </View>
                  {order.status === "preparing" && (
                    <TouchableOpacity className="w-12 h-12 rounded-full bg-green-500 items-center justify-center">
                      <Check color="#FFFFFF" size={24} />
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
