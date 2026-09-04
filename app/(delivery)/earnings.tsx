import { useState, useEffect } from "react";
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
import {
  Wallet,
  TrendingUp,
  Package,
  ArrowDownRight,
} from "lucide-react-native";

const mockAgent = {
  id: "agent-001",
  total_earnings: 45000,
  completed_deliveries: 23,
  is_active: true,
  is_online: true,
};

const mockWithdrawals = [
  {
    id: "w-001",
    amount: 5000,
    status: "completed",
    method: "bank_transfer",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "w-002",
    amount: 3000,
    status: "pending",
    method: "mobile_money",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function DeliveryEarnings() {
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank_transfer");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAgent(mockAgent);
      setWithdrawals(mockWithdrawals);
      setLoading(false);
    }, 800);
  }, []);

  const handleWithdrawal = () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid withdrawal amount");
      return;
    }

    const pendingTotal = withdrawals
      .filter((w) => w.status === "pending")
      .reduce((sum, w) => sum + w.amount, 0);
    const available = (agent?.total_earnings || 0) - pendingTotal;

    if (amount > available) {
      Alert.alert(
        "Insufficient balance",
        `Your available balance is ₦${available.toLocaleString()}`
      );
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newWithdrawal = {
        id: `w-${Date.now()}`,
        amount,
        status: "pending",
        method: withdrawMethod,
        created_at: new Date().toISOString(),
      };
      setWithdrawals((prev) => [newWithdrawal, ...prev]);
      Alert.alert(
        "Withdrawal requested",
        `₦${amount.toLocaleString()} withdrawal is being processed`
      );
      setDialogOpen(false);
      setWithdrawAmount("");
      setSubmitting(false);
    }, 1000);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  const pendingTotal = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = (agent?.total_earnings || 0) - pendingTotal;

  return (
    <ScrollView className="flex-1 bg-white p-6 gap-6" contentContainerStyle={{ paddingBottom: 100 }}>
      <View>
        <Text className="text-2xl font-bold text-gray-900">Earnings</Text>
        <Text className="text-gray-500">
          Track your delivery earnings and withdrawals
        </Text>
      </View>

      {/* Stats Cards */}
      <View className="flex-row flex-wrap gap-3">
        <View className="bg-white rounded-xl p-4 border border-gray-200 flex-1 min-w-[45%]">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center">
              <Wallet color="#000080" size={24} />
            </View>
            <View>
              <Text className="text-sm text-gray-500">Total Earnings</Text>
              <Text className="text-2xl font-bold text-gray-900">
                ₦{(agent?.total_earnings || 0).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 border border-gray-200 flex-1 min-w-[45%]">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-green-50 items-center justify-center">
              <TrendingUp color="#16A34A" size={24} />
            </View>
            <View>
              <Text className="text-sm text-gray-500">Available Balance</Text>
              <Text className="text-2xl font-bold text-gray-900">
                ₦{availableBalance.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 border border-gray-200 flex-1 min-w-[45%]">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center">
              <Package color="#3B82F6" size={24} />
            </View>
            <View>
              <Text className="text-sm text-gray-500">
                Deliveries Completed
              </Text>
              <Text className="text-2xl font-bold text-gray-900">
                {agent?.completed_deliveries || 0}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Withdraw Button */}
      <TouchableOpacity
        onPress={() => setDialogOpen(true)}
        disabled={availableBalance <= 0}
        className="bg-blue-900 h-12 rounded-xl items-center justify-center flex-row gap-2 disabled:opacity-50"
      >
        <ArrowDownRight color="#FFFFFF" size={16} />
        <Text className="text-white font-semibold">Request Withdrawal</Text>
      </TouchableOpacity>

      {/* Withdrawal History */}
      <View>
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Withdrawal History
        </Text>
        {withdrawals.length === 0 ? (
          <View className="bg-white rounded-xl p-8 items-center border border-gray-200">
            <Wallet color="#9CA3AF" size={48} />
            <Text className="text-gray-500 mt-3">No withdrawals yet</Text>
          </View>
        ) : (
          <View className="gap-3">
            {withdrawals.map((withdrawal) => (
              <View
                key={withdrawal.id}
                className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between"
              >
                <View>
                  <Text className="font-medium">
                    ₦{withdrawal.amount.toLocaleString()}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {new Date(withdrawal.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View className="items-end">
                  <View
                    className={`px-2 py-0.5 rounded-full ${statusColors[withdrawal.status] || statusColors.pending}`}
                  >
                    <Text className="text-xs font-semibold capitalize">
                      {withdrawal.status}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1 capitalize">
                    {withdrawal.method.replace("_", " ")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Withdraw Modal */}
      <Modal
        visible={dialogOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDialogOpen(false)}
      >
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-bold">Request Withdrawal</Text>
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
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                placeholder="Enter amount"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                className="mt-2 w-full h-12 px-4 rounded-xl bg-gray-100 text-gray-900"
              />
              <Text className="text-xs text-gray-500 mt-1">
                Available: ₦{availableBalance.toLocaleString()}
              </Text>
            </View>

            <View>
              <Text className="text-sm font-semibold text-gray-900">
                Withdrawal Method
              </Text>
              <View className="flex-row gap-3 mt-2">
                <TouchableOpacity
                  onPress={() => setWithdrawMethod("bank_transfer")}
                  className={`flex-1 h-12 rounded-xl items-center justify-center ${
                    withdrawMethod === "bank_transfer"
                      ? "bg-blue-900"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      withdrawMethod === "bank_transfer"
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    Bank Transfer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setWithdrawMethod("mobile_money")}
                  className={`flex-1 h-12 rounded-xl items-center justify-center ${
                    withdrawMethod === "mobile_money"
                      ? "bg-blue-900"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      withdrawMethod === "mobile_money"
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
              disabled={submitting}
              className="w-full h-12 bg-blue-900 rounded-xl items-center justify-center mt-auto mb-8"
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white font-semibold">
                  Confirm Withdrawal
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
