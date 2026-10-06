import { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { supabase } from "../../src/lib/supabase";
import { buzz } from "../../src/lib/haptics";
import { Icon } from "../../src/components/ui/Icon";
import { SectionHeader } from "../../src/components/ui/SectionHeader";
import { EmptyState } from "../../src/components/ui/Cards";
import { Skeleton } from "../../src/components/ui/Skeleton";
import { Enter } from "../../src/components/motion";
import {
  ArrowLeft01Icon,
  PlusSignIcon,
  SentIcon,
  BankIcon,
  ReceiptIcon,
} from "../../src/components/icons";

// Honest wallet: no ledger exists yet, so no fake balance/cards.
// Shows real order spend + explains POD for now.
export default function VentoPay() {
  const router = useRouter();
  const { dark } = useTheme();
  const { user } = useAuth();
  const [spent, setSpent] = useState(0);
  const [count, setCount] = useState(0);
  const [txns, setTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); setRefreshing(false); return; }
    try {
      const { data } = await supabase.from("orders").select("id, total, created_at, sellers(store_name)").eq("buyer_id", user.id).order("created_at", { ascending: false }).limit(20);
      const list = (data as any) || [];
      setCount(list.length);
      setSpent(list.reduce((s: number, o: any) => s + (o.total || 0), 0));
      setTxns(list);
    } catch {
      // honest empty below
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const locked = (label: string) => {
    buzz();
    toast(`${label} ships with the wallet ledger — pay on delivery for now`);
  };

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <View className="px-5 pt-1 pb-2 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" className="w-11 h-11 items-center justify-center -ml-2">
          <Icon icon={ArrowLeft01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
        </TouchableOpacity>
        <Text className={`text-[20px] font-inter-bold tracking-tight ml-2 ${dark ? "text-white" : "text-ink"}`}>Vento Pay</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); buzz(); load(); }} tintColor={dark ? "#fff" : "#0A0A0E"} />}>
        <Enter>
          <View className="px-5 mt-3">
            <View className={`rounded-[28px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
              <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/50" : "text-ink/50"}`}>Wallet · coming soon</Text>
              <Text className={`text-[15px] font-inter mt-2 leading-[22px] ${dark ? "text-white/65" : "text-ink/65"}`}>Top up, send and withdraw land with the wallet ledger. Until then, every order is pay on delivery.</Text>
            </View>
          </View>
        </Enter>

        <Enter delay={60}>
          <View className="px-5 mt-6 flex-row items-end justify-between">
            <View>
              <Text className={`text-[13px] font-inter ${dark ? "text-white/50" : "text-ink/50"}`}>Total spent · {count} order{count === 1 ? "" : "s"}</Text>
              {loading ? (
                <Skeleton width={160} height={34} radius={10} />
              ) : (
                <Text className={`text-[34px] font-serif-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>₦{spent.toLocaleString()}</Text>
              )}
            </View>
          </View>
        </Enter>

        <Enter delay={100}>
          <View className="px-5 mt-6 flex-row justify-between">
            {[
              { id: "Top up", label: "Top up", icon: PlusSignIcon },
              { id: "Send", label: "Send", icon: SentIcon },
              { id: "Withdraw", label: "Withdraw", icon: BankIcon },
            ].map((a) => (
              <TouchableOpacity key={a.id} onPress={() => locked(a.id)} accessibilityLabel={`${a.label} (coming soon)`} activeOpacity={0.85} className="flex-1 items-center gap-2 opacity-60">
                <View className={`w-14 h-14 rounded-full items-center justify-center border ${dark ? "bg-white/10 border-white/10" : "bg-ink/[0.05] border-ink/10"}`}>
                  <Icon icon={a.icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
                </View>
                <Text className={`text-[13px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Enter>

        <View className="px-5 mt-7">
          <SectionHeader title="Order spend" />
          {loading ? (
            <View className="gap-3 mt-2"><Skeleton width="100%" height={68} radius={18} /><Skeleton width="100%" height={68} radius={18} /></View>
          ) : txns.length === 0 ? (
            <EmptyState title="No spend yet" subtitle="Orders you place appear here as receipts." actionLabel="Browse kitchens" onAction={() => router.push("/(buyer)/browse" as any)} />
          ) : (
            txns.map((t: any) => (
              <View key={t.id} className="flex-row items-center py-3">
                <View className={`w-12 h-12 rounded-2xl items-center justify-center ${dark ? "bg-white/[0.07]" : "bg-ink/[0.05]"}`}>
                  <Icon icon={ReceiptIcon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
                </View>
                <View className="flex-1 ml-3.5">
                  <Text className={`text-[15px] font-inter-bold ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>{t.sellers?.store_name || "Order"}</Text>
                  <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-white/45" : "text-ink/50"}`} numberOfLines={1}>{new Date(t.created_at).toLocaleString()} · POD</Text>
                </View>
                <Text className={`text-[15px] font-inter-bold ${dark ? "text-white/60" : "text-ink/60"}`}>−₦{Number(t.total).toLocaleString()}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
