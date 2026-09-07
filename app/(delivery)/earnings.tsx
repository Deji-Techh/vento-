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
  X,
} from "lucide-react-native";
import { AppButton } from "../../src/components/ui/AppButton";

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

const statusChip: Record<string, string> = {
  pending: "bg-[#FFF3D6]",
  approved: "bg-[#E8EDFF]",
  completed: "bg-[#E3F2E8]",
  rejected: "bg-[#FDE8E4]",
};

const statusText: Record<string, string> = {
  pending: "#8A5A00",
  approved: "#1B1B8F",
  completed: "#12805C",
  rejected: "#C0361F",
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
      <View className="flex-1 items-center justify-center bg-[#FAF5EA]">
        <ActivityIndicator size="large" color="#1B1B8F" />
      </View>
    );
  }

  const pendingTotal = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = (agent?.total_earnings || 0) - pendingTotal;

  return (
    <ScrollView className="flex-1 bg-[#FAF5EA] px-5 pt-14" contentContainerStyle={{ paddingBottom: 120, gap: 16 }}>
      <View>
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">
          Payouts
        </Text>
        <Text className="text-[28px] font-bold text-ink mt-1">Earnings</Text>
        <Text className="text-sm text-ink/55">
          Track your delivery earnings and withdrawals
        </Text>
      </View>

      {/* Balance hero — white card */}
      <View className="bg-white rounded-[28px] p-6 border border-[#E7E0D2]">
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">Available Balance</Text>
        <Text className="text-4xl font-bold text-ink mt-2">
          ₦{availableBalance.toLocaleString()}
        </Text>
        <View className="flex-row items-center mt-4 gap-2">
          <View className="px-3 py-1.5 rounded-full bg-[#FAF5EA] border border-[#E7E0D2]">
            <Text className="text-xs font-bold text-ink">
              ₦{(agent?.total_earnings || 0).toLocaleString()} total
            </Text>
          </View>
          <View className="px-3 py-1.5 rounded-full bg-[#EDEDF7]">
            <Text className="text-xs font-bold text-[#1B1B8F]">
              {agent?.completed_deliveries || 0} trips
            </Text>
          </View>
        </View>
        <View className="mt-5">
          <AppButton
            title="Request Withdrawal"
            variant="ink"
            onPress={() => setDialogOpen(true)}
            disabled={availableBalance <= 0}
          />
        </View>
      </View>

      {/* Stats white cards */}
      <View className="flex-row gap-3">
        <View className="flex-1 bg-white rounded-[26px] p-4 border border-[#E7E0D2]">
          <View className="w-10 h-10 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-2">
            <Wallet color="#1B1B8F" size={18} />
          </View>
          <Text className="text-xs text-ink/55">Total</Text>
          <Text className="text-lg font-bold text-ink mt-0.5">
            ₦{(agent?.total_earnings || 0).toLocaleString()}
          </Text>
        </View>
        <View className="flex-1 bg-white rounded-[26px] p-4 border border-[#E7E0D2]">
          <View className="w-10 h-10 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-2">
            <TrendingUp color="#12805C" size={18} />
          </View>
          <Text className="text-xs text-ink/55">Available</Text>
          <Text className="text-lg font-bold text-ink mt-0.5">
            ₦{availableBalance.toLocaleString()}
          </Text>
        </View>
        <View className="flex-1 bg-white rounded-[26px] p-4 border border-[#E7E0D2]">
          <View className="w-10 h-10 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-2">
            <Package color="#1B1B8F" size={18} />
          </View>
          <Text className="text-xs text-ink/55">Trips</Text>
          <Text className="text-lg font-bold text-ink mt-0.5">
            {agent?.completed_deliveries || 0}
          </Text>
        </View>
      </View>

      {/* Withdrawal History */}
      <View>
        <Text className="text-lg font-bold text-ink mb-3">
          Withdrawal History
        </Text>
        {withdrawals.length === 0 ? (
          <View className="bg-white rounded-[26px] p-8 items-center border border-[#E7E0D2]">
            <Wallet color="#6E6A75" size={22} />
            <Text className="text-ink/55 mt-3 font-semibold">No withdrawals yet</Text>
          </View>
        ) : (
          <View className="gap-3">
            {withdrawals.map((withdrawal) => (
              <View
                key={withdrawal.id}
                className="bg-white rounded-[26px] p-4 flex-row items-center justify-between border border-[#E7E0D2]"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
                    <ArrowDownRight color="#1B1B8F" size={18} />
                  </View>
                  <View>
                    <Text className="font-bold text-ink">
                      ₦{withdrawal.amount.toLocaleString()}
                    </Text>
                    <Text className="text-xs text-ink/55 mt-0.5">
                      {new Date(withdrawal.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <View className="items-end gap-1">
                  <View
                    className={`px-2.5 py-1 rounded-full ${statusChip[withdrawal.status] || statusChip.pending}`}
                  >
                    <Text
                      className="text-[11px] font-bold capitalize"
                      style={{ color: statusText[withdrawal.status] || statusText.pending }}
                    >
                      {withdrawal.status}
                    </Text>
                  </View>
                  <Text className="text-[11px] text-ink/55 capitalize">
                    {withdrawal.method.replaceAll("_", " ")}
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
        <View className="flex-1 bg-[#FAF5EA]">
          <View className="flex-row items-center justify-between px-5 pt-6 pb-4">
            <Text className="text-xl font-bold text-ink">Request Withdrawal</Text>
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
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                placeholder="Enter amount"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                className="mt-2 w-full h-14 px-4 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] text-ink"
              />
              <Text className="text-xs text-ink/55 mt-2">
                Available: ₦{availableBalance.toLocaleString()}
              </Text>
            </View>

            <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-5">
              <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55">
                Withdrawal Method
              </Text>
              <View className="flex-row gap-2 mt-3">
                <TouchableOpacity
                  onPress={() => setWithdrawMethod("bank_transfer")}
                  className={`flex-1 h-14 rounded-full items-center justify-center border ${
                    withdrawMethod === "bank_transfer"
                      ? "bg-ink border-ink"
                      : "bg-white border-[#E7E0D2]"
                  }`}
                >
                  <Text
                    className={`font-bold text-sm ${
                      withdrawMethod === "bank_transfer"
                        ? "text-white"
                        : "text-ink"
                    }`}
                  >
                    Bank Transfer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setWithdrawMethod("mobile_money")}
                  className={`flex-1 h-14 rounded-full items-center justify-center border ${
                    withdrawMethod === "mobile_money"
                      ? "bg-ink border-ink"
                      : "bg-white border-[#E7E0D2]"
                  }`}
                >
                  <Text
                    className={`font-bold text-sm ${
                      withdrawMethod === "mobile_money"
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
              <AppButton title={submitting ? "Processing..." : "Confirm Withdrawal"} variant="ink" onPress={handleWithdrawal} disabled={submitting} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
