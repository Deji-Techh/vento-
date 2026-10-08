import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { Eyebrow, SectionHeader, StatusChip } from "../../src/components/ui/SectionHeader";
import { EmptyState } from "../../src/components/ui/Cards";
import { Skeleton } from "../../src/components/ui/Skeleton";
import { Icon } from "../../src/components/ui/Icon";
import {
  DashboardSquare01Icon,
  UsersIcon,
  Store01Icon,
  ReceiptIcon,
  Clock01Icon,
  CheckmarkCircle01Icon,
  Delete02Icon,
} from "../../src/components/icons";

function verificationTone(status: string): "warning" | "info" | "neutral" {
  if (status === "documents_submitted") return "warning";
  if (status === "pending") return "info";
  return "neutral";
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { dark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [counts, setCounts] = useState({ users: 0, sellers: 0, pending: 0, orders: 0, items: 0 });
  const [pendingSellers, setPendingSellers] = useState<any[]>([]);

  const load = useCallback(async () => {
    setError("");
    try {
      const [{ count: u }, { count: s }, { data: pending }, { count: o }, { count: m }] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("sellers").select("id", { count: "exact", head: true }),
        supabase.from("sellers").select("id, store_name, description, verification_status, approved, owner_id").eq("approved", false).order("created_at", { ascending: false }).limit(10),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("menu_items").select("id", { count: "exact", head: true }),
      ]);
      setCounts({ users: u || 0, sellers: s || 0, pending: (pending || []).length, orders: o || 0, items: m || 0 });
      setPendingSellers(pending || []);
    } catch (e: any) {
      setError(e.message || "Couldn't load platform stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApproval = async (sellerId: string, approve: boolean) => {
    setPendingSellers((prev) => prev.filter((s) => s.id !== sellerId));
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(approve ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning).catch(() => {});
    }
    try {
      if (approve) {
        const { error } = await supabase.from("sellers").update({ approved: true, verification_status: "verified" }).eq("id", sellerId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("sellers").update({ approved: false, verification_status: "rejected" }).eq("id", sellerId);
        if (error) throw error;
      }
      if (user) await supabase.from("admin_actions").insert({ admin_id: user.id, action_type: approve ? "seller_approved" : "seller_rejected", target_id: sellerId, meta: {} });
      toast.success(approve ? "Seller approved" : "Seller rejected");
      load();
    } catch (e: any) {
      toast.error(e.message || "Couldn't update seller");
      load();
    }
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 px-5 pt-4 gap-3">
          <Skeleton width="50%" height={28} radius={10} />
          <Skeleton width="100%" height={140} radius={28} />
          <Skeleton width="100%" height={100} radius={24} />
        </View>
      </SafeAreaView>
    );
  }

  const statCards = [
    { label: "Total Users", value: counts.users, icon: UsersIcon, tint: dark ? "#fff" : "#0A0A0E" },
    { label: "Sellers", value: counts.sellers, icon: Store01Icon, tint: "#12805C" },
    { label: "Pending", value: counts.pending, icon: Clock01Icon, tint: dark ? "#fff" : "#0A0A0E" },
    { label: "Orders", value: counts.orders, icon: ReceiptIcon, tint: dark ? "#fff" : "#0A0A0E" },
    { label: "Live items", value: counts.items, icon: ReceiptIcon, tint: dark ? "#fff" : "#0A0A0E" },
  ];

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 120, paddingTop: 12, gap: 16 }} showsVerticalScrollIndicator={false}>
        <View>
          <Eyebrow>Platform</Eyebrow>
          <Text className={`text-[28px] font-inter-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>Admin</Text>
          <Text className={`text-[13px] font-inter mt-1 ${dark ? "text-white/55" : "text-ink/55"}`}>{user?.email ? `${user.email} • ` : ""}Manage your Vento platform</Text>
        </View>

        {error ? <EmptyState title="Stats unavailable" subtitle={error} actionLabel="Retry" onAction={load} /> : null}

        <View className={`rounded-[28px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <View className="flex-row items-center gap-2">
            <Icon icon={DashboardSquare01Icon} size={18} color={dark ? "#fff" : "#0A0A0E"} />
            <Eyebrow>Platform at a glance</Eyebrow>
          </View>
          <Text className={`text-[22px] font-inter-bold tracking-tight mt-3 ${dark ? "text-white" : "text-ink"}`}>{counts.orders} orders • {counts.users} users</Text>
          <View className="flex-row gap-2 mt-4">
            <StatusChip label={`${counts.pending} pending`} tone="warning" />
            <StatusChip label={`${counts.items} live items`} tone="info" />
          </View>
        </View>

        <View className="flex-row flex-wrap gap-3">
          {statCards.map((s) => (
            <View key={s.label} className={`rounded-[24px] p-5 border flex-1 min-w-[45%] ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
              <View className={`w-11 h-11 rounded-full border items-center justify-center mb-2 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                <Icon icon={s.icon} size={20} color={s.tint} />
              </View>
              <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>{s.label}</Text>
              <Text className={`text-[20px] font-inter-bold mt-0.5 ${dark ? "text-white" : "text-ink"}`}>{s.value}</Text>
            </View>
          ))}
        </View>

        <View className={`rounded-[24px] border p-6 gap-3 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/50" : "text-ink/50"}`}>Quick Actions</Text>
          <AppButton title="Publish listings" variant="ink" onPress={() => router.push("/(admin)/listings" as any)} />
          <AppButton title="Manage Delivery Agents" variant={dark ? "white" : "ink"} onPress={() => router.push("/(admin)/users" as any)} />
          <AppButton title="View Terms" variant={dark ? "white" : "ink"} onPress={() => router.push("/legal/terms" as any)} />
        </View>

        <View>
          <SectionHeader title="Pending approvals" action={`${pendingSellers.length}`} />
          {pendingSellers.length === 0 ? (
            <EmptyState title="Nothing pending" subtitle="New seller requests appear here for approval." />
          ) : (
            <View className="gap-3">
              {pendingSellers.map((seller) => (
                <View key={seller.id} className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                  <View className="mb-4">
                    <View className="flex-row items-center gap-2 mb-1.5 flex-wrap">
                      <Text className={`font-inter-bold text-[15px] ${dark ? "text-white" : "text-ink"}`}>{seller.store_name}</Text>
                      <StatusChip label={(seller.verification_status || "pending").replaceAll("_", " ")} tone={verificationTone(seller.verification_status || "pending")} />
                    </View>
                    {seller.description ? (
                      <Text className={`text-[13px] font-inter mt-1 ${dark ? "text-white/55" : "text-ink/55"}`}>{seller.description}</Text>
                    ) : null}
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity onPress={() => handleApproval(seller.id, true)} accessibilityLabel={`Approve ${seller.store_name}`} activeOpacity={0.85} className={`flex-1 h-[44px] rounded-full items-center justify-center flex-row gap-1.5 ${dark ? "bg-white" : "bg-ink"}`}>
                      <Icon icon={CheckmarkCircle01Icon} size={15} color={dark ? "#0A0A0E" : "#fff"} />
                      <Text className={`font-inter-bold text-[14px] ${dark ? "text-ink" : "text-white"}`}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleApproval(seller.id, false)} accessibilityLabel={`Reject ${seller.store_name}`} activeOpacity={0.85} className={`flex-1 border h-[44px] rounded-full items-center justify-center flex-row gap-1.5 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                      <Icon icon={Delete02Icon} size={15} color="#D92D20" />
                      <Text className={`font-inter-bold text-[14px] ${dark ? "text-white" : "text-ink"}`}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
