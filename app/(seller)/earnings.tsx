import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import {
  EyeIcon,
  EyeOffIcon,
  ChartLineIcon,
  Package01Icon,
  BankIcon,
  FilterIcon,
  BubbleChatIcon,
  ArrowLeft01Icon,
  BanknoteIcon,
  Wallet01Icon,
} from "../../src/components/icons";

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
  const { dark } = useTheme();
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [withdrawalForm, setWithdrawalForm] = useState({ amount: "", method: "bank" });

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
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      toast.error("Enter a valid amount within balance");
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
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    toast.success("Withdrawal request submitted");
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
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0)
      return `Today, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
    if (diffDays === 1)
      return `Yesterday, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
  };

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const thisWeekEarnings = orders
    .filter((o) => new Date(o.created_at) >= weekStart)
    .reduce((sum, o) => sum + o.total_price, 0);
  const thisWeekOrders = orders.filter((o) => new Date(o.created_at) >= weekStart).length;

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <View className="px-5 pt-4 pb-4 flex-row items-center justify-between">
        <View>
          <Eyebrow>Payouts</Eyebrow>
          <Text className={`text-[28px] font-inter-bold mt-1 tracking-tight ${dark ? "text-white" : "text-ink"}`}>Earnings</Text>
          <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Payouts and history</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => toast.success("Payouts settle in 1-3 business days")}
          className={`w-12 h-12 rounded-full border items-center justify-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
        >
          <Icon icon={BubbleChatIcon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View className="px-5">
          <View className={`rounded-[28px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className="items-center">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/55" : "text-ink/55"}`}>Total balance</Text>
                <TouchableOpacity onPress={() => setShowBalance(!showBalance)} activeOpacity={0.85}>
                  <Icon icon={showBalance ? EyeIcon : EyeOffIcon} size={16} color="#1B1B8F" />
                </TouchableOpacity>
              </View>
              <Text className={`text-4xl font-inter-bold mb-3 tracking-tight ${dark ? "text-white" : "text-ink"}`}>
                {showBalance ? `₦${availableBalance.toFixed(2)}` : "••••••"}
              </Text>
              <View className={`flex-row items-center gap-1.5 px-3 py-1.5 border rounded-full ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                <View className="w-2 h-2 bg-success rounded-full" />
                <Text className={`text-xs font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Available to withdraw</Text>
              </View>
            </View>

            <View className="mt-6">
              <AppButton
                title="Withdraw Funds"
                variant={dark ? "white" : "ink"}
                onPress={() => setDialogOpen(true)}
                disabled={availableBalance <= 0}
              />
            </View>

            {pendingWithdrawals > 0 && (
              <Text className={`text-center text-[13px] font-inter mt-3 ${dark ? "text-white/55" : "text-ink/55"}`}>
                +₦{pendingWithdrawals.toFixed(2)} pending clearance
              </Text>
            )}
          </View>
        </View>

        <View className="px-5 mt-4 flex-row gap-3">
          <View className={`flex-1 rounded-[24px] p-5 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className="flex-row items-center gap-2 mb-2">
              <Icon icon={ChartLineIcon} size={15} color="#1B1B8F" />
              <Text className={`text-[11px] font-inter-bold uppercase tracking-[1px] ${dark ? "text-white/55" : "text-ink/55"}`}>This week</Text>
            </View>
            <Text className="text-xl font-inter-bold text-success">+₦{thisWeekEarnings.toFixed(2)}</Text>
          </View>
          <View className={`flex-1 rounded-[24px] p-5 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className="flex-row items-center gap-2 mb-2">
              <Icon icon={Package01Icon} size={15} color="#1B1B8F" />
              <Text className={`text-[11px] font-inter-bold uppercase tracking-[1px] ${dark ? "text-white/55" : "text-ink/55"}`}>Orders</Text>
            </View>
            <Text className={`text-xl font-inter-bold ${dark ? "text-white" : "text-ink"}`}>{thisWeekOrders}</Text>
          </View>
        </View>

        <View className="px-5 mt-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-lg font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Recent transactions</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => toast.success("Filters coming soon")}
              className={`flex-row items-center gap-1 border px-3 h-10 rounded-full ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
            >
              <Icon icon={FilterIcon} size={14} color="#1B1B8F" />
              <Text className="text-[13px] font-inter-bold text-primary">Filter</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <View className={`rounded-[24px] p-8 items-center border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
              <Text className={`font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>No transactions yet</Text>
            </View>
          ) : (
            <View className="gap-3">
              {recentTransactions.map((t) => (
                <View key={t.id} className={`rounded-[24px] p-4 flex-row items-center gap-3 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                  <View className={`w-12 h-12 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                    <Icon icon={t.type === "withdrawal" ? BankIcon : Wallet01Icon} size={20} color="#1B1B8F" />
                  </View>
                  <View className="flex-1 min-w-0">
                    <Text className={`font-inter-bold text-[13px] ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>
                      {t.name}
                    </Text>
                    <Text className={`text-xs font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`}>{formatDate(t.date)}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-inter-bold" style={{ color: t.amount >= 0 ? "#12805C" : "#D92D20" }}>
                      {t.amount >= 0 ? "+" : ""}₦{Math.abs(t.amount).toFixed(2)}
                    </Text>
                    <View className="mt-1">
                      <StatusChip label={t.status} tone={t.amount >= 0 ? "success" : "neutral"} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View className="flex-row items-start gap-2 mt-6 px-2">
            <Icon icon={BanknoteIcon} size={15} color={dark ? "rgba(255,255,255,0.4)" : "rgba(10,10,14,0.4)"} />
            <Text className={`text-xs font-inter flex-1 ${dark ? "text-white/55" : "text-ink/55"}`}>
              Earnings update in real-time. Bank payouts typically take 1-3 business days.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={dialogOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setDialogOpen(false)}>
        <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
          <View className="flex-row items-center justify-between px-5 pt-4 pb-4">
            <Text className={`text-xl font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Withdraw funds</Text>
            <TouchableOpacity
              onPress={() => setDialogOpen(false)}
              activeOpacity={0.85}
              className={`w-10 h-10 rounded-full border items-center justify-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
            >
              <Icon icon={ArrowLeft01Icon} size={16} color={dark ? "#fff" : "#0A0A0E"} />
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-5 gap-4">
            <View className={`rounded-[24px] border p-5 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
              <TextField label="Amount (₦)" value={withdrawalForm.amount} onChangeText={(v) => setWithdrawalForm({ ...withdrawalForm, amount: v })} placeholder="0.00" keyboardType="numeric" />
            </View>
            <View className={`rounded-[24px] border p-5 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
              <Text className={`text-[13px] font-inter-bold mb-2 ${dark ? "text-white" : "text-ink"}`}>Method</Text>
              <View className="flex-row gap-2 mt-1">
                <TouchableOpacity
                  onPress={() => setWithdrawalForm({ ...withdrawalForm, method: "bank" })}
                  activeOpacity={0.85}
                  className={`flex-1 h-14 rounded-full flex-row items-center justify-center gap-2 border ${
                    withdrawalForm.method === "bank"
                      ? dark ? "bg-white border-white" : "bg-ink border-ink"
                      : dark ? "bg-white/10 border-white/10" : "bg-white border-border"
                  }`}
                >
                  <Icon icon={BankIcon} size={16} color={withdrawalForm.method === "bank" ? (dark ? "#0A0A0E" : "#fff") : (dark ? "#fff" : "#0A0A0E")} />
                  <Text className={`font-inter-bold text-[13px] ${withdrawalForm.method === "bank" ? (dark ? "text-ink" : "text-white") : (dark ? "text-white" : "text-ink")}`}>
                    Bank
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setWithdrawalForm({ ...withdrawalForm, method: "mobile_money" })}
                  activeOpacity={0.85}
                  className={`flex-1 h-14 rounded-full flex-row items-center justify-center gap-2 border ${
                    withdrawalForm.method === "mobile_money"
                      ? dark ? "bg-white border-white" : "bg-ink border-ink"
                      : dark ? "bg-white/10 border-white/10" : "bg-white border-border"
                  }`}
                >
                  <Icon icon={Wallet01Icon} size={16} color={withdrawalForm.method === "mobile_money" ? (dark ? "#0A0A0E" : "#fff") : (dark ? "#fff" : "#0A0A0E")} />
                  <Text className={`font-inter-bold text-[13px] ${withdrawalForm.method === "mobile_money" ? (dark ? "text-ink" : "text-white") : (dark ? "text-white" : "text-ink")}`}>
                    Momo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="mt-2 mb-8">
              <AppButton title="Submit Request" variant={dark ? "white" : "ink"} onPress={handleWithdrawal} />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
