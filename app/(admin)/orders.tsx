import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Package, X, Eye, ChevronRight } from "lucide-react-native";

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

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-amber-100 text-amber-700",
  ready_for_pickup: "bg-purple-100 text-purple-700",
  assigned: "bg-indigo-100 text-indigo-700",
  on_the_way: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
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
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-6 gap-6">
      <View>
        <Text className="text-2xl font-bold text-gray-900">Orders</Text>
        <Text className="text-gray-500">View and manage all platform orders</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full ${
              activeTab === tab ? "bg-blue-900" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                activeTab === tab ? "text-white" : "text-gray-900"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <View className="bg-gray-50 rounded-xl p-8 items-center border border-gray-200">
          <Package color="#9CA3AF" size={48} />
          <Text className="text-gray-500 mt-3">No orders found</Text>
        </View>
      ) : (
        <View className="gap-3">
          {filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => setSelectedOrder(order)}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="font-semibold text-gray-900">
                      #{order.id.slice(0, 8)}
                    </Text>
                    <View
                      className={`px-2 py-0.5 rounded-full ${statusColors[order.status] || statusColors.pending}`}
                    >
                      <Text className="text-xs font-semibold capitalize">
                        {statusLabels[order.status] || order.status}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm text-gray-500">
                    {order.buyer?.name} → {order.seller?.store_name}
                  </Text>
                  <Text className="text-xs text-gray-400 mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </Text>
                </View>
                <View className="items-end gap-1">
                  <Text className="font-bold text-blue-900">
                    ₦{order.total_amount.toLocaleString()}
                  </Text>
                  <ChevronRight color="#9CA3AF" size={16} />
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
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-bold">Order Details</Text>
            <TouchableOpacity
              onPress={() => setSelectedOrder(null)}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <X color="#6B7280" size={16} />
            </TouchableOpacity>
          </View>

          {selectedOrder && (
            <ScrollView className="flex-1 p-4 gap-4">
              <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <View className="flex-row items-center gap-2 mb-3">
                  <Text className="text-lg font-bold">
                    #{selectedOrder.id.slice(0, 8)}
                  </Text>
                  <View
                    className={`px-2 py-0.5 rounded-full ${statusColors[selectedOrder.status] || statusColors.pending}`}
                  >
                    <Text className="text-xs font-semibold capitalize">
                      {statusLabels[selectedOrder.status] || selectedOrder.status}
                    </Text>
                  </View>
                </View>

                <View className="gap-2">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-500">Buyer</Text>
                    <Text className="text-sm font-medium">
                      {selectedOrder.buyer?.name}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-500">Seller</Text>
                    <Text className="text-sm font-medium">
                      {selectedOrder.seller?.store_name}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-500">Delivery Address</Text>
                    <Text className="text-sm font-medium">
                      {selectedOrder.delivery_address}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-500">Payment</Text>
                    <Text className="text-sm font-medium capitalize">
                      {selectedOrder.payment_method.replace("_", " ")}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-500">Delivery Fee</Text>
                    <Text className="text-sm font-medium">
                      ₦{selectedOrder.delivery_fee.toLocaleString()}
                    </Text>
                  </View>
                  <View className="border-t border-gray-200 pt-2 mt-2">
                    <View className="flex-row justify-between">
                      <Text className="font-bold">Total</Text>
                      <Text className="font-bold text-blue-900">
                        ₦{selectedOrder.total_amount.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <Text className="font-semibold text-gray-900 mb-2">Timeline</Text>
                <Text className="text-sm text-gray-500">
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
