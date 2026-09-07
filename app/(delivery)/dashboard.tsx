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
      <View className="flex-1 items-center justify-center bg-[#FAF5EA]">
        <ActivityIndicator size="large" color="#1B1B8F" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#FAF5EA]" contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Status card — white */}
      <View className="px-5 pt-14">
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-3">
          Rider Dashboard
        </Text>
        <View className="bg-white rounded-[28px] p-6 border border-[#E7E0D2]">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">Availability</Text>
              <Text className="text-2xl font-bold text-ink mt-1">Deliveries</Text>
              <View className="flex-row items-center mt-3">
                <View className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${isOnline ? "bg-[#E3F2E8] border-[#E3F2E8]" : "bg-[#FAF5EA] border-[#E7E0D2]"}`}>
                  <View className={`w-2 h-2 rounded-full ${isOnline ? "bg-[#12805C]" : "bg-[#B9B4C0]"}`} />
                  <Text className="text-[11px] font-bold tracking-[1px] text-ink">
                    {isOnline ? "ONLINE" : "OFFLINE"}
                  </Text>
                </View>
              </View>
            </View>
            <View className="items-center gap-2">
              <View className="w-14 h-14 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
                <Navigation color="#1B1B8F" size={22} />
              </View>
              <Switch
                value={isOnline}
                onValueChange={toggleOnlineStatus}
                trackColor={{ true: "#1B1B8F", false: "#D8D2C4" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
      </View>

      {/* 2x2 stat white cards */}
      <View className="px-5 mt-4 flex-row gap-3">
        <View className="flex-1 bg-white rounded-[26px] p-5 border border-[#E7E0D2]">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-2">
            <Wallet color="#1B1B8F" size={20} />
          </View>
          <Text className="text-xs text-ink/55">Total Earnings</Text>
          <Text className="text-lg font-bold text-ink mt-0.5">
            ₦{(agent?.total_earnings || 0).toLocaleString()}
          </Text>
        </View>
        <View className="flex-1 bg-white rounded-[26px] p-5 border border-[#E7E0D2]">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-2">
            <Package color="#12805C" size={20} />
          </View>
          <Text className="text-xs text-ink/55">Completed</Text>
          <Text className="text-lg font-bold text-ink mt-0.5">
            {agent?.completed_deliveries || 0}
          </Text>
        </View>
      </View>
      <View className="px-5 mt-3 flex-row gap-3">
        <View className="flex-1 bg-white rounded-[26px] p-5 border border-[#E7E0D2]">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-2">
            <Clock color="#1B1B8F" size={20} />
          </View>
          <Text className="text-xs text-ink/55">Active</Text>
          <Text className="text-lg font-bold text-ink mt-0.5">
            {activeDeliveries.length}
          </Text>
        </View>
        <View className="flex-1 bg-white rounded-[26px] p-5 border border-[#E7E0D2]">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-2">
            <TrendingUp color="#1B1B8F" size={20} />
          </View>
          <Text className="text-xs text-ink/55">Status</Text>
          <View className={`self-start mt-1.5 px-2.5 py-1 rounded-full ${agent?.is_active ? "bg-[#E3F2E8]" : "bg-[#FAF5EA] border border-[#E7E0D2]"}`}>
            <Text className="text-[11px] font-bold" style={{ color: agent?.is_active ? "#12805C" : "#6E6A75" }}>
              {agent?.is_active ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>
      </View>

      {/* Active delivery white cards */}
      <View className="px-5 mt-8">
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-4">Active Deliveries</Text>
        {activeDeliveries.length === 0 ? (
          <View className="bg-white rounded-[26px] p-8 items-center border border-[#E7E0D2]">
            <View className="w-16 h-16 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
              <Package color="#6E6A75" size={22} />
            </View>
            <Text className="text-ink font-bold mt-3">No active deliveries</Text>
            <Text className="text-sm text-ink/55 mt-1 text-center">
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
