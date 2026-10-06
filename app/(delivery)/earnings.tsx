import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from "react-native";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { supabase } from "../../src/lib/supabase";
import { buzz } from "../../src/lib/haptics";
import { EmptyState } from "../../src/components/ui/Cards";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import { useTheme } from "../../src/contexts/ThemeContext";
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
  const { dark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trips, setTrips] = useState(0);
  const [earned, setEarned] = useState(0);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank_transfer");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); setRefreshing(false); return; }
    try {
      const { data: ds, error } = await supabase.from("deliveries").select("delivery_fee, status").eq("agent_id", user.id).eq("status", "delivered");
      if (error) throw error;
      const list = (ds as any) || [];
      setTrips(list.length);
      setEarned(list.reduce((s: number, d: any) => s + (d.delivery_fee || 0), 0));
      const { data: wd } = await supabase.from("withdrawals").select("*").eq("requester_id", user.id).order("created_at", { ascending: false }).limit(20);
      setWithdrawals((wd as any) || []);
    } catch (e: any) {
      toast.error(e.message || "Couldn't load earnings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleWithdrawal = async () => {
    const amount = Math.round(Number(withdrawAmount));
    if (!amount || amount < 1000) {
      buzz("error");
      toast.error("Minimum withdrawal is ₦1,000");
      return;
    }

    const pendingTotal = withdrawals
      .filter((w) => w.status === "pending")
      .reduce((sum, w) => sum + Number(w.amount), 0);
    const paidTotal = withdrawals
      .filter((w) => w.status === "approved" || w.status === "completed")
      .reduce((sum, w) => sum + Number(w.amount), 0);
    const available = earned - pendingTotal - paidTotal;

    if (amount > available) {
      buzz("error");
      toast.error(`Your available balance is ₦${available.toLocaleString()}`);
      return;
    }
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("withdrawals").insert({ requester_id: user.id, amount, method: withdrawMethod });
      if (error) throw error;
      buzz("success");
      toast.success(`₦${amount.toLocaleString()} withdrawal is being processed`);
      setDialogOpen(false);
      setWithdrawAmount("");
      load();
    } catch (e: any) {
      buzz("error");
      toast.error(e.message || "Couldn't submit request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${dark ? "bg-ink" : "bg-cream"}`}>
        <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
      </View>
    );
  }

  const pendingTotal = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + Number(w.amount), 0);
  const paidTotal = withdrawals
    .filter((w) => w.status === "approved" || w.status === "completed")
    .reduce((sum, w) => sum + Number(w.amount), 0);
  const availableBalance = earned - pendingTotal - paidTotal;

  return (
    <ScrollView className={`flex-1 px-5 pt-14 ${dark ? "bg-ink" : "bg-cream"}`} contentContainerStyle={{ paddingBottom: 120, gap: 16 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); buzz(); load(); }} tintColor={dark ? "#fff" : "#0A0A0E"} />}>
      <View>
        <Eyebrow>Payouts</Eyebrow>
        <Text className={`text-[28px] font-inter-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>Earnings</Text>
        <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
          Track your delivery earnings and withdrawals
        </Text>
      </View>

      {/* Balance hero */}
      <View className={`rounded-[28px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
        <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/55" : "text-ink/55"}`}>
          Available balance
        </Text>
        <Text className={`text-[36px] font-inter-bold tracking-tight mt-2 ${dark ? "text-white" : "text-ink"}`}>
          ₦{availableBalance.toLocaleString()}
        </Text>
        <View className="flex-row items-center mt-4 gap-2">
          <View className={`px-3 py-1.5 rounded-full ${dark ? "bg-white/10" : "bg-ink/5"}`}>
            <Text className={`text-[12px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
              ₦{earned.toLocaleString()} total
            </Text>
          </View>
          <View className={`px-3 py-1.5 rounded-full ${dark ? "bg-white/10" : "bg-ink/5"}`}>
            <Text className={`text-[12px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
              {trips} trips
            </Text>
          </View>
        </View>
        <View className="mt-5">
          <AppButton
            title="Request Withdrawal"
            variant={dark ? "white" : "ink"}
            onPress={() => setDialogOpen(true)}
            disabled={availableBalance <= 0}
          />
        </View>
      </View>

      {/* Stats cards */}
      <View className="flex-row gap-3">
        <View className={`flex-1 rounded-[24px] p-4 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <View className={`w-10 h-10 rounded-full border items-center justify-center mb-2 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
            <Icon icon={Wallet01Icon} size={18} color={dark ? "#FFFFFF" : "#0A0A0E"} />
          </View>
          <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Total</Text>
          <Text className={`text-[18px] font-inter-bold mt-0.5 ${dark ? "text-white" : "text-ink"}`}>
            ₦{earned.toLocaleString()}
          </Text>
        </View>
        <View className={`flex-1 rounded-[24px] p-4 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <View className={`w-10 h-10 rounded-full border items-center justify-center mb-2 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
            <Icon icon={ChartLineIcon} size={18} color="#12805C" />
          </View>
          <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Available</Text>
          <Text className={`text-[18px] font-inter-bold mt-0.5 ${dark ? "text-white" : "text-ink"}`}>
            ₦{availableBalance.toLocaleString()}
          </Text>
        </View>
        <View className={`flex-1 rounded-[24px] p-4 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <View className={`w-10 h-10 rounded-full border items-center justify-center mb-2 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
            <Icon icon={Package01Icon} size={18} color={dark ? "#FFFFFF" : "#0A0A0E"} />
          </View>
          <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Trips</Text>
          <Text className={`text-[18px] font-inter-bold mt-0.5 ${dark ? "text-white" : "text-ink"}`}>
            {trips}
          </Text>
        </View>
      </View>

      {/* Withdrawal history */}
      <View>
        <Text className={`text-[18px] font-inter-bold tracking-tight mb-3 ${dark ? "text-white" : "text-ink"}`}>
          Withdrawal history
        </Text>
        {withdrawals.length === 0 ? (
          <View className={`rounded-[24px] p-8 items-center border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className={`w-12 h-12 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
              <Icon icon={Wallet01Icon} size={20} color={dark ? "rgba(255,255,255,0.4)" : "rgba(10,10,14,0.4)"} />
            </View>
            <Text className={`mt-3 font-inter-semibold ${dark ? "text-white/55" : "text-ink/55"}`}>No withdrawals yet</Text>
          </View>
        ) : (
          <View className="gap-3">
            {withdrawals.map((withdrawal) => (
              <View
                key={withdrawal.id}
                className={`rounded-[24px] p-4 flex-row items-center justify-between border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
              >
                <View className="flex-row items-center gap-3">
                  <View className={`w-11 h-11 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                    <Icon icon={BanknoteIcon} size={18} color={dark ? "#FFFFFF" : "#0A0A0E"} />
                  </View>
                  <View>
                    <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
                      ₦{withdrawal.amount.toLocaleString()}
                    </Text>
                    <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`}>
                      {new Date(withdrawal.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <View className="items-end gap-1">
                  <StatusChip label={withdrawal.status} tone={withdrawalTone(withdrawal.status)} />
                  <Text className={`text-[11px] font-inter capitalize ${dark ? "text-white/55" : "text-ink/55"}`}>
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
        <View className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`}>
          <View className="flex-row items-center justify-between px-5 pt-6 pb-4">
            <Text className={`text-[20px] font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Request withdrawal</Text>
            <TouchableOpacity
              onPress={() => setDialogOpen(false)}
              activeOpacity={0.85}
              className={`w-10 h-10 rounded-full border items-center justify-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
            >
              <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>✕</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-5 gap-4">
            <View className={`rounded-[24px] border p-5 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
              <TextField
                label="Amount (₦)"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                placeholder="Enter amount"
                keyboardType="numeric"
              />
              <Text className={`text-[12px] font-inter mt-2 ${dark ? "text-white/55" : "text-ink/55"}`}>
                Available: ₦{availableBalance.toLocaleString()}
              </Text>
            </View>

            <View className={`rounded-[24px] border p-5 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
              <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/55" : "text-ink/55"}`}>
                Withdrawal method
              </Text>
              <View className="flex-row gap-2 mt-3">
                <TouchableOpacity
                  onPress={() => setWithdrawMethod("bank_transfer")}
                  activeOpacity={0.85}
                  className={`flex-1 h-14 rounded-full items-center justify-center flex-row gap-1.5 border ${
                    withdrawMethod === "bank_transfer"
                      ? dark ? "bg-white border-white" : "bg-ink border-ink"
                      : dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"
                  }`}
                >
                  <Icon
                    icon={CreditCardIcon}
                    size={16}
                    color={withdrawMethod === "bank_transfer" ? (dark ? "#0A0A0E" : "#fff") : dark ? "#FFFFFF" : "#0A0A0E"}
                  />
                  <Text
                    className={`font-inter-bold text-[13px] ${
                      withdrawMethod === "bank_transfer"
                        ? dark ? "text-ink" : "text-white"
                        : dark ? "text-white" : "text-ink"
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
                      ? dark ? "bg-white border-white" : "bg-ink border-ink"
                      : dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"
                  }`}
                >
                  <Icon
                    icon={Wallet01Icon}
                    size={16}
                    color={withdrawMethod === "mobile_money" ? (dark ? "#0A0A0E" : "#fff") : dark ? "#FFFFFF" : "#0A0A0E"}
                  />
                  <Text
                    className={`font-inter-bold text-[13px] ${
                      withdrawMethod === "mobile_money"
                        ? dark ? "text-ink" : "text-white"
                        : dark ? "text-white" : "text-ink"
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
                variant={dark ? "white" : "ink"}
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
