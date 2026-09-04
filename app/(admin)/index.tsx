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
} from "lucide-react-native";

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
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-6 gap-6">
      <View>
        <Text className="text-2xl font-bold text-gray-900">Admin Dashboard</Text>
        <Text className="text-gray-500">Manage your Vento platform</Text>
      </View>

      {/* Stats Grid */}
      <View className="flex-row flex-wrap gap-3">
        <View className="bg-white rounded-xl p-4 border border-gray-200 flex-1 min-w-[45%]">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
              <Users color="#000080" size={20} />
            </View>
            <View>
              <Text className="text-xs text-gray-500">Total Users</Text>
              <Text className="text-lg font-bold text-gray-900">
                {stats.totalUsers}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 border border-gray-200 flex-1 min-w-[45%]">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center">
              <Store color="#16A34A" size={20} />
            </View>
            <View>
              <Text className="text-xs text-gray-500">Total Sellers</Text>
              <Text className="text-lg font-bold text-gray-900">
                {stats.totalSellers}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 border border-gray-200 flex-1 min-w-[45%]">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-amber-50 items-center justify-center">
              <DollarSign color="#EAB308" size={20} />
            </View>
            <View>
              <Text className="text-xs text-gray-500">Pending</Text>
              <Text className="text-lg font-bold text-gray-900">
                {stats.pendingSellers}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 border border-gray-200 flex-1 min-w-[45%]">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-purple-50 items-center justify-center">
              <ShoppingBag color="#7C3AED" size={20} />
            </View>
            <View>
              <Text className="text-xs text-gray-500">Total Orders</Text>
              <Text className="text-lg font-bold text-gray-900">
                {stats.totalOrders}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="gap-3">
        <Text className="text-lg font-semibold text-gray-900">Quick Actions</Text>
        <TouchableOpacity
          onPress={() => router.push("/(admin)/users")}
          className="bg-blue-900 h-14 rounded-xl items-center justify-center flex-row gap-2"
        >
          <Truck color="#FFFFFF" size={20} />
          <Text className="text-white font-semibold text-lg">
            Manage Delivery Agents
          </Text>
        </TouchableOpacity>
      </View>

      {/* Activity Log */}
      <View>
        <Text className="text-lg font-semibold text-gray-900 mb-3">
          Recent Activity
        </Text>
        {activities.length === 0 ? (
          <View className="bg-gray-50 rounded-xl p-8 items-center border border-gray-200">
            <Text className="text-gray-500">No recent activity</Text>
          </View>
        ) : (
          <View className="gap-3">
            {activities.map((activity) => (
              <View
                key={activity.id}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200"
              >
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-sm font-medium">
                    {activity.action_type === "seller_approved" &&
                      "✓ Seller Approved"}
                    {activity.action_type === "seller_rejected" &&
                      "✗ Seller Rejected"}
                    {activity.action_type === "document_approved" &&
                      "✓ Document Approved"}
                    {activity.action_type === "document_rejected" &&
                      "✗ Document Rejected"}
                  </Text>
                  <View className="bg-gray-200 px-2 py-0.5 rounded-full">
                    <Text className="text-xs text-gray-700">
                      {activity.profiles?.name || "Admin"}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-gray-500">
                  {new Date(activity.created_at).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Pending Sellers */}
      {pendingSellers.length > 0 && (
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Pending Seller Approvals
          </Text>
          <View className="gap-3">
            {pendingSellers.map((seller) => (
              <View
                key={seller.id}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="font-semibold text-gray-900">
                        {seller.store_name}
                      </Text>
                      <View className="bg-amber-100 px-2 py-0.5 rounded-full">
                        <Text className="text-xs font-semibold text-amber-700 capitalize">
                          {seller.verification_status || "pending"}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-gray-500">
                      {seller.profiles?.name}{" "}
                      {seller.profiles?.phone &&
                        `• ${seller.profiles.phone}`}
                    </Text>
                    {seller.description && (
                      <Text className="text-sm text-gray-500 mt-1">
                        {seller.description}
                      </Text>
                    )}
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => router.push("/(admin)/users")}
                    className="flex-1 border border-gray-300 h-10 rounded-xl items-center justify-center"
                  >
                    <Text className="text-gray-700 font-semibold text-sm">
                      View
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleApproval(seller.id, true)}
                    className="flex-1 bg-green-500 h-10 rounded-xl items-center justify-center"
                  >
                    <Text className="text-white font-semibold text-sm">
                      Approve
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleApproval(seller.id, false)}
                    className="flex-1 bg-red-500 h-10 rounded-xl items-center justify-center"
                  >
                    <Text className="text-white font-semibold text-sm">
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
