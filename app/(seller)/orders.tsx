import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { Eye, Check, X, Clock, CheckCircle } from "lucide-react-native";

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

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  accepted: "bg-blue-100 text-blue-700",
  preparing: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function SellerOrders() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 800);
  }, [profile]);

  const updateOrderStatus = (
    orderId: string,
    newStatus: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    Alert.alert("Success", `Order ${newStatus}!`);
    setDialogOpen(false);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 py-8">
        <Text className="text-3xl font-bold mb-8">Orders Management</Text>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {orders.length === 0 ? (
          <View className="p-8 items-center">
            <Text className="text-gray-500">No orders yet.</Text>
          </View>
        ) : (
          <View className="gap-4">
            {orders.map((order) => (
              <View
                key={order.id}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <View className="flex-row justify-between items-start mb-4">
                  <View>
                    <Text className="font-semibold text-lg">
                      Order #{order.id.slice(0, 8)}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {order.profiles.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${statusColors[order.status] || statusColors.pending}`}
                  >
                    <Text className="text-xs font-semibold capitalize">
                      {order.status}
                    </Text>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium mb-1">Items:</Text>
                  <Text className="text-sm text-gray-500">
                    {order.items
                      .map((item: any) => `${item.name} (x${item.quantity})`)
                      .join(", ")}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center pt-4 border-t border-gray-200">
                  <Text className="font-semibold">
                    Total: ₦{order.total_price.toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedOrder(order);
                      setDialogOpen(true);
                    }}
                    className="flex-row items-center gap-1 border border-gray-300 px-3 py-1.5 rounded-lg"
                  >
                    <Eye size={16} />
                    <Text className="text-sm font-medium">View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Order Details Modal */}
      <Modal
        visible={dialogOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDialogOpen(false)}
      >
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-bold">Order Details</Text>
            <TouchableOpacity
              onPress={() => setDialogOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <X color="#1C1B1B" size={16} />
            </TouchableOpacity>
          </View>

          {selectedOrder && (
            <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 40 }}>
              <View className="gap-6">
                {/* Order Info */}
                <View>
                  <Text className="font-semibold mb-2">Order Information</Text>
                  <View className="gap-1">
                    <Text className="text-sm">
                      <Text className="font-medium">Order ID: </Text>
                      {selectedOrder.id}
                    </Text>
                    <Text className="text-sm">
                      <Text className="font-medium">Status: </Text>
                      <View
                        className={`px-2 py-0.5 rounded-full ${statusColors[selectedOrder.status]}`}
                      >
                        <Text className="text-xs font-semibold capitalize">
                          {selectedOrder.status}
                        </Text>
                      </View>
                    </Text>
                    <Text className="text-sm">
                      <Text className="font-medium">Date: </Text>
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Buyer Info */}
                <View>
                  <Text className="font-semibold mb-2">
                    Buyer Information
                  </Text>
                  <View className="gap-1">
                    <Text className="text-sm">
                      <Text className="font-medium">Name: </Text>
                      {selectedOrder.profiles.name}
                    </Text>
                    {selectedOrder.profiles.phone && (
                      <Text className="text-sm">
                        <Text className="font-medium">Phone: </Text>
                        {selectedOrder.profiles.phone}
                      </Text>
                    )}
                    <Text className="text-sm">
                      <Text className="font-medium">Delivery Address: </Text>
                      {selectedOrder.delivery_address}
                    </Text>
                  </View>
                </View>

                {/* Order Items */}
                <View>
                  <Text className="font-semibold mb-2">Order Items</Text>
                  <View className="gap-2">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <View
                        key={idx}
                        className="flex-row justify-between items-center p-3 bg-gray-100 rounded-lg"
                      >
                        <View>
                          <Text className="font-medium">{item.name}</Text>
                          <Text className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </Text>
                        </View>
                        <Text className="font-medium">
                          ₦{(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Payment Info */}
                <View>
                  <Text className="font-semibold mb-2">
                    Payment Information
                  </Text>
                  <Text className="text-sm">
                    <Text className="font-medium">Total Amount: </Text>
                    ₦{selectedOrder.total_price.toFixed(2)}
                  </Text>
                </View>

                {/* Notes */}
                {selectedOrder.notes && (
                  <View>
                    <Text className="font-semibold mb-2">Order Notes</Text>
                    <Text className="text-sm text-gray-500 bg-gray-100 p-3 rounded-lg">
                      {selectedOrder.notes}
                    </Text>
                  </View>
                )}

                {/* Action Buttons */}
                {selectedOrder.status !== "completed" &&
                  selectedOrder.status !== "cancelled" && (
                    <View>
                      <Text className="font-semibold mb-3">
                        Update Order Status
                      </Text>
                      <View className="flex-row gap-3">
                        {selectedOrder.status === "pending" && (
                          <>
                            <TouchableOpacity
                              onPress={() =>
                                updateOrderStatus(selectedOrder.id, "accepted")
                              }
                              className="flex-1 bg-blue-900 h-12 rounded-lg items-center justify-center flex-row gap-1"
                            >
                              <Check color="#FFFFFF" size={16} />
                              <Text className="text-white font-semibold">
                                Accept Order
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                updateOrderStatus(selectedOrder.id, "cancelled")
                              }
                              className="flex-1 bg-red-500 h-12 rounded-lg items-center justify-center flex-row gap-1"
                            >
                              <X color="#FFFFFF" size={16} />
                              <Text className="text-white font-semibold">
                                Decline Order
                              </Text>
                            </TouchableOpacity>
                          </>
                        )}
                        {selectedOrder.status === "accepted" && (
                          <TouchableOpacity
                            onPress={() =>
                              updateOrderStatus(selectedOrder.id, "preparing")
                            }
                            className="flex-1 bg-blue-900 h-12 rounded-lg items-center justify-center flex-row gap-1"
                          >
                            <Clock color="#FFFFFF" size={16} />
                            <Text className="text-white font-semibold">
                              Mark as Preparing
                            </Text>
                          </TouchableOpacity>
                        )}
                        {selectedOrder.status === "preparing" && (
                          <TouchableOpacity
                            onPress={() =>
                              updateOrderStatus(selectedOrder.id, "completed")
                            }
                            className="flex-1 bg-green-500 h-12 rounded-lg items-center justify-center flex-row gap-1"
                          >
                            <CheckCircle color="#FFFFFF" size={16} />
                            <Text className="text-white font-semibold">
                              Mark as Completed
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}
