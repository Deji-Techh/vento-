import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Package, CheckCircle } from "lucide-react-native";

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

const statusChip: Record<string, string> = {
  assigned: "bg-[#EDEDF7]",
  heading_to_seller: "bg-[#E8EDFF]",
  picked_up: "bg-[#FFF3D6]",
  on_the_way: "bg-[#E8EDFF]",
  delivered: "bg-[#E3F2E8]",
  cancelled: "bg-[#FDE8E4]",
};

const statusText: Record<string, string> = {
  assigned: "#1B1B8F",
  heading_to_seller: "#1B1B8F",
  picked_up: "#8A5A00",
  on_the_way: "#1B1B8F",
  delivered: "#12805C",
  cancelled: "#C0361F",
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
        className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]"
      >
        <View className="flex-row items-start justify-between mb-3 gap-2">
          <View className="flex-1 flex-row items-center gap-2.5">
            <View className="w-12 h-12 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
              <Package color="#1B1B8F" size={20} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-ink">
                #{delivery.order_id.slice(0, 8)}
              </Text>
              <Text className="text-xs text-ink/55 mt-0.5" numberOfLines={1}>
                {itemNames.join(", ")}
              </Text>
            </View>
          </View>
          <View
            className={`px-2.5 py-1.5 rounded-full ${statusChip[delivery.status] || statusChip.assigned}`}
          >
            <Text
              className="text-[11px] font-bold capitalize"
              style={{ color: statusText[delivery.status] || statusText.assigned }}
            >
              {delivery.status.replaceAll("_", " ")}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between bg-[#FAF5EA] border border-[#E7E0D2] rounded-2xl px-4 py-3 mb-3">
          <Text className="text-sm text-ink/55 flex-1" numberOfLines={1}>
            {order?.delivery_address}
          </Text>
          <Text className="text-base font-bold text-[#1B1B8F] ml-2">
            ₦{delivery.delivery_fee}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-ink/55">
            {getTimeAgo(delivery.created_at)}
          </Text>
          {showActions && (
            <View className="flex-row gap-2">
              {delivery.status === "heading_to_seller" && (
                <TouchableOpacity
                  onPress={() =>
                    updateDeliveryStatus(delivery.id, "picked_up")
                  }
                  className="bg-ink px-4 h-11 rounded-full flex-row items-center gap-1.5"
                >
                  <CheckCircle color="#FFFFFF" size={14} />
                  <Text className="text-white text-xs font-bold">
                    Picked Up
                  </Text>
                </TouchableOpacity>
              )}
              {delivery.status === "picked_up" && (
                <TouchableOpacity
                  onPress={() =>
                    updateDeliveryStatus(delivery.id, "delivered")
                  }
                  className="bg-ink px-4 h-11 rounded-full flex-row items-center gap-1.5"
                >
                  <CheckCircle color="#FFFFFF" size={14} />
                  <Text className="text-white text-xs font-bold">
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
      <View className="flex-1 items-center justify-center bg-[#FAF5EA]">
        <ActivityIndicator size="large" color="#1B1B8F" />
      </View>
    );
  }

  const displayDeliveries =
    activeTab === "active" ? activeDeliveries : completedDeliveries;

  return (
    <ScrollView className="flex-1 bg-[#FAF5EA] px-5 pt-14" contentContainerStyle={{ paddingBottom: 120 }}>
      <View className="mb-6">
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">
          Tasks
        </Text>
        <Text className="text-[28px] font-bold text-ink mt-1">Deliveries</Text>
        <Text className="text-sm text-ink/55 mt-1">
          Track and manage your delivery tasks
        </Text>
      </View>

      {/* Tabs — pill buttons h-14 rounded-full */}
      <View className="flex-row gap-2 mb-6 bg-white border border-[#E7E0D2] rounded-full p-1.5">
        <TouchableOpacity
          onPress={() => setActiveTab("active")}
          className={`flex-1 h-14 rounded-full items-center justify-center ${
            activeTab === "active" ? "bg-ink" : "bg-transparent"
          }`}
        >
          <Text
            className={`font-bold text-sm ${
              activeTab === "active" ? "text-white" : "text-ink"
            }`}
          >
            Active ({activeDeliveries.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("completed")}
          className={`flex-1 h-14 rounded-full items-center justify-center ${
            activeTab === "completed" ? "bg-ink" : "bg-transparent"
          }`}
        >
          <Text
            className={`font-bold text-sm ${
              activeTab === "completed" ? "text-white" : "text-ink"
            }`}
          >
            Completed ({completedDeliveries.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Delivery List */}
      {displayDeliveries.length === 0 ? (
        <View className="bg-white rounded-[26px] p-8 items-center border border-[#E7E0D2]">
          <View className="w-16 h-16 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
            <Package color="#6E6A75" size={22} />
          </View>
          <Text className="text-ink/55 mt-3 font-semibold">No deliveries found</Text>
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
