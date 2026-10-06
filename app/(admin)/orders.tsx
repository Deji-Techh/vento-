import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { supabase } from "../../src/lib/supabase";
import { pushToUser } from "../../src/lib/push";
import { useAuth } from "../../src/contexts/AuthContext";
import { buzz } from "../../src/lib/haptics";
import { EmptyState } from "../../src/components/ui/Cards";
import { Eyebrow, SectionHeader, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import { useTheme } from "../../src/contexts/ThemeContext";
import {
  ReceiptIcon,
  Package01Icon,
  MapPinIcon,
  CreditCardIcon,
  Clock01Icon,
} from "../../src/components/icons";

const mockOrders = [
  {
    id: "order-001",
    buyer_id: "buyer-001",
    seller_id: "seller-001",
    delivery_agent_id: "agent-001",
    status: "delivered",
    total_amount: 4500,
    delivery_fee: 500,
    delivery_address: "123 Campus Road",
    payment_method: "pay_on_delivery",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    buyer: { name: "Adebayo Johnson" },
    seller: { store_name: "Ada's Kitchen" },
  },
  {
    id: "order-002",
    buyer_id: "buyer-002",
    seller_id: "seller-002",
    delivery_agent_id: null,
    status: "pending",
    total_amount: 2800,
    delivery_fee: 300,
    delivery_address: "456 Hostel B",
    payment_method: "paystack",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    buyer: { name: "Fatima Ibrahim" },
    seller: { store_name: "Mama Nkechi's Spot" },
  },
  {
    id: "order-003",
    buyer_id: "buyer-003",
    seller_id: "seller-001",
    delivery_agent_id: "agent-002",
    status: "on_the_way",
    total_amount: 3200,
    delivery_fee: 400,
    delivery_address: "789 Lecture Hall",
    payment_method: "pay_on_delivery",
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    buyer: { name: "Chioma Eze" },
    seller: { store_name: "Ada's Kitchen" },
  },
];

const statusLabels: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  preparing: "Preparing",
  picked_up: "Picked up",
  on_the_way: "On the Way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function statusTone(status: string): "success" | "warning" | "info" | "danger" | "neutral" {
  switch (status) {
    case "delivered":
      return "success";
    case "cancelled":
      return "danger";
    case "pending":
    case "preparing":
      return "warning";
    case "accepted":
    case "picked_up":
    case "on_the_way":
      return "info";
    default:
      return "neutral";
  }
}

const tabs = ["All", "Pending", "Preparing", "On the Way", "Delivered"];

