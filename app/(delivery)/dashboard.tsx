import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import {
  Navigation01Icon,
  Wallet01Icon,
  Package01Icon,
  Clock01Icon,
  ChartLineIcon,
  CheckmarkCircle01Icon,
  DeliveryBox01Icon,
} from "../../src/components/icons";

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

type ChipTone = "neutral" | "success" | "warning" | "info" | "danger";

const statusTone = (status: string): ChipTone => {
  switch (status) {
    case "delivered":
      return "success";
    case "picked_up":
      return "warning";
    case "heading_to_seller":
    case "on_the_way":
    case "assigned":
      return "info";
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
};

const statusLabel = (status: string) => status.replaceAll("_", " ");

const getTimeAgo = (date: string) => {
  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const buzz = () => {
  if (Platform.OS !== "web") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }
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
    buzz();
    if (newStatus) {
      toast.success("You are now online", {
        description: "You can receive new delivery assignments",
      });
    } else {
      toast.success("You are now offline", {
        description: "You won't receive new assignments",
      });
    }
  };

  const updateDeliveryStatus = (deliveryId: string, newStatus: string) => {
    setActiveDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId ? { ...d, status: newStatus } : d
      )
    );
    buzz();
    toast.success(`Delivery marked as ${statusLabel(newStatus)}`);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-cream">
        <ActivityIndicator size="large" color="#0A0A0E" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-cream" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      {/* Availability hero */}
      <View className="px-5 pt-14">
        <Eyebrow>Rider dashboard</Eyebrow>
        <Text className="text-[28px] font-inter-bold text-ink tracking-tight mt-1">
          Deliveries
        </Text>
        <View className="bg-white rounded-[28px] p-6 border border-border mt-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-[11px] font-inter-bold uppercase tracking-[2px] text-ink/55">
                Availability
              </Text>
              <View className="flex-row items-center mt-3">
                <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink/5">
                  <View className={`w-2 h-2 rounded-full ${isOnline ? "bg-success" : "bg-ink/30"}`} />
                  <Text className="text-[11px] font-inter-bold tracking-[1px] text-ink">
                    {isOnline ? "ONLINE" : "OFFLINE"}
                  </Text>
                </View>
              </View>
              <Text className="text-[13px] font-inter text-ink/55 mt-2">
                {isOnline ? "You can receive new assignments" : "Go online to receive assignments"}
              </Text>
            </View>
            <View className="items-center gap-2">
              <View className="w-14 h-14 rounded-full bg-cream border border-border items-center justify-center">
                <Icon icon={Navigation01Icon} size={22} color="#0A0A0E" />
              </View>
              <Switch
                value={isOnline}
                onValueChange={toggleOnlineStatus}
                trackColor={{ true: "#0A0A0E", false: "#E7E0D2" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
      </View>

      {/* 2x2 stat cards */}
      <View className="px-5 mt-4 flex-row gap-3">
        <View className="flex-1 bg-white rounded-[24px] p-5 border border-border">
          <View className="w-11 h-11 rounded-full bg-cream border border-border items-center justify-center mb-2">
            <Icon icon={Wallet01Icon} size={20} color="#0A0A0E" />
          </View>
          <Text className="text-[12px] font-inter text-ink/55">Total earnings</Text>
          <Text className="text-[18px] font-inter-bold text-ink mt-0.5">
            ₦{(agent?.total_earnings || 0).toLocaleString()}
          </Text>
        </View>
        <View className="flex-1 bg-white rounded-[24px] p-5 border border-border">
          <View className="w-11 h-11 rounded-full bg-cream border border-border items-center justify-center mb-2">
            <Icon icon={Package01Icon} size={20} color="#12805C" />
          </View>
          <Text className="text-[12px] font-inter text-ink/55">Completed</Text>
          <Text className="text-[18px] font-inter-bold text-ink mt-0.5">
            {agent?.completed_deliveries || 0}
          </Text>
        </View>
      </View>
      <View className="px-5 mt-3 flex-row gap-3">
        <View className="flex-1 bg-white rounded-[24px] p-5 border border-border">
          <View className="w-11 h-11 rounded-full bg-cream border border-border items-center justify-center mb-2">
            <Icon icon={Clock01Icon} size={20} color="#0A0A0E" />
          </View>
          <Text className="text-[12px] font-inter text-ink/55">Active</Text>
          <Text className="text-[18px] font-inter-bold text-ink mt-0.5">
            {activeDeliveries.length}
          </Text>
        </View>
        <View className="flex-1 bg-white rounded-[24px] p-5 border border-border">
          <View className="w-11 h-11 rounded-full bg-cream border border-border items-center justify-center mb-2">
            <Icon icon={ChartLineIcon} size={20} color="#0A0A0E" />
          </View>
          <Text className="text-[12px] font-inter text-ink/55">Status</Text>
          <View className="mt-1.5 self-start">
            <StatusChip label={agent?.is_active ? "Active" : "Inactive"} tone={agent?.is_active ? "success" : "neutral"} />
          </View>
        </View>
      </View>

      {/* Active deliveries */}
      <View className="px-5 mt-8">
        <Text className="text-[11px] font-inter-bold uppercase tracking-[2px] text-ink/55 mb-4">
          Active deliveries
        </Text>
        {activeDeliveries.length === 0 ? (
          <View className="bg-white rounded-[24px] p-8 items-center border border-border">
            <View className="w-16 h-16 rounded-full bg-cream border border-border items-center justify-center">
              <Icon icon={DeliveryBox01Icon} size={22} color="rgba(10,10,14,0.4)" />
            </View>
            <Text className="text-ink font-inter-bold mt-3">No active deliveries</Text>
            <Text className="text-[13px] font-inter text-ink/55 mt-1 text-center">
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
                  className="bg-white rounded-[24px] p-6 border border-border"
                >
                  <View className="flex-row items-start justify-between mb-3 gap-2">
                    <View className="flex-1 flex-row items-center gap-2.5">
                      <View className="w-12 h-12 rounded-full bg-cream border border-border items-center justify-center">
                        <Icon icon={Package01Icon} size={20} color="#0A0A0E" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-inter-bold text-ink">
                          #{delivery.order_id.slice(0, 8)}
                        </Text>
                        <Text className="text-[12px] font-inter text-ink/55 mt-0.5" numberOfLines={1}>
                          {itemNames.join(", ")}
                        </Text>
                      </View>
                    </View>
                    <StatusChip label={statusLabel(delivery.status)} tone={statusTone(delivery.status)} />
                  </View>

                  <View className="flex-row items-center justify-between bg-cream border border-border rounded-[20px] px-4 py-3 mb-3">
                    <Text className="text-[13px] font-inter text-ink/55 flex-1" numberOfLines={1}>
                      {order?.delivery_address}
                    </Text>
                    <Text className="text-[16px] font-inter-bold text-ink ml-2">
                      ₦{delivery.delivery_fee}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-[12px] font-inter text-ink/55">
                      {getTimeAgo(delivery.created_at)}
                    </Text>
                    <View className="flex-row gap-2">
                      {delivery.status === "heading_to_seller" && (
                        <TouchableOpacity
                          onPress={() =>
                            updateDeliveryStatus(delivery.id, "picked_up")
                          }
                          activeOpacity={0.85}
                          className="bg-ink px-4 h-11 rounded-full flex-row items-center gap-1.5"
                        >
                          <Icon icon={CheckmarkCircle01Icon} size={14} color="#fff" />
                          <Text className="text-white text-[12px] font-inter-bold">
                            Picked Up
                          </Text>
                        </TouchableOpacity>
                      )}
                      {delivery.status === "picked_up" && (
                        <TouchableOpacity
                          onPress={() =>
                            updateDeliveryStatus(delivery.id, "delivered")
                          }
                          activeOpacity={0.85}
                          className="bg-ink px-4 h-11 rounded-full flex-row items-center gap-1.5"
                        >
                          <Icon icon={CheckmarkCircle01Icon} size={14} color="#fff" />
                          <Text className="text-white text-[12px] font-inter-bold">
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
