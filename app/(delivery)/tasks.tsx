import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Package, CheckCircle, Clock } from "lucide-react-native";

const mockActiveDeliveries = [
  {
    id: "delivery-001",
    order_id: "order-001",
    status: "heading_to_seller",
    delivery_fee: 500,
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    orders: {
      id: "order-001",
      notes: "Extra spicy please",
      delivery_address: "123 Campus Road",
      items: [{ name: "Jollof Rice" }, { name: "Fried Plantain" }],
    },
  },
  {
    id: "delivery-002",
    order_id: "order-002",
    status: "picked_up",
    delivery_fee: 750,
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    orders: {
      id: "order-002",
      notes: null,
      delivery_address: "456 Hostel B",
      items: [{ name: "Eba with Egusi" }],
    },
  },
];

const mockCompletedDeliveries = [
  {
    id: "delivery-003",
    order_id: "order-003",
    status: "delivered",
    delivery_fee: 400,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    orders: {
      id: "order-003",
      notes: null,
      delivery_address: "789 Lecture Hall",
      items: [{ name: "Puff Puff" }, { name: "Chapman" }],
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

export default function DeliveryTasks() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([]);
  const [completedDeliveries, setCompletedDeliveries] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setActiveDeliveries(mockActiveDeliveries);
      setCompletedDeliveries(mockCompletedDeliveries);
      setLoading(false);
    }, 800);
  }, []);

  const updateDeliveryStatus = (deliveryId: string, newStatus: string) => {
    setActiveDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId ? { ...d, status: newStatus } : d
      )
    );
    Alert.alert("Status updated", `Delivery marked as ${newStatus.replace("_", " ")}`);
  };

  const renderDeliveryCard = (delivery: any, showActions: boolean) => {
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
          {showActions && (
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
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  const displayDeliveries =
    activeTab === "active" ? activeDeliveries : completedDeliveries;

  return (
    <ScrollView className="flex-1 bg-white p-6" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900">My Deliveries</Text>
        <Text className="text-gray-500">
          Track and manage your delivery tasks
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row gap-2 mb-6">
        <TouchableOpacity
          onPress={() => setActiveTab("active")}
          className={`flex-1 py-3 rounded-xl items-center ${
            activeTab === "active" ? "bg-blue-900" : "bg-gray-100"
          }`}
        >
          <Text
            className={`font-semibold ${
              activeTab === "active" ? "text-white" : "text-gray-900"
            }`}
          >
            Active ({activeDeliveries.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("completed")}
          className={`flex-1 py-3 rounded-xl items-center ${
            activeTab === "completed" ? "bg-blue-900" : "bg-gray-100"
          }`}
        >
          <Text
            className={`font-semibold ${
              activeTab === "completed" ? "text-white" : "text-gray-900"
            }`}
          >
            Completed ({completedDeliveries.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Delivery List */}
      {displayDeliveries.length === 0 ? (
        <View className="bg-white rounded-xl p-8 items-center border border-gray-200">
          <Package color="#9CA3AF" size={48} />
          <Text className="text-gray-500 mt-3">No deliveries found</Text>
        </View>
      ) : (
        <View className="gap-4">
          {displayDeliveries.map((delivery) =>
            renderDeliveryCard(delivery, activeTab === "active")
          )}
        </View>
      )}
    </ScrollView>
  );
}
