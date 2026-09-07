import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Package, X, ChevronRight } from "lucide-react-native";

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

const statusChip: Record<string, string> = {
  pending: "bg-[#EDEDF7]",
  confirmed: "bg-[#E8EDFF]",
  preparing: "bg-[#FFF3D6]",
  ready_for_pickup: "bg-[#EDEDF7]",
  assigned: "bg-[#E8EDFF]",
  on_the_way: "bg-[#E8EDFF]",
  delivered: "bg-[#E3F2E8]",
  cancelled: "bg-[#FDE8E4]",
};

const statusText: Record<string, string> = {
  pending: "#1B1B8F",
  confirmed: "#1B1B8F",
  preparing: "#8A5A00",
  ready_for_pickup: "#1B1B8F",
  assigned: "#1B1B8F",
  on_the_way: "#1B1B8F",
  delivered: "#12805C",
  cancelled: "#C0361F",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready_for_pickup: "Ready",
  assigned: "Assigned",
  on_the_way: "On the Way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const tabs = ["All", "Pending", "Preparing", "On the Way", "Delivered"];

export default function AdminOrders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 800);
  }, []);

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter(
          (o) => o.status.toLowerCase().replace("_", " ") === activeTab.toLowerCase()
        );

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
          Oversight
        </Text>
        <Text className="text-[28px] font-bold text-ink mt-1">Orders</Text>
        <Text className="text-sm text-ink/55">View and manage all platform orders</Text>
      </View>

      {/* Filter Tabs — pill */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`px-5 h-12 justify-center rounded-full border ${
              activeTab === tab ? "bg-ink border-ink" : "bg-white border-[#E7E0D2]"
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                activeTab === tab ? "text-white" : "text-ink"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <View className="bg-white rounded-[26px] p-8 items-center border border-[#E7E0D2]">
          <Package color="#6E6A75" size={22} />
          <Text className="text-ink/55 mt-3 font-semibold">No orders found</Text>
        </View>
      ) : (
        <View className="gap-4">
          {filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => setSelectedOrder(order)}
              activeOpacity={0.9}
              className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]"
            >
              <View className="flex-row items-center justify-between gap-2">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1.5 flex-wrap">
                    <Text className="font-bold text-ink">
                      #{order.id.slice(0, 8)}
                    </Text>
                    <View
                      className={`px-2.5 py-1 rounded-full ${statusChip[order.status] || statusChip.pending}`}
                    >
                      <Text
                        className="text-[11px] font-bold capitalize"
                        style={{ color: statusText[order.status] || statusText.pending }}
                      >
                        {statusLabels[order.status] || order.status}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm text-ink/55">
                    {order.buyer?.name} → {order.seller?.store_name}
                  </Text>
                  <Text className="text-xs text-ink/55 mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </Text>
                </View>
                <View className="items-end gap-1">
                  <Text className="font-bold text-[#1B1B8F]">
                    ₦{order.total_amount.toLocaleString()}
                  </Text>
                  <ChevronRight color="#6E6A75" size={16} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Order Detail Modal */}
      <Modal
        visible={!!selectedOrder}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View className="flex-1 bg-[#FAF5EA]">
          <View className="flex-row items-center justify-between px-5 pt-6 pb-4">
            <Text className="text-xl font-bold text-ink">Order Details</Text>
            <TouchableOpacity
              onPress={() => setSelectedOrder(null)}
              className="w-10 h-10 rounded-full bg-white border border-[#E7E0D2] items-center justify-center"
            >
              <X color="#0A0A0E" size={16} />
            </TouchableOpacity>
          </View>

          {selectedOrder && (
            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40, gap: 16 }}>
              <View className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]">
                <View className="flex-row items-center gap-2 mb-3 flex-wrap">
                  <Text className="text-lg font-bold text-ink">
                    #{selectedOrder.id.slice(0, 8)}
                  </Text>
                  <View
                    className={`px-2.5 py-1 rounded-full ${statusChip[selectedOrder.status] || statusChip.pending}`}
                  >
                    <Text
                      className="text-[11px] font-bold capitalize"
                      style={{ color: statusText[selectedOrder.status] || statusText.pending }}
                    >
                      {statusLabels[selectedOrder.status] || selectedOrder.status}
                    </Text>
                  </View>
                </View>

                <View className="bg-[#FAF5EA] border border-[#E7E0D2] rounded-2xl p-4 gap-2.5">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-ink/55">Buyer</Text>
                    <Text className="text-sm font-bold text-ink">
                      {selectedOrder.buyer?.name}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-ink/55">Seller</Text>
                    <Text className="text-sm font-bold text-ink">
                      {selectedOrder.seller?.store_name}
                    </Text>
                  </View>
                  <View className="flex-row justify-between gap-3">
                    <Text className="text-sm text-ink/55">Delivery Address</Text>
                    <Text className="text-sm font-bold text-ink text-right flex-1">
                      {selectedOrder.delivery_address}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-ink/55">Payment</Text>
                    <Text className="text-sm font-bold text-ink capitalize">
                      {selectedOrder.payment_method.replaceAll("_", " ")}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-ink/55">Delivery Fee</Text>
                    <Text className="text-sm font-bold text-ink">
                      ₦{selectedOrder.delivery_fee.toLocaleString()}
                    </Text>
                  </View>
                  <View className="border-t border-[#E7E0D2] pt-2.5 mt-1">
                    <View className="flex-row justify-between">
                      <Text className="font-bold text-ink">Total</Text>
                      <Text className="font-bold text-[#1B1B8F]">
                        ₦{selectedOrder.total_amount.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]">
                <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-2">Timeline</Text>
                <Text className="text-sm text-ink/55">
                  Created: {new Date(selectedOrder.created_at).toLocaleString()}
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}
