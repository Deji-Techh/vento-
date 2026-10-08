import { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Platform, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { pushToUser } from "../../src/lib/push";
import { buzz } from "../../src/lib/haptics";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { EmptyState } from "../../src/components/ui/Cards";
import { AppButton } from "../../src/components/ui/AppButton";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import {
  EyeIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  ArrowLeft01Icon,
  ReceiptIcon,
} from "../../src/components/icons";

const mockOrders = [
  {
    id: "order-001",
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    status: "pending",
    total_price: 3000,
    delivery_address: "123 Campus Road",
    notes: "Extra spicy please",
    items: [
      { name: "Jollof Rice Special", quantity: 1, price: 1500 },
      { name: "Fried Plantain", quantity: 2, price: 500 },
    ],
    profiles: { name: "Chidi Okonkwo", phone: "+2348012345678" },
  },
  {
    id: "order-002",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "preparing",
    total_price: 2500,
    delivery_address: "456 Hostel B",
    notes: null,
    items: [
      { name: "Fried Rice & Chicken", quantity: 1, price: 1800 },
      { name: "Chapman", quantity: 1, price: 700 },
    ],
    profiles: { name: "Amara Nwosu", phone: "+2348012345679" },
  },
  {
    id: "order-003",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: "completed",
    total_price: 2000,
    delivery_address: "789 Lecture Hall",
    notes: null,
    items: [{ name: "Eba with Egusi", quantity: 1, price: 2000 }],
    profiles: { name: "Chidera Obi", phone: "+2348012345680" },
  },
];

function toneFor(status: string): "success" | "warning" | "info" | "danger" | "neutral" {
  switch (status) {
    case "delivered":
      return "success";
    case "preparing":
      return "warning";
    case "accepted":
      return "info";
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
}

export default function SellerOrders() {
  const { user, profile } = useAuth();
  const { dark } = useTheme();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    if (!user) { setOrders([]); setLoading(false); setRefreshing(false); return; }
    try {
      const { data: stores } = await supabase.from("sellers").select("id").eq("owner_id", user.id);
      const ids = (stores || []).map((s: any) => s.id);
      if (ids.length === 0) { setOrders([]); return; }
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, status, total, delivery_address, notes, buyer_id, order_items(name, quantity, price)")
        .in("seller_id", ids)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      const buyerIds = [...new Set((data || []).map((o: any) => o.buyer_id))];
      let buyers: Record<string, any> = {};
      if (buyerIds.length > 0) {
        const { data: profs } = await supabase.from("profiles").select("id, name, phone").in("id", buyerIds);
        buyers = Object.fromEntries(((profs || []) as any[]).map((p: any) => [p.id, p]));
      }
      setOrders((data || []).map((o: any) => ({ ...o, total_price: o.total, items: o.order_items || [], profiles: buyers[o.buyer_id] || { name: "Buyer", phone: "" } })));
    } catch (e: any) {
      toast.error(e.message || "Couldn't load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load, profile]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
      if (error) throw error;
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      setSelectedOrder((prev: any) => (prev && prev.id === orderId ? { ...prev, status: newStatus } : prev));
      buzz("success");
      toast.success(`Order ${newStatus.replaceAll("_", " ")}`);
      const target = orders.find((o) => o.id === orderId);
      if (target?.buyer_id) {
        await supabase.from("notifications").insert({ user_id: target.buyer_id, kind: "order", title: `Order ${newStatus.replaceAll("_", " ")}`, body: "Your order status changed — tap to track", href: "/(buyer)/orders" });
        pushToUser(target.buyer_id, `Order ${newStatus.replaceAll("_", " ")}`, "Your order status changed — tap to track");
      }
      if (newStatus === "delivered" || newStatus === "cancelled") setDialogOpen(false);
    } catch (e: any) {
      buzz("error");
      toast.error(e.message || "Couldn't update order");
    }
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <View className="px-5 pt-4 pb-4">
        <Eyebrow>Incoming</Eyebrow>
        <Text className={`text-[28px] font-inter-bold mt-1 tracking-tight ${dark ? "text-white" : "text-ink"}`}>Orders</Text>
        <Text className={`text-[13px] font-inter mt-1 ${dark ? "text-white/55" : "text-ink/55"}`}>Manage incoming orders</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View className={`rounded-[24px] p-8 items-center border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className={`w-12 h-12 rounded-full border items-center justify-center mb-3 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
              <Icon icon={ReceiptIcon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
            </View>
            <Text className={`font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>No orders yet.</Text>
          </View>
        ) : (
          <View className="gap-4">
            {orders.map((order) => (
              <View key={order.id} className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                <View className="flex-row justify-between items-start mb-4 gap-2">
                  <View className="flex-1">
                    <Text className={`font-inter-bold text-lg tracking-tight ${dark ? "text-white" : "text-ink"}`}>
                      Order #{order.id.slice(0, 8)}
                    </Text>
                    <Text className={`text-[13px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`}>{order.profiles.name}</Text>
                    <View className="flex-row items-center gap-1.5 mt-1">
                      <Icon icon={Clock01Icon} size={13} color={dark ? "rgba(255,255,255,0.4)" : "rgba(10,10,14,0.4)"} />
                      <Text className={`text-xs font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
                        {new Date(order.created_at).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <StatusChip label={order.status} tone={toneFor(order.status)} />
                </View>

                <View className={`mb-4 border rounded-[20px] p-4 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                  <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-1 ${dark ? "text-white/55" : "text-ink/55"}`}>Items</Text>
                  <Text className={`text-[13px] font-inter ${dark ? "text-white" : "text-ink"}`}>
                    {order.items.map((item: any) => `${item.name} (x${item.quantity})`).join(", ")}
                  </Text>
                </View>

                <View className={`flex-row justify-between items-center pt-4 border-t ${dark ? "border-white/10" : "border-border"}`}>
                  <Text className={`font-inter-bold text-lg ${dark ? "text-white" : "text-ink"}`}>₦{order.total_price.toFixed(2)}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedOrder(order);
                      setDialogOpen(true);
                    }}
                    activeOpacity={0.85}
                    className={`flex-row items-center gap-1.5 border px-4 h-11 rounded-full ${dark ? "bg-white/10 border-white/10" : "bg-white border-border"}`}
                  >
                    <Icon icon={EyeIcon} size={16} color={dark ? "#fff" : "#0A0A0E"} />
                    <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>View details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={dialogOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setDialogOpen(false)}>
        <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
          <View className="flex-row items-center justify-between px-5 pt-4 pb-4">
            <Text className={`text-xl font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Order details</Text>
            <TouchableOpacity
              onPress={() => setDialogOpen(false)}
              activeOpacity={0.85}
              className={`w-10 h-10 rounded-full border items-center justify-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
            >
              <Icon icon={ArrowLeft01Icon} size={16} color={dark ? "#fff" : "#0A0A0E"} />
            </TouchableOpacity>
          </View>

          {selectedOrder && (
            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
              <View className="gap-4">
                <View className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                  <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-3 ${dark ? "text-white/55" : "text-ink/55"}`}>Order information</Text>
                  <View className="gap-2">
                    <Text className={`text-[13px] font-inter ${dark ? "text-white" : "text-ink"}`}>
                      <Text className="font-inter-bold">Order ID: </Text>
                      {selectedOrder.id}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Status: </Text>
                      <StatusChip label={selectedOrder.status} tone={toneFor(selectedOrder.status)} />
                    </View>
                    <Text className={`text-[13px] font-inter ${dark ? "text-white" : "text-ink"}`}>
                      <Text className="font-inter-bold">Date: </Text>
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </Text>
                  </View>
                </View>

                <View className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                  <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-3 ${dark ? "text-white/55" : "text-ink/55"}`}>
                    Buyer information
                  </Text>
                  <View className="gap-1">
                    <Text className={`text-[13px] font-inter ${dark ? "text-white" : "text-ink"}`}>
                      <Text className="font-inter-bold">Name: </Text>
                      {selectedOrder.profiles.name}
                    </Text>
                    {selectedOrder.profiles.phone && (
                      <Text className={`text-[13px] font-inter ${dark ? "text-white" : "text-ink"}`}>
                        <Text className="font-inter-bold">Phone: </Text>
                        {selectedOrder.profiles.phone}
                      </Text>
                    )}
                    <Text className={`text-[13px] font-inter ${dark ? "text-white" : "text-ink"}`}>
                      <Text className="font-inter-bold">Delivery address: </Text>
                      {selectedOrder.delivery_address}
                    </Text>
                  </View>
                </View>

                <View className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                  <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-3 ${dark ? "text-white/55" : "text-ink/55"}`}>Order items</Text>
                  <View className="gap-2">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <View key={idx} className={`flex-row justify-between items-center p-4 border rounded-[20px] ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                        <View>
                          <Text className={`font-inter-bold text-[13px] ${dark ? "text-white" : "text-ink"}`}>{item.name}</Text>
                          <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Quantity: {item.quantity}</Text>
                        </View>
                        <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>₦{(item.price * item.quantity).toFixed(2)}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                  <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-2 ${dark ? "text-white/55" : "text-ink/55"}`}>
                    Payment information
                  </Text>
                  <Text className={`text-[13px] font-inter ${dark ? "text-white" : "text-ink"}`}>
                    <Text className="font-inter-bold">Total amount: </Text>₦{selectedOrder.total_price.toFixed(2)}
                  </Text>
                </View>

                {selectedOrder.notes && (
                  <View className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                    <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-2 ${dark ? "text-white/55" : "text-ink/55"}`}>Order notes</Text>
                    <Text className={`text-[13px] font-inter border p-4 rounded-[20px] ${dark ? "text-white/55 bg-white/10 border-white/10" : "text-ink/55 bg-cream border-border"}`}>
                      {selectedOrder.notes}
                    </Text>
                  </View>
                )}

                {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                  <View className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                    <Text className={`font-inter-bold mb-4 ${dark ? "text-white" : "text-ink"}`}>Update order status</Text>
                    <View className="gap-3">
                      {selectedOrder.status === "pending" && (
                        <>
                          <AppButton title="Accept Order" variant={dark ? "white" : "ink"} onPress={() => updateOrderStatus(selectedOrder.id, "accepted")} />
                          <AppButton title="Decline Order" variant={dark ? "ghost-dark" : "ghost-light"} onPress={() => updateOrderStatus(selectedOrder.id, "cancelled")} />
                        </>
                      )}
                      {selectedOrder.status === "accepted" && (
                        <AppButton title="Mark as Preparing" variant={dark ? "white" : "ink"} onPress={() => updateOrderStatus(selectedOrder.id, "preparing")} />
                      )}
                      {selectedOrder.status === "preparing" && (
                        <AppButton title="Mark as Delivered" variant={dark ? "white" : "ink"} onPress={() => updateOrderStatus(selectedOrder.id, "delivered")} />
                      )}
                    </View>
                  </View>
                )}

                <View className="flex-row items-center justify-center gap-2 pt-1">
                  <Icon icon={CheckmarkCircle01Icon} size={15} color={dark ? "rgba(255,255,255,0.4)" : "rgba(10,10,14,0.4)"} />
                  <Text className={`text-xs font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Status updates notify the buyer instantly</Text>
                </View>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
