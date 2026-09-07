import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  Truck,
  Check,
  X,
} from "lucide-react-native";
import { AppButton } from "../../src/components/ui/AppButton";

const mockStats = {
  totalUsers: 156,
  totalSellers: 24,
  pendingSellers: 3,
  totalOrders: 892,
};

const mockPendingSellers = [
  {
    id: "seller-pending-001",
    store_name: "Mama Nkechi's Spot",
    verification_status: "documents_submitted",
    description: "Traditional Nigerian home cooking",
    profiles: { name: "Nkechi Okoro", phone: "+2348012345681" },
  },
  {
    id: "seller-pending-002",
    store_name: "Smoothie King",
    verification_status: "pending",
    description: "Fresh fruit smoothies and juices",
    profiles: { name: "Tunde Bakare", phone: "+2348012345682" },
  },
];

const mockActivities = [
  {
    id: "act-001",
    action_type: "seller_approved",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    profiles: { name: "Admin User" },
  },
  {
    id: "act-002",
    action_type: "document_approved",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    profiles: { name: "Admin User" },
  },
];

const activityLabels: Record<string, string> = {
  seller_approved: "Seller Approved",
  seller_rejected: "Seller Rejected",
  document_approved: "Document Approved",
  document_rejected: "Document Rejected",
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(mockStats);
  const [pendingSellers, setPendingSellers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setPendingSellers(mockPendingSellers);
      setActivities(mockActivities);
      setLoading(false);
    }, 800);
  }, []);

  const handleApproval = (sellerId: string, approve: boolean) => {
    setPendingSellers((prev) => prev.filter((s) => s.id !== sellerId));
    Alert.alert(
      approve ? "Seller approved" : "Seller rejected",
      `The seller has been ${approve ? "approved" : "rejected"} successfully.`
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FAF5EA]">
        <ActivityIndicator size="large" color="#1B1B8F" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#FAF5EA] px-5 pt-14" contentContainerStyle={{ paddingBottom: 120, gap: 16 }}>
      <View>
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">
          Platform
        </Text>
        <Text className="text-[28px] font-bold text-ink mt-1">Admin</Text>
        <Text className="text-sm text-ink/55">Manage your Vento platform</Text>
      </View>

      {/* Summary hero — white */}
      <View className="bg-white rounded-[28px] p-6 border border-[#E7E0D2]">
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">Platform at a glance</Text>
        <Text className="text-2xl font-bold text-ink mt-2">
          {stats.totalOrders} orders • {stats.totalUsers} users
        </Text>
        <View className="flex-row gap-2 mt-4">
          <View className="px-3 py-1.5 rounded-full bg-[#FFF3D6]">
            <Text className="text-xs font-bold text-[#8A5A00]">{stats.pendingSellers} pending</Text>
          </View>
          <View className="px-3 py-1.5 rounded-full bg-[#EDEDF7]">
            <Text className="text-xs font-bold text-[#1B1B8F]">{stats.totalSellers} sellers</Text>
          </View>
        </View>
      </View>

      {/* Stats Grid white cards */}
      <View className="flex-row flex-wrap gap-3">
        <View className="bg-white rounded-[26px] p-5 border border-[#E7E0D2] flex-1 min-w-[45%]">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-2">
            <Users color="#1B1B8F" size={20} />
          </View>
          <Text className="text-xs text-ink/55">Total Users</Text>
          <Text className="text-xl font-bold text-ink mt-0.5">
            {stats.totalUsers}
          </Text>
        </View>

        <View className="bg-white rounded-[26px] p-5 border border-[#E7E0D2] flex-1 min-w-[45%]">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-2">
            <Store color="#12805C" size={20} />
          </View>
          <Text className="text-xs text-ink/55">Total Sellers</Text>
          <Text className="text-xl font-bold text-ink mt-0.5">
            {stats.totalSellers}
          </Text>
        </View>

        <View className="bg-white rounded-[26px] p-5 border border-[#E7E0D2] flex-1 min-w-[45%]">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-2">
            <DollarSign color="#1B1B8F" size={20} />
          </View>
          <Text className="text-xs text-ink/55">Pending</Text>
          <Text className="text-xl font-bold text-ink mt-0.5">
            {stats.pendingSellers}
          </Text>
        </View>

        <View className="bg-white rounded-[26px] p-5 border border-[#E7E0D2] flex-1 min-w-[45%]">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-2">
            <ShoppingBag color="#1B1B8F" size={20} />
          </View>
          <Text className="text-xs text-ink/55">Total Orders</Text>
          <Text className="text-xl font-bold text-ink mt-0.5">
            {stats.totalOrders}
          </Text>
        </View>
      </View>

      {/* Quick Actions pill */}
      <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-6">
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-4">Quick Actions</Text>
        <AppButton title="Manage Delivery Agents" variant="ink" onPress={() => router.push("/(admin)/users" as any)} />
      </View>

      {/* Pending Sellers */}
      {pendingSellers.length > 0 && (
        <View>
          <Text className="text-lg font-bold text-ink mb-3">
            Pending Seller Approvals
          </Text>
          <View className="gap-4">
            {pendingSellers.map((seller) => (
              <View
                key={seller.id}
                className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]"
              >
                <View className="flex-row items-start justify-between mb-4 gap-2">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1 flex-wrap">
                      <Text className="font-bold text-ink">
                        {seller.store_name}
                      </Text>
                      <View className="bg-[#FFF3D6] px-2.5 py-1 rounded-full">
                        <Text className="text-[11px] font-bold text-[#8A5A00] capitalize">
                          {seller.verification_status || "pending"}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-ink/55">
                      {seller.profiles?.name}{" "}
                      {seller.profiles?.phone &&
                        `• ${seller.profiles.phone}`}
                    </Text>
                    {seller.description && (
                      <Text className="text-sm text-ink/55 mt-1">
                        {seller.description}
                      </Text>
                    )}
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => router.push("/(admin)/users" as any)}
                    className="flex-1 border border-[#E7E0D2] h-14 rounded-full items-center justify-center bg-white"
                  >
                    <Text className="text-ink font-bold text-sm">
                      View
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleApproval(seller.id, true)}
                    className="flex-1 bg-ink h-14 rounded-full items-center justify-center flex-row gap-1"
                  >
                    <Check color="#FFFFFF" size={14} />
                    <Text className="text-white font-bold text-sm">
                      Approve
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleApproval(seller.id, false)}
                    className="flex-1 bg-white border border-[#E7E0D2] h-14 rounded-full items-center justify-center flex-row gap-1"
                  >
                    <X color="#C0361F" size={14} />
                    <Text className="text-ink font-bold text-sm">
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Activity Log */}
      <View>
        <Text className="text-lg font-bold text-ink mb-3">
          Recent Activity
        </Text>
        {activities.length === 0 ? (
          <View className="bg-white rounded-[26px] p-8 items-center border border-[#E7E0D2]">
            <Text className="text-ink/55">No recent activity</Text>
          </View>
        ) : (
          <View className="gap-3">
            {activities.map((activity) => (
              <View
                key={activity.id}
                className="bg-white rounded-[26px] p-5 border border-[#E7E0D2]"
              >
                <View className="flex-row items-center gap-2 mb-1 flex-wrap">
                  <Text className="text-sm font-bold text-ink">
                    {activityLabels[activity.action_type] || activity.action_type}
                  </Text>
                  <View className="bg-[#FAF5EA] border border-[#E7E0D2] px-2.5 py-1 rounded-full">
                    <Text className="text-[11px] font-bold text-ink">
                      {activity.profiles?.name || "Admin"}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-ink/55">
                  {new Date(activity.created_at).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}
        <View className="mt-3 flex-row items-center gap-2 opacity-60">
          <Truck size={14} color="#6E6A75" />
          <Text className="text-xs text-ink/55">Ops monitored in real-time</Text>
        </View>
      </View>
    </ScrollView>
  );
}
