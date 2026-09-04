import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  Package,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  Navigation,
} from "lucide-react-native";

const mockAgent = {
  id: "agent-001",
  is_online: true,
  is_active: true,
  total_earnings: 45000,
  completed_deliveries: 23,
};

const mockActiveDeliveries = [
  {
    id: "delivery-001",
    order_id: "order-001",
    status: "heading_to_seller",
    delivery_fee: 500,
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    orders: {
      id: "order-001",
      notes: "Extra spicy",
      delivery_address: "123 Campus Road",
      items: [{ name: "Jollof Rice" }, { name: "Fried Plantain" }],
    },
  },
];

const statusColors: Record<string, string> = {
  assigned: "bg-gray-100 text-gray-700",
  heading_to_seller: "bg-blue-100 text-blue-700",
  picked_up: "bg-amber-100 text-amber-700",
  on_the_way: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const getTimeAgo = (date: string) => {
  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<any>(null);
  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAgent(mockAgent);
      setIsOnline(mockAgent.is_online);
      setActiveDeliveries(mockActiveDeliveries);
      setLoading(false);
    }, 800);
  }, []);

  const toggleOnlineStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    if (agent) setAgent({ ...agent, is_online: newStatus });
    Alert.alert(
      newStatus ? "You are now online" : "You are now offline",
      newStatus
        ? "You can receive new delivery assignments"
        : "You won't receive new assignments"
    );
  };

  const updateDeliveryStatus = (deliveryId: string, newStatus: string) => {
    setActiveDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId ? { ...d, status: newStatus } : d
      )
    );
    Alert.alert("Status updated", `Delivery marked as ${newStatus.replace("_", " ")}`);
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
      {/* Header with Online Toggle */}
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Dashboard</Text>
          <Text className="text-gray-500">Manage your deliveries</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Text className="text-sm text-gray-500">
            {isOnline ? "Online" : "Offline"}
          </Text>
          <Switch
            value={isOnline}
            onValueChange={toggleOnlineStatus}
            trackColor={{ true: "#16A34A", false: "#D1D5DB" }}
          />
        </View>
      </View>

      {/* Stats Cards */}
      <View className="flex-row flex-wrap gap-3">
        <View className="bg-white rounded-xl p-4 border border-gray-200 flex-1 min-w-[45%]">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
              <Wallet color="#000080" size={20} />
            </View>
            <View>
              <Text className="text-xs text-gray-500">Total Earnings</Text>
              <Text className="text-lg font-bold text-gray-900">
                ₦{(agent?.total_earnings || 0).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 border border-gray-200 flex-1 min-w-[45%]">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center">
              <Package color="#16A34A" size={20} />
            </View>
            <View>
              <Text className="text-xs text-gray-500">Completed</Text>
              <Text className="text-lg font-bold text-gray-900">
                {agent?.completed_deliveries || 0}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 border border-gray-200 flex-1 min-w-[45%]">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-yellow-50 items-center justify-center">
              <Clock color="#EAB308" size={20} />
            </View>
            <View>
              <Text className="text-xs text-gray-500">Active</Text>
              <Text className="text-lg font-bold text-gray-900">
                {activeDeliveries.length}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 border border-gray-200 flex-1 min-w-[45%]">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
              <TrendingUp color="#3B82F6" size={20} />
            </View>
            <View>
              <Text className="text-xs text-gray-500">Status</Text>
              <View className={`px-2 py-0.5 rounded-full ${agent?.is_active ? "bg-green-100" : "bg-gray-100"}`}>
                <Text className={`text-xs font-semibold ${agent?.is_active ? "text-green-700" : "text-gray-700"}`}>
                  {agent?.is_active ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Active Deliveries */}
      <View>
        <Text className="text-lg font-semibold mb-4">Active Deliveries</Text>
        {activeDeliveries.length === 0 ? (
          <View className="bg-white rounded-xl p-8 items-center border border-gray-200">
            <Package color="#9CA3AF" size={48} />
            <Text className="text-gray-500 mt-3">No active deliveries</Text>
            <Text className="text-sm text-gray-500 mt-1">
              {isOnline
                ? "New deliveries will appear here when assigned"
                : "Go online to receive delivery assignments"}
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {activeDeliveries.map((delivery) => {
              const order = delivery.orders;
              const items = order?.items || [];
              const itemNames = Array.isArray(items)
                ? items.map((i: any) => i.name || "Item").slice(0, 3)
                : [];

              return (
                <View
                  key={delivery.id}
                  className="bg-white rounded-xl p-4 border border-gray-200"
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 mb-1">
                        <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                          <Text className="text-lg">📦</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="font-semibold text-gray-900">
                            #{delivery.order_id.slice(0, 8)}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            {itemNames.join(", ")}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      className={`px-2 py-1 rounded-full ${statusColors[delivery.status] || statusColors.assigned}`}
                    >
                      <Text className="text-xs font-semibold capitalize">
                        {delivery.status.replace("_", " ")}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-sm text-gray-500">
                      {order?.delivery_address}
                    </Text>
                    <Text className="text-sm font-bold text-blue-900">
                      ₦{delivery.delivery_fee}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-gray-500">
                      {getTimeAgo(delivery.created_at)}
                    </Text>
                    <View className="flex-row gap-2">
                      {delivery.status === "heading_to_seller" && (
                        <TouchableOpacity
                          onPress={() =>
                            updateDeliveryStatus(delivery.id, "picked_up")
                          }
                          className="bg-blue-900 px-3 py-1.5 rounded-full flex-row items-center gap-1"
                        >
                          <CheckCircle color="#FFFFFF" size={14} />
                          <Text className="text-white text-xs font-semibold">
                            Picked Up
                          </Text>
                        </TouchableOpacity>
                      )}
                      {delivery.status === "picked_up" && (
                        <TouchableOpacity
                          onPress={() =>
                            updateDeliveryStatus(delivery.id, "delivered")
                          }
                          className="bg-green-500 px-3 py-1.5 rounded-full flex-row items-center gap-1"
                        >
                          <CheckCircle color="#FFFFFF" size={14} />
                          <Text className="text-white text-xs font-semibold">
                            Delivered
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
