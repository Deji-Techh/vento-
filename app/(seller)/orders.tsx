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
import { AppButton } from "../../src/components/ui/AppButton";

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

const statusChip: Record<string, string> = {
  pending: "bg-[#EDEDF7]",
  accepted: "bg-[#E8EDFF]",
  preparing: "bg-[#FFF3D6]",
  completed: "bg-[#E3F2E8]",
  cancelled: "bg-[#FDE8E4]",
};

const statusText: Record<string, string> = {
  pending: "#1B1B8F",
  accepted: "#1B1B8F",
  preparing: "#8A5A00",
  completed: "#12805C",
  cancelled: "#C0361F",
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
      <View className="flex-1 items-center justify-center bg-[#FAF5EA]">
        <ActivityIndicator size="large" color="#1B1B8F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FAF5EA]">
      <View className="px-5 pt-14 pb-4">
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">
          Incoming
        </Text>
        <Text className="text-[28px] font-bold text-ink mt-1">Orders</Text>
        <Text className="text-sm text-ink/55 mt-1">Manage incoming orders</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 120 }}>
        {orders.length === 0 ? (
          <View className="bg-white rounded-[26px] p-8 items-center border border-[#E7E0D2]">
            <Text className="text-ink/55">No orders yet.</Text>
          </View>
        ) : (
          <View className="gap-4">
            {orders.map((order) => (
              <View
                key={order.id}
                className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]"
              >
                <View className="flex-row justify-between items-start mb-4 gap-2">
                  <View className="flex-1">
                    <Text className="font-bold text-lg text-ink">
                      Order #{order.id.slice(0, 8)}
                    </Text>
                    <Text className="text-sm text-ink/55 mt-0.5">
                      {order.profiles.name}
                    </Text>
                    <Text className="text-xs text-ink/55 mt-0.5">
                      {new Date(order.created_at).toLocaleString()}
                    </Text>
                  </View>
                  <View
                    className={`px-3 py-1.5 rounded-full ${statusChip[order.status] || statusChip.pending}`}
                  >
                    <Text
                      className="text-[11px] font-bold uppercase tracking-[0.5px]"
                      style={{ color: statusText[order.status] || statusText.pending }}
                    >
                      {order.status}
                    </Text>
                  </View>
                </View>

                <View className="mb-4 bg-[#FAF5EA] border border-[#E7E0D2] rounded-2xl p-4">
                  <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55 mb-1">Items</Text>
                  <Text className="text-sm text-ink">
                    {order.items
                      .map((item: any) => `${item.name} (x${item.quantity})`)
                      .join(", ")}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center pt-4 border-t border-[#E7E0D2]">
                  <Text className="font-bold text-ink text-lg">
                    ₦{order.total_price.toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedOrder(order);
                      setDialogOpen(true);
                    }}
                    className="flex-row items-center gap-1.5 bg-white border border-[#E7E0D2] px-4 h-11 rounded-full"
                  >
                    <Eye size={16} color="#1B1B8F" />
                    <Text className="text-sm font-bold text-ink">View Details</Text>
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
        <View className="flex-1 bg-[#FAF5EA]">
          <View className="flex-row items-center justify-between px-5 pt-6 pb-4">
            <Text className="text-xl font-bold text-ink">Order Details</Text>
            <TouchableOpacity
              onPress={() => setDialogOpen(false)}
              className="w-10 h-10 rounded-full bg-white border border-[#E7E0D2] items-center justify-center"
            >
              <X color="#0A0A0E" size={16} />
            </TouchableOpacity>
          </View>

          {selectedOrder && (
            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
              <View className="gap-4">
                {/* Order Info */}
                <View className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]">
                  <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-3">Order Information</Text>
                  <View className="gap-2">
                    <Text className="text-sm text-ink">
                      <Text className="font-bold">Order ID: </Text>
                      {selectedOrder.id}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm font-bold text-ink">Status: </Text>
                      <View
                        className={`px-2.5 py-1 rounded-full ${statusChip[selectedOrder.status]}`}
                      >
                        <Text
                          className="text-[11px] font-bold uppercase"
                          style={{ color: statusText[selectedOrder.status] }}
                        >
                          {selectedOrder.status}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-ink">
                      <Text className="font-bold">Date: </Text>
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Buyer Info */}
                <View className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]">
                  <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-3">
                    Buyer Information
                  </Text>
                  <View className="gap-1">
                    <Text className="text-sm text-ink">
                      <Text className="font-bold">Name: </Text>
                      {selectedOrder.profiles.name}
                    </Text>
                    {selectedOrder.profiles.phone && (
                      <Text className="text-sm text-ink">
                        <Text className="font-bold">Phone: </Text>
                        {selectedOrder.profiles.phone}
                      </Text>
                    )}
                    <Text className="text-sm text-ink">
                      <Text className="font-bold">Delivery Address: </Text>
                      {selectedOrder.delivery_address}
                    </Text>
                  </View>
                </View>

                {/* Order Items */}
                <View className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]">
                  <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-3">Order Items</Text>
                  <View className="gap-2">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <View
                        key={idx}
                        className="flex-row justify-between items-center p-4 bg-[#FAF5EA] border border-[#E7E0D2] rounded-2xl"
                      >
                        <View>
                          <Text className="font-bold text-ink">{item.name}</Text>
                          <Text className="text-sm text-ink/55">
                            Quantity: {item.quantity}
                          </Text>
                        </View>
                        <Text className="font-bold text-ink">
                          ₦{(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Payment Info */}
                <View className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]">
                  <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-2">
                    Payment Information
                  </Text>
                  <Text className="text-sm text-ink">
                    <Text className="font-bold">Total Amount: </Text>
                    ₦{selectedOrder.total_price.toFixed(2)}
                  </Text>
                </View>

                {/* Notes */}
                {selectedOrder.notes && (
                  <View className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]">
                    <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-2">Order Notes</Text>
                    <Text className="text-sm text-ink/55 bg-[#FAF5EA] border border-[#E7E0D2] p-4 rounded-2xl">
                      {selectedOrder.notes}
                    </Text>
                  </View>
                )}

                {/* Action Buttons */}
                {selectedOrder.status !== "completed" &&
                  selectedOrder.status !== "cancelled" && (
                    <View className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]">
                      <Text className="font-bold text-ink mb-4">
                        Update Order Status
                      </Text>
                      <View className="gap-3">
                        {selectedOrder.status === "pending" && (
                          <>
                            <AppButton
                              title="Accept Order"
                              variant="ink"
                              onPress={() =>
                                updateOrderStatus(selectedOrder.id, "accepted")
                              }
                            />
                            <TouchableOpacity
                              onPress={() =>
                                updateOrderStatus(selectedOrder.id, "cancelled")
                              }
                              className="w-full h-14 rounded-full items-center justify-center flex-row gap-1.5 bg-white border border-[#E7E0D2]"
                            >
                              <X color="#C0361F" size={16} />
                              <Text className="text-ink font-bold">Decline Order</Text>
                            </TouchableOpacity>
                          </>
                        )}
                        {selectedOrder.status === "accepted" && (
                          <AppButton
                            title="Mark as Preparing"
                            variant="ink"
                            onPress={() =>
                              updateOrderStatus(selectedOrder.id, "preparing")
                            }
                          />
                        )}
                        {selectedOrder.status === "preparing" && (
                          <AppButton
                            title="Mark as Completed"
                            variant="ink"
                            onPress={() =>
                              updateOrderStatus(selectedOrder.id, "completed")
                            }
                          />
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
