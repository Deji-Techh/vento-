import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  Eye,
  EyeOff,
  TrendingUp,
  ShoppingBag,
  HelpCircle,
  Filter,
  Landmark,
} from "lucide-react-native";

const mockSellerInfo = {
  id: "seller-001",
  store_name: "Ada's Kitchen",
  total_earnings: 125000,
};

const mockWithdrawals = [
  {
    id: "w-001",
    amount: "10000",
    status: "approved",
    method: "bank",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "w-002",
    amount: "5000",
    status: "pending",
    method: "mobile_money",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

const mockOrders = [
  {
    id: "order-001",
    total_price: 3000,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    profiles: { name: "Chidi", avatar_url: null },
  },
  {
    id: "order-002",
    total_price: 2500,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    profiles: { name: "Amara", avatar_url: null },
  },
];

export default function SellerEarnings() {
  const { profile } = useAuth();
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: "",
    method: "bank",
  });

  useEffect(() => {
    setTimeout(() => {
      setSellerInfo(mockSellerInfo);
      setWithdrawals(mockWithdrawals);
      setOrders(mockOrders);
      setLoading(false);
    }, 800);
  }, [profile]);

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawalForm.amount);
    if (isNaN(amount) || amount <= 0 || amount > availableBalance) {
      Alert.alert("Error", "Invalid withdrawal amount");
      return;
    }

    const newWithdrawal = {
      id: `w-${Date.now()}`,
      amount: withdrawalForm.amount,
      status: "pending",
      method: withdrawalForm.method,
      created_at: new Date().toISOString(),
    };
    setWithdrawals((prev) => [newWithdrawal, ...prev]);
    Alert.alert("Success", "Withdrawal request submitted successfully!");
    setDialogOpen(false);
    setWithdrawalForm({ amount: "", method: "bank" });
  };

  const totalWithdrawn = withdrawals
    .filter((w) => w.status === "approved")
    .reduce((sum, w) => sum + parseFloat(w.amount), 0);

  const pendingWithdrawals = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + parseFloat(w.amount), 0);

  const availableBalance = (sellerInfo?.total_earnings || 0) - totalWithdrawn;

  const recentTransactions = [
    ...orders.slice(0, 5).map((order) => ({
      id: order.id,
      type: "order",
      name: `Order #${order.id.slice(0, 3)} – ${order.profiles?.name || "Customer"}`,
      date: order.created_at,
      amount: order.total_price,
      status: "COMPLETED",
    })),
    ...withdrawals.slice(0, 2).map((w) => ({
      id: w.id,
      type: "withdrawal",
      name: `Withdrawal to ${w.method === "bank" ? "Bank" : "Mobile Money"}`,
      date: w.created_at,
      amount: -parseFloat(w.amount),
      status: w.status.toUpperCase(),
    })),
  ]
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 6);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0)
      return `Today, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
    if (diffDays === 1)
      return `Yesterday, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const thisWeekEarnings = orders
    .filter((o) => new Date(o.created_at) >= weekStart)
    .reduce((sum, o) => sum + o.total_price, 0);
  const thisWeekOrders = orders.filter(
    (o) => new Date(o.created_at) >= weekStart
  ).length;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f8f6f5]">
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f8f6f5]">
      {/* Header */}
      <View className="px-4 pt-6 pb-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-gray-900">My Earnings</Text>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center">
          <HelpCircle color="#1C1B1B" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Balance Card */}
        <View className="px-4">
          <View className="bg-white rounded-3xl p-6">
            <View className="items-center">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-sm text-gray-500">Total Balance</Text>
                <TouchableOpacity
                  onPress={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? (
                    <Eye color="#9CA3AF" size={16} />
                  ) : (
                    <EyeOff color="#9CA3AF" size={16} />
                  )}
                </TouchableOpacity>
              </View>
              <Text className="text-4xl font-bold text-blue-900 mb-2">
                {showBalance
                  ? `₦${availableBalance.toFixed(2)}`
                  : "••••••"}
              </Text>
              <View className="flex-row items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
                <View className="w-2 h-2 bg-green-500 rounded-full" />
                <Text className="text-sm font-medium text-green-700">
                  Available to withdraw
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setDialogOpen(true)}
              disabled={availableBalance <= 0}
              className="w-full mt-6 h-12 bg-blue-900 rounded-2xl items-center justify-center disabled:opacity-50"
            >
              <Text className="text-white font-bold">Withdraw Funds</Text>
            </TouchableOpacity>

            {pendingWithdrawals > 0 && (
              <Text className="text-center text-sm text-gray-500 mt-3">
                +₦{pendingWithdrawals.toFixed(2)} Pending Clearance
              </Text>
            )}
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-4 mt-4 flex-row gap-3">
          <View className="flex-1 bg-white rounded-2xl p-4">
            <View className="flex-row items-center gap-2 text-gray-500 mb-2">
              <TrendingUp size={16} />
              <Text className="text-xs font-semibold uppercase">
                This Week
              </Text>
            </View>
            <Text className="text-2xl font-bold text-green-600">
              +₦{thisWeekEarnings.toFixed(2)}
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4">
            <View className="flex-row items-center gap-2 text-gray-500 mb-2">
              <ShoppingBag size={16} />
              <Text className="text-xs font-semibold uppercase">Orders</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              {thisWeekOrders}
            </Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Recent Transactions
            </Text>
            <TouchableOpacity className="flex-row items-center gap-1">
              <Filter size={16} />
              <Text className="text-sm font-semibold text-blue-900">
                Filter
              </Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center">
              <Text className="text-gray-500">No transactions yet</Text>
            </View>
          ) : (
            <View className="gap-3">
              {recentTransactions.map((transaction) => (
                <View
                  key={transaction.id}
                  className="bg-white rounded-2xl p-4 flex-row items-center gap-3"
                >
                  <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
                    {transaction.type === "withdrawal" ? (
                      <Landmark color="#EF4444" size={20} />
                    ) : (
                      <Text className="text-lg">👤</Text>
                    )}
                  </View>
                  <View className="flex-1 min-w-0">
                    <Text className="font-semibold text-gray-900 text-sm truncate">
                      {transaction.name}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {formatDate(transaction.date)}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text
                      className={`font-bold ${
                        transaction.amount >= 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.amount >= 0 ? "+" : ""}₦
                      {Math.abs(transaction.amount).toFixed(2)}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {transaction.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text className="text-center text-xs text-gray-500 mt-6">
            Earnings are updated in real-time. Payments to your bank account
            typically take 1-3 business days.
          </Text>
        </View>
      </ScrollView>

      {/* Withdraw Modal */}
      <Modal
        visible={dialogOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDialogOpen(false)}
      >
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-bold">Withdraw Funds</Text>
            <TouchableOpacity
              onPress={() => setDialogOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <Text className="text-gray-500">✕</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 p-4 gap-4">
            <View>
              <Text className="text-sm font-semibold text-gray-900">
                Amount (₦)
              </Text>
              <TextInput
                value={withdrawalForm.amount}
                onChangeText={(val) =>
                  setWithdrawalForm({ ...withdrawalForm, amount: val })
                }
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                className="mt-2 w-full h-12 px-4 rounded-xl bg-gray-100 text-gray-900"
              />
            </View>
            <View>
              <Text className="text-sm font-semibold text-gray-900">
                Method
              </Text>
              <View className="flex-row gap-3 mt-2">
                <TouchableOpacity
                  onPress={() =>
                    setWithdrawalForm({ ...withdrawalForm, method: "bank" })
                  }
                  className={`flex-1 h-12 rounded-xl items-center justify-center ${
                    withdrawalForm.method === "bank"
                      ? "bg-blue-900"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      withdrawalForm.method === "bank"
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    Bank Transfer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setWithdrawalForm({
                      ...withdrawalForm,
                      method: "mobile_money",
                    })
                  }
                  className={`flex-1 h-12 rounded-xl items-center justify-center ${
                    withdrawalForm.method === "mobile_money"
                      ? "bg-blue-900"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      withdrawalForm.method === "mobile_money"
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    Mobile Money
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleWithdrawal}
              className="w-full h-12 bg-blue-900 rounded-2xl items-center justify-center mt-auto mb-8"
            >
              <Text className="text-white font-bold">Submit Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