export default function AdminOrders() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [riders, setRiders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const load = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("id, buyer_id, seller_id, agent_id, status, total, delivery_fee, delivery_address, payment_method, created_at, order_items(name, quantity)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      const buyerIds = [...new Set((data || []).map((o: any) => o.buyer_id))];
      const sellerIds = [...new Set((data || []).map((o: any) => o.seller_id))];
      let buyers: Record<string, any> = {};
      let sellers: Record<string, any> = {};
      if (buyerIds.length > 0) {
        const { data: p } = await supabase.from("profiles").select("id, name").in("id", buyerIds);
        buyers = Object.fromEntries(((p || []) as any[]).map((x: any) => [x.id, x]));
      }
      if (sellerIds.length > 0) {
        const { data: s } = await supabase.from("sellers").select("id, store_name").in("id", sellerIds);
        sellers = Object.fromEntries(((s || []) as any[]).map((x: any) => [x.id, x]));
      }
      setOrders((data || []).map((o: any) => ({ ...o, total_amount: o.total, delivery_agent_id: o.agent_id, buyer: buyers[o.buyer_id] || { name: "Buyer" }, seller: sellers[o.seller_id] || { store_name: "Kitchen" } })));
      const { data: r } = await supabase.from("profiles").select("id, name").eq("role", "delivery_agent").limit(50);
      setRiders((r as any) || []);
    } catch (e: any) {
      toast.error(e.message || "Couldn't load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const assignRider = async (orderId: string, agentId: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status: "accepted", agent_id: agentId }).eq("id", orderId);
      if (error) throw error;
      await supabase.from("deliveries").upsert({ order_id: orderId, agent_id: agentId, status: "assigned" }, { onConflict: "order_id" });
      if (user) await supabase.from("admin_actions").insert({ admin_id: user.id, action_type: "rider_assigned", target_id: orderId, meta: { agent_id: agentId } });
      pushToUser(agentId, "New delivery 🛵", "An order was assigned to you — open Deliveries");
      buzz("success");
      toast.success("Rider assigned");
      setSelectedOrder(null);
      load();
    } catch (e: any) {
      buzz("error");
      toast.error(e.message || "Couldn't assign rider");
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const target = orders.find((o) => o.id === orderId);
      const { error } = await supabase.from("orders").update({ status: "cancelled" }).eq("id", orderId);
      if (error) throw error;
      if (user) await supabase.from("admin_actions").insert({ admin_id: user.id, action_type: "order_cancelled", target_id: orderId, meta: {} });
      if (target?.buyer_id) {
        await supabase.from("notifications").insert({ user_id: target.buyer_id, kind: "order", title: "Order cancelled", body: "Admin cancelled your order — contact support for a refund", href: "/(buyer)/orders" });
        pushToUser(target.buyer_id, "Order cancelled", "Admin cancelled your order — contact support for a refund");
      }
      buzz("success");
      toast.success("Order cancelled");
      setSelectedOrder(null);
      load();
    } catch (e: any) {
      buzz("error");
      toast.error(e.message || "Couldn't cancel order");
    }
  };

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter(
          (o) => o.status.toLowerCase().replace("_", " ") === activeTab.toLowerCase()
        );

  const openOrder = (order: any) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setSelectedOrder(order);
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 12, gap: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); buzz(); load(); }} tintColor={dark ? "#fff" : "#0A0A0E"} />}
      >
        <View>
          <Eyebrow>Oversight</Eyebrow>
          <Text className={`text-[28px] font-inter-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>
            Orders
          </Text>
          <Text className={`text-[13px] font-inter mt-1 ${dark ? "text-white/55" : "text-ink/55"}`}>
            View and manage all platform orders
          </Text>
        </View>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.85}
              className={`px-5 h-12 justify-center rounded-full border ${
                activeTab === tab
                  ? dark
                    ? "bg-white border-white"
                    : "bg-ink border-ink"
                  : dark
                    ? "bg-white/[0.06] border-white/10"
                    : "bg-white border-border"
              }`}
            >
              <Text
                className={`text-[14px] font-inter-bold ${
                  activeTab === tab ? (dark ? "text-ink" : "text-white") : dark ? "text-white/60" : "text-ink"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Order list */}
        {filteredOrders.length === 0 ? (
          <View className={`rounded-[24px] p-8 items-center border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <Icon icon={Package01Icon} size={22} color={dark ? "rgba(255,255,255,0.6)" : "#6E6A75"} />
            <Text className={`mt-3 font-inter-medium text-[14px] ${dark ? "text-white/55" : "text-ink/55"}`}>
              No orders found
            </Text>
          </View>
        ) : (
          <View>
            <SectionHeader title="All orders" action={`${filteredOrders.length}`} />
            <View className="gap-3">
              {filteredOrders.map((order) => (
                <TouchableOpacity
                  key={order.id}
                  onPress={() => openOrder(order)}
                  activeOpacity={0.9}
                  className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
                >
                  <View className="flex-row items-center justify-between gap-2">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 mb-1.5 flex-wrap">
                        <Text className={`font-inter-bold text-[15px] ${dark ? "text-white" : "text-ink"}`}>
                          #{order.id.slice(0, 8)}
                        </Text>
                        <StatusChip
                          label={statusLabels[order.status] || order.status}
                          tone={statusTone(order.status)}
                        />
                      </View>
                      <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
                        {order.buyer?.name} → {order.seller?.store_name}
                      </Text>
                      <Text className={`text-[12px] font-inter mt-1 ${dark ? "text-white/55" : "text-ink/55"}`}>
                        {new Date(order.created_at).toLocaleString()}
                      </Text>
                    </View>
                    <View className="items-end gap-1">
                      <Text className={`font-inter-bold text-[15px] ${dark ? "text-white" : "text-ink"}`}>
                        ₦{order.total_amount.toLocaleString()}
                      </Text>
                      <Text className={`font-inter-bold ${dark ? "text-white/40" : "text-ink/40"}`}>›</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Order detail modal */}
        <Modal
          visible={!!selectedOrder}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setSelectedOrder(null)}
        >
          <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
            <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
              <View className="flex-1">
                <Eyebrow>Order detail</Eyebrow>
                <Text className={`text-[20px] font-inter-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>
                  Order Details
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedOrder(null)}
                activeOpacity={0.85}
                className={`w-11 h-11 rounded-full border items-center justify-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
              >
                <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <ScrollView
                className="flex-1 px-5"
                contentContainerStyle={{ paddingBottom: 40, gap: 16 }}
                showsVerticalScrollIndicator={false}
              >
                <View className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                  <View className="flex-row items-center gap-2 mb-4 flex-wrap">
                    <View className={`w-11 h-11 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                      <Icon icon={ReceiptIcon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
                    </View>
                    <Text className={`text-[18px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
                      #{selectedOrder.id.slice(0, 8)}
                    </Text>
                    <StatusChip
                      label={statusLabels[selectedOrder.status] || selectedOrder.status}
                      tone={statusTone(selectedOrder.status)}
                    />
                  </View>

                  <View className={`border rounded-[20px] p-4 gap-3 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                    <View className="flex-row justify-between">
                      <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Buyer</Text>
                      <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
                        {selectedOrder.buyer?.name}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Seller</Text>
                      <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
                        {selectedOrder.seller?.store_name}
                      </Text>
                    </View>
                    <View className="flex-row justify-between gap-3">
                      <View className="flex-row items-center gap-1.5">
                        <Icon icon={MapPinIcon} size={14} color={dark ? "rgba(255,255,255,0.6)" : "#6E6A75"} />
                        <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
                          Delivery Address
                        </Text>
                      </View>
                      <Text className={`text-[13px] font-inter-bold text-right flex-1 ${dark ? "text-white" : "text-ink"}`}>
                        {selectedOrder.delivery_address}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <View className="flex-row items-center gap-1.5">
                        <Icon icon={CreditCardIcon} size={14} color={dark ? "rgba(255,255,255,0.6)" : "#6E6A75"} />
                        <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Payment</Text>
                      </View>
                      <Text className={`text-[13px] font-inter-bold capitalize ${dark ? "text-white" : "text-ink"}`}>
                        {selectedOrder.payment_method.replaceAll("_", " ")}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
                        Delivery Fee
                      </Text>
                      <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
                        ₦{selectedOrder.delivery_fee.toLocaleString()}
                      </Text>
                    </View>
                    <View className={`border-t pt-3 mt-1 ${dark ? "border-white/10" : "border-border"}`}>
                      <View className="flex-row justify-between">
                        <Text className={`font-inter-bold text-[14px] ${dark ? "text-white" : "text-ink"}`}>Total</Text>
                        <Text className={`font-inter-bold text-[14px] ${dark ? "text-white" : "text-ink"}`}>
                          ₦{selectedOrder.total_amount.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                  <View className="flex-row items-center gap-2 mb-2">
                    <Icon icon={Clock01Icon} size={16} color={dark ? "rgba(255,255,255,0.6)" : "#6E6A75"} />
                    <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/50" : "text-ink/50"}`}>
                      Timeline
                    </Text>
                  </View>
                  <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
                    Created: {new Date(selectedOrder.created_at).toLocaleString()}
                  </Text>
                </View>

                {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                  <View className={`rounded-[24px] p-6 border gap-3 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                    <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/50" : "text-ink/50"}`}>Assign rider</Text>
                    {riders.length === 0 ? (
                      <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>No riders yet — they appear after signing up to deliver.</Text>
                    ) : (
                      riders.map((r: any) => (
                        <TouchableOpacity key={r.id} onPress={() => assignRider(selectedOrder.id, r.id)} accessibilityLabel={`Assign ${r.name}`} className={`h-[52px] rounded-full border items-center justify-center ${dark ? "border-white/15" : "border-ink/15"}`}>
                          <Text className={`text-[14px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Assign {r.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                    <TouchableOpacity onPress={() => cancelOrder(selectedOrder.id)} accessibilityLabel="Cancel order" className="h-[52px] rounded-full items-center justify-center bg-[#D92D20]">
                      <Text className="text-[14px] font-inter-bold text-white">Cancel order</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            )}
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
