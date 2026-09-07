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
  User,
  X,
} from "lucide-react-native";
import { AppButton } from "../../src/components/ui/AppButton";

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
      <View className="flex-1 items-center justify-center bg-[#FAF5EA]">
        <ActivityIndicator size="large" color="#1B1B8F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FAF5EA]">
      {/* Header */}
      <View className="px-5 pt-14 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">
            Payouts
          </Text>
          <Text className="text-[28px] font-bold text-ink mt-1">Earnings</Text>
          <Text className="text-sm text-ink/55">Payouts and history</Text>
        </View>
        <TouchableOpacity className="w-12 h-12 rounded-full bg-white border border-[#E7E0D2] items-center justify-center">
          <HelpCircle color="#0A0A0E" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Balance hero — white card */}
        <View className="px-5">
          <View className="bg-white rounded-[28px] p-6 border border-[#E7E0D2]">
            <View className="items-center">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">Total Balance</Text>
                <TouchableOpacity
                  onPress={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? (
                    <Eye color="#1B1B8F" size={16} />
                  ) : (
                    <EyeOff color="#1B1B8F" size={16} />
                  )}
                </TouchableOpacity>
              </View>
              <Text className="text-4xl font-bold text-ink mb-3">
                {showBalance
                  ? `₦${availableBalance.toFixed(2)}`
                  : "••••••"}
              </Text>
              <View className="flex-row items-center gap-1.5 px-3 py-1.5 bg-[#FAF5EA] border border-[#E7E0D2] rounded-full">
                <View className="w-2 h-2 bg-[#12805C] rounded-full" />
                <Text className="text-xs font-bold text-ink">
                  Available to withdraw
                </Text>
              </View>
            </View>

            <View className="mt-6">
              <AppButton
                title="Withdraw Funds"
                variant="ink"
                onPress={() => setDialogOpen(true)}
                disabled={availableBalance <= 0}
              />
            </View>

            {pendingWithdrawals > 0 && (
              <Text className="text-center text-sm text-ink/55 mt-3">
                +₦{pendingWithdrawals.toFixed(2)} Pending Clearance
              </Text>
            )}
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-5 mt-4 flex-row gap-3">
          <View className="flex-1 bg-white rounded-[26px] p-5 border border-[#E7E0D2]">
            <View className="flex-row items-center gap-2 mb-2">
              <TrendingUp size={15} color="#1B1B8F" />
              <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55">
                This Week
              </Text>
            </View>
            <Text className="text-xl font-bold text-[#12805C]">
              +₦{thisWeekEarnings.toFixed(2)}
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-[26px] p-5 border border-[#E7E0D2]">
            <View className="flex-row items-center gap-2 mb-2">
              <ShoppingBag size={15} color="#1B1B8F" />
              <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55">Orders</Text>
            </View>
            <Text className="text-xl font-bold text-ink">
              {thisWeekOrders}
            </Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-5 mt-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-ink">
              Recent Transactions
            </Text>
            <TouchableOpacity className="flex-row items-center gap-1 bg-white border border-[#E7E0D2] px-3 h-10 rounded-full">
              <Filter size={14} color="#1B1B8F" />
              <Text className="text-sm font-bold text-[#1B1B8F]">
                Filter
              </Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <View className="bg-white rounded-[26px] p-8 items-center border border-[#E7E0D2]">
              <Text className="text-ink/55">No transactions yet</Text>
            </View>
          ) : (
            <View className="gap-3">
              {recentTransactions.map((transaction) => (
                <View
                  key={transaction.id}
                  className="bg-white rounded-[26px] p-4 flex-row items-center gap-3 border border-[#E7E0D2]"
                >
                  <View className="w-12 h-12 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
                    {transaction.type === "withdrawal" ? (
                      <Landmark color="#1B1B8F" size={20} />
                    ) : (
                      <User color="#1B1B8F" size={20} />
                    )}
                  </View>
                  <View className="flex-1 min-w-0">
                    <Text className="font-bold text-ink text-sm" numberOfLines={1}>
                      {transaction.name}
                    </Text>
                    <Text className="text-xs text-ink/55 mt-0.5">
                      {formatDate(transaction.date)}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text
                      className="font-bold"
                      style={{ color: transaction.amount >= 0 ? "#12805C" : "#C0361F" }}
                    >
                      {transaction.amount >= 0 ? "+" : ""}₦
                      {Math.abs(transaction.amount).toFixed(2)}
                    </Text>
                    <View className="mt-1 px-2 py-0.5 rounded-full bg-[#FAF5EA] border border-[#E7E0D2]">
                      <Text className="text-[10px] font-bold text-ink">
                        {transaction.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text className="text-center text-xs text-ink/55 mt-6 px-6">
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
        <View className="flex-1 bg-[#FAF5EA]">
          <View className="flex-row items-center justify-between px-5 pt-6 pb-4">
            <Text className="text-xl font-bold text-ink">Withdraw Funds</Text>
            <TouchableOpacity
              onPress={() => setDialogOpen(false)}
              className="w-10 h-10 rounded-full bg-white border border-[#E7E0D2] items-center justify-center"
            >
              <X color="#0A0A0E" size={16} />
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-5 gap-4">
            <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-5">
              <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55">
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
                className="mt-2 w-full h-14 px-4 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] text-ink"
              />
            </View>
            <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-5">
              <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55">
                Method
              </Text>
              <View className="flex-row gap-2 mt-3">
                <TouchableOpacity
                  onPress={() =>
                    setWithdrawalForm({ ...withdrawalForm, method: "bank" })
                  }
                  className={`flex-1 h-14 rounded-full items-center justify-center border ${
                    withdrawalForm.method === "bank"
                      ? "bg-ink border-ink"
                      : "bg-white border-[#E7E0D2]"
                  }`}
                >
                  <Text
                    className={`font-bold text-sm ${
                      withdrawalForm.method === "bank"
                        ? "text-white"
                        : "text-ink"
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
                  className={`flex-1 h-14 rounded-full items-center justify-center border ${
                    withdrawalForm.method === "mobile_money"
                      ? "bg-ink border-ink"
                      : "bg-white border-[#E7E0D2]"
                  }`}
                >
                  <Text
                    className={`font-bold text-sm ${
                      withdrawalForm.method === "mobile_money"
                        ? "text-white"
                        : "text-ink"
                    }`}
                  >
                    Mobile Money
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="mt-2 mb-8">
              <AppButton title="Submit Request" variant="ink" onPress={handleWithdrawal} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
