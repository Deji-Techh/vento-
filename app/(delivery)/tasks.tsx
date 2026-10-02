import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import { useTheme } from "../../src/contexts/ThemeContext";
import {
  Package01Icon,
  CheckmarkCircle01Icon,
  DeliveryBox01Icon,
} from "../../src/components/icons";

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

export default function DeliveryTasks() {
  const { dark } = useTheme();
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
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    toast.success(`Delivery marked as ${statusLabel(newStatus)}`);
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
        className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
      >
        <View className="flex-row items-start justify-between mb-3 gap-2">
          <View className="flex-1 flex-row items-center gap-2.5">
            <View className={`w-12 h-12 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
              <Icon icon={Package01Icon} size={20} color={dark ? "#FFFFFF" : "#0A0A0E"} />
            </View>
            <View className="flex-1">
              <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
                #{delivery.order_id.slice(0, 8)}
              </Text>
              <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`} numberOfLines={1}>
                {itemNames.join(", ")}
              </Text>
            </View>
          </View>
          <StatusChip label={statusLabel(delivery.status)} tone={statusTone(delivery.status)} />
        </View>

        <View className={`flex-row items-center justify-between border rounded-[20px] px-4 py-3 mb-3 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
          <Text className={`text-[13px] font-inter flex-1 ${dark ? "text-white/55" : "text-ink/55"}`} numberOfLines={1}>
            {order?.delivery_address}
          </Text>
          <Text className={`text-[16px] font-inter-bold ml-2 ${dark ? "text-white" : "text-ink"}`}>
            ₦{delivery.delivery_fee}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
            {getTimeAgo(delivery.created_at)}
          </Text>
          {showActions && (
            <View className="flex-row gap-2">
              {delivery.status === "heading_to_seller" && (
                <TouchableOpacity
                  onPress={() =>
                    updateDeliveryStatus(delivery.id, "picked_up")
                  }
                  activeOpacity={0.85}
                  className={`px-4 h-11 rounded-full flex-row items-center gap-1.5 ${dark ? "bg-white" : "bg-ink"}`}
                >
                  <Icon icon={CheckmarkCircle01Icon} size={14} color={dark ? "#0A0A0E" : "#fff"} />
                  <Text className={`text-[12px] font-inter-bold ${dark ? "text-ink" : "text-white"}`}>
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
                  className={`px-4 h-11 rounded-full flex-row items-center gap-1.5 ${dark ? "bg-white" : "bg-ink"}`}
                >
                  <Icon icon={CheckmarkCircle01Icon} size={14} color={dark ? "#0A0A0E" : "#fff"} />
                  <Text className={`text-[12px] font-inter-bold ${dark ? "text-ink" : "text-white"}`}>
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
      <View className={`flex-1 items-center justify-center ${dark ? "bg-ink" : "bg-cream"}`}>
        <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
      </View>
    );
  }

  const displayDeliveries =
    activeTab === "active" ? activeDeliveries : completedDeliveries;

  return (
    <ScrollView className={`flex-1 px-5 pt-14 ${dark ? "bg-ink" : "bg-cream"}`} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Eyebrow>Tasks</Eyebrow>
        <Text className={`text-[28px] font-inter-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>Deliveries</Text>
        <Text className={`text-[13px] font-inter mt-1 ${dark ? "text-white/55" : "text-ink/55"}`}>
          Track and manage your delivery tasks
        </Text>
      </View>

      {/* Tabs */}
      <View className={`flex-row gap-2 mb-6 border rounded-full p-1.5 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
        <TouchableOpacity
          onPress={() => setActiveTab("active")}
          activeOpacity={0.85}
          className={`flex-1 h-14 rounded-full items-center justify-center ${
            activeTab === "active" ? (dark ? "bg-white" : "bg-ink") : "bg-transparent"
          }`}
        >
          <Text
            className={`font-inter-bold text-[13px] ${
              activeTab === "active" ? (dark ? "text-ink" : "text-white") : dark ? "text-white/60" : "text-ink"
            }`}
          >
            Active ({activeDeliveries.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("completed")}
          activeOpacity={0.85}
          className={`flex-1 h-14 rounded-full items-center justify-center ${
            activeTab === "completed" ? (dark ? "bg-white" : "bg-ink") : "bg-transparent"
          }`}
        >
          <Text
            className={`font-inter-bold text-[13px] ${
              activeTab === "completed" ? (dark ? "text-ink" : "text-white") : dark ? "text-white/60" : "text-ink"
            }`}
          >
            Completed ({completedDeliveries.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Delivery List */}
      {displayDeliveries.length === 0 ? (
        <View className={`rounded-[24px] p-8 items-center border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <View className={`w-16 h-16 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
            <Icon icon={DeliveryBox01Icon} size={22} color={dark ? "rgba(255,255,255,0.4)" : "rgba(10,10,14,0.4)"} />
          </View>
          <Text className={`mt-3 font-inter-semibold ${dark ? "text-white/55" : "text-ink/55"}`}>No deliveries found</Text>
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
