import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import {
  Wallet01Icon,
  ChartLineIcon,
  Package01Icon,
  BanknoteIcon,
  CreditCardIcon,
} from "../../src/components/icons";

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

type ChipTone = "neutral" | "success" | "warning" | "info" | "danger";

const withdrawalTone = (status: string): ChipTone => {
  switch (status) {
    case "completed":
      return "success";
    case "approved":
      return "info";
    case "pending":
      return "warning";
    case "rejected":
      return "danger";
    default:
      return "neutral";
  }
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
      toast.error("Enter a valid withdrawal amount");
      return;
    }

    const pendingTotal = withdrawals
      .filter((w) => w.status === "pending")
      .reduce((sum, w) => sum + w.amount, 0);
    const available = (agent?.total_earnings || 0) - pendingTotal;

    if (amount > available) {
      toast.error(`Your available balance is ₦${available.toLocaleString()}`);
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
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
      toast.success(`₦${amount.toLocaleString()} withdrawal is being processed`);
      setDialogOpen(false);
      setWithdrawAmount("");
      setSubmitting(false);
    }, 1000);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-cream">
        <ActivityIndicator size="large" color="#0A0A0E" />
      </View>
    );
  }

  const pendingTotal = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = (agent?.total_earnings || 0) - pendingTotal;

  return (
    <ScrollView className="flex-1 bg-cream px-5 pt-14" contentContainerStyle={{ paddingBottom: 120, gap: 16 }} showsVerticalScrollIndicator={false}>
      <View>
        <Eyebrow>Payouts</Eyebrow>
        <Text className="text-[28px] font-inter-bold text-ink tracking-tight mt-1">Earnings</Text>
        <Text className="text-[13px] font-inter text-ink/55">
          Track your delivery earnings and withdrawals
        </Text>
      </View>

      {/* Balance hero */}
      <View className="bg-white rounded-[28px] p-6 border border-border">
        <Text className="text-[11px] font-inter-bold uppercase tracking-[2px] text-ink/55">
          Available balance
        </Text>
        <Text className="text-[36px] font-inter-bold text-ink tracking-tight mt-2">
          ₦{availableBalance.toLocaleString()}
        </Text>
        <View className="flex-row items-center mt-4 gap-2">
          <View className="px-3 py-1.5 rounded-full bg-ink/5">
            <Text className="text-[12px] font-inter-bold text-ink">
              ₦{(agent?.total_earnings || 0).toLocaleString()} total
            </Text>
          </View>
          <View className="px-3 py-1.5 rounded-full bg-ink/5">
            <Text className="text-[12px] font-inter-bold text-ink">
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

      {/* Stats cards */}
      <View className="flex-row gap-3">
        <View className="flex-1 bg-white rounded-[24px] p-4 border border-border">
          <View className="w-10 h-10 rounded-full bg-cream border border-border items-center justify-center mb-2">
            <Icon icon={Wallet01Icon} size={18} color="#0A0A0E" />
          </View>
          <Text className="text-[12px] font-inter text-ink/55">Total</Text>
          <Text className="text-[18px] font-inter-bold text-ink mt-0.5">
            ₦{(agent?.total_earnings || 0).toLocaleString()}
          </Text>
        </View>
        <View className="flex-1 bg-white rounded-[24px] p-4 border border-border">
          <View className="w-10 h-10 rounded-full bg-cream border border-border items-center justify-center mb-2">
            <Icon icon={ChartLineIcon} size={18} color="#12805C" />
          </View>
          <Text className="text-[12px] font-inter text-ink/55">Available</Text>
          <Text className="text-[18px] font-inter-bold text-ink mt-0.5">
            ₦{availableBalance.toLocaleString()}
          </Text>
        </View>
        <View className="flex-1 bg-white rounded-[24px] p-4 border border-border">
          <View className="w-10 h-10 rounded-full bg-cream border border-border items-center justify-center mb-2">
            <Icon icon={Package01Icon} size={18} color="#0A0A0E" />
          </View>
          <Text className="text-[12px] font-inter text-ink/55">Trips</Text>
          <Text className="text-[18px] font-inter-bold text-ink mt-0.5">
            {agent?.completed_deliveries || 0}
          </Text>
        </View>
      </View>

      {/* Withdrawal history */}
      <View>
        <Text className="text-[18px] font-inter-bold text-ink tracking-tight mb-3">
          Withdrawal history
        </Text>
        {withdrawals.length === 0 ? (
          <View className="bg-white rounded-[24px] p-8 items-center border border-border">
            <View className="w-12 h-12 rounded-full bg-cream border border-border items-center justify-center">
              <Icon icon={Wallet01Icon} size={20} color="rgba(10,10,14,0.4)" />
            </View>
            <Text className="text-ink/55 mt-3 font-inter-semibold">No withdrawals yet</Text>
          </View>
        ) : (
          <View className="gap-3">
            {withdrawals.map((withdrawal) => (
              <View
                key={withdrawal.id}
                className="bg-white rounded-[24px] p-4 flex-row items-center justify-between border border-border"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-11 h-11 rounded-full bg-cream border border-border items-center justify-center">
                    <Icon icon={BanknoteIcon} size={18} color="#0A0A0E" />
                  </View>
                  <View>
                    <Text className="font-inter-bold text-ink">
                      ₦{withdrawal.amount.toLocaleString()}
                    </Text>
                    <Text className="text-[12px] font-inter text-ink/55 mt-0.5">
                      {new Date(withdrawal.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <View className="items-end gap-1">
                  <StatusChip label={withdrawal.status} tone={withdrawalTone(withdrawal.status)} />
                  <Text className="text-[11px] font-inter text-ink/55 capitalize">
                    {withdrawal.method.replaceAll("_", " ")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Withdraw modal */}
      <Modal
        visible={dialogOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDialogOpen(false)}
      >
        <View className="flex-1 bg-cream">
          <View className="flex-row items-center justify-between px-5 pt-6 pb-4">
            <Text className="text-[20px] font-inter-bold text-ink tracking-tight">Request withdrawal</Text>
            <TouchableOpacity
              onPress={() => setDialogOpen(false)}
              activeOpacity={0.85}
              className="w-10 h-10 rounded-full bg-white border border-border items-center justify-center"
            >
              <Text className="text-ink font-inter-bold">✕</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-5 gap-4">
            <View className="bg-white rounded-[24px] border border-border p-5">
              <TextField
                label="Amount (₦)"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                placeholder="Enter amount"
                keyboardType="numeric"
                dark={false}
              />
              <Text className="text-[12px] font-inter text-ink/55 mt-2">
                Available: ₦{availableBalance.toLocaleString()}
              </Text>
            </View>

            <View className="bg-white rounded-[24px] border border-border p-5">
              <Text className="text-[11px] font-inter-bold uppercase tracking-[2px] text-ink/55">
                Withdrawal method
              </Text>
              <View className="flex-row gap-2 mt-3">
                <TouchableOpacity
                  onPress={() => setWithdrawMethod("bank_transfer")}
                  activeOpacity={0.85}
                  className={`flex-1 h-14 rounded-full items-center justify-center flex-row gap-1.5 border ${
                    withdrawMethod === "bank_transfer"
                      ? "bg-ink border-ink"
                      : "bg-white border-border"
                  }`}
                >
                  <Icon
                    icon={CreditCardIcon}
                    size={16}
                    color={withdrawMethod === "bank_transfer" ? "#fff" : "#0A0A0E"}
                  />
                  <Text
                    className={`font-inter-bold text-[13px] ${
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
                  activeOpacity={0.85}
                  className={`flex-1 h-14 rounded-full items-center justify-center flex-row gap-1.5 border ${
                    withdrawMethod === "mobile_money"
                      ? "bg-ink border-ink"
                      : "bg-white border-border"
                  }`}
                >
                  <Icon
                    icon={Wallet01Icon}
                    size={16}
                    color={withdrawMethod === "mobile_money" ? "#fff" : "#0A0A0E"}
                  />
                  <Text
                    className={`font-inter-bold text-[13px] ${
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
              <AppButton
                title="Confirm Withdrawal"
                variant="ink"
                onPress={handleWithdrawal}
                loading={submitting}
                disabled={submitting}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
