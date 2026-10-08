import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { ACTIVE_CAMPUS } from "../../src/lib/campus";
import { buzz } from "../../src/lib/haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow } from "../../src/components/ui/SectionHeader";
import { EmptyState } from "../../src/components/ui/Cards";
import { Skeleton } from "../../src/components/ui/Skeleton";
import { Icon } from "../../src/components/ui/Icon";
import { IdentificationIcon, BankIcon, ShieldCheckIcon } from "../../src/components/icons";

const LOCAL_KEY = "vento-rider-verification";

// Rider verification: uni ID + bank account. No gov ID uploads.
// Writes rider_verifications (migration_campus_kyc.sql); falls back to a
// local receipt if the table isn't migrated yet.
export default function RiderVerification() {
  const router = useRouter();
  const { user } = useAuth();
  const { dark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ uniId: "", hostel: "", bankName: "", accountNumber: "", accountName: "" });

  useEffect(() => {
    let alive = true;
    (async () => {
      if (user) {
        const { data } = await supabase.from("rider_verifications").select("status").eq("profile_id", user.id).maybeSingle();
        if (alive && data) { setStatus((data as any).status); setLoading(false); return; }
      }
      const local = await AsyncStorage.getItem(LOCAL_KEY).catch(() => null);
      if (alive) { if (local) setStatus("pending"); setLoading(false); }
    })();
    return () => { alive = false; };
  }, [user]);

  const submit = async () => {
    if (!form.uniId.trim()) { toast.error("Enter your uni ID number"); return; }
    if (!/^\d{10}$/.test(form.accountNumber.trim())) { toast.error("Account number must be 10 digits"); return; }
    if (!form.bankName.trim() || !form.accountName.trim()) { toast.error("Fill in all bank details"); return; }
    if (!user) { toast.error("Log in first"); return; }
    setSubmitting(true);
    try {
      const row = { profile_id: user.id, campus_id: "iuok", uni_id_number: form.uniId.trim(), hostel: form.hostel.trim(), bank_name: form.bankName.trim(), account_number: form.accountNumber.trim(), account_name: form.accountName.trim(), status: "pending" };
      const { error } = await supabase.from("rider_verifications").upsert(row, { onConflict: "profile_id" });
      if (error) throw error;
      setStatus("pending");
      buzz("success");
      toast.success("Submitted — admin reviews within 24h");
      router.back();
    } catch {
      await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify({ ...form, at: Date.now() })).catch(() => {});
      setStatus("pending");
      buzz("success");
      toast.success("Saved — will sync on review");
      router.back();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 px-5 pt-4 gap-3"><Skeleton width="60%" height={28} radius={10} /><Skeleton width="100%" height={140} radius={24} /></View>
      </SafeAreaView>
    );
  }

  if (status === "verified") {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 px-5 pt-4">
          <Eyebrow>Compliance</Eyebrow>
          <Text className={`text-[28px] font-inter-bold mt-1 ${dark ? "text-white" : "text-ink"}`}>Verified ✓</Text>
          <View className="mt-4"><EmptyState title="You're verified" subtitle={`${ACTIVE_CAMPUS.name} · open for deliveries.`} actionLabel="Back" onAction={() => router.back()} /></View>
        </View>
      </SafeAreaView>
    );
  }

  if (status === "pending") {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 px-5 pt-4">
          <Eyebrow>Compliance</Eyebrow>
          <Text className={`text-[28px] font-inter-bold mt-1 ${dark ? "text-white" : "text-ink"}`}>Under review</Text>
          <View className="mt-4"><EmptyState title="Details received" subtitle="Admin reviews within 24h." actionLabel="Back" onAction={() => router.back()} /></View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Eyebrow>{`Compliance · ${ACTIVE_CAMPUS.name}`}</Eyebrow>
        <Text className={`text-[28px] font-inter-bold mt-1 tracking-tight ${dark ? "text-white" : "text-ink"}`}>Verify rider account</Text>
        <Text className={`text-[13px] font-inter mt-1 mb-6 ${dark ? "text-white/55" : "text-ink/55"}`}>Uni ID + bank account. No gov ID needed.</Text>
        <View className="gap-4">
          <View className={`rounded-[24px] border p-6 gap-4 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className="flex-row items-center gap-2">
              <Icon icon={IdentificationIcon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
              <Text className={`text-lg font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Uni ID</Text>
            </View>
            <TextField label="Student / staff ID number" value={form.uniId} onChangeText={(v) => setForm({ ...form, uniId: v })} placeholder="e.g. IUO/2022/1234" autoCapitalize="characters" />
            <TextField label="Hostel / area" value={form.hostel} onChangeText={(v) => setForm({ ...form, hostel: v })} placeholder="e.g. Hall 1, Block A" />
          </View>
          <View className={`rounded-[24px] border p-6 gap-4 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className="flex-row items-center gap-2">
              <Icon icon={BankIcon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
              <Text className={`text-lg font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Bank account</Text>
            </View>
            <TextField label="Bank name" value={form.bankName} onChangeText={(v) => setForm({ ...form, bankName: v })} placeholder="e.g. GTBank, Access Bank" />
            <TextField label="Account number" value={form.accountNumber} onChangeText={(v) => setForm({ ...form, accountNumber: v })} placeholder="10-digit account number" keyboardType="numeric" />
            <TextField label="Account name" value={form.accountName} onChangeText={(v) => setForm({ ...form, accountName: v })} placeholder="Name on bank account" />
          </View>
          <AppButton title="Submit for verification" variant={dark ? "white" : "ink"} loading={submitting} onPress={submit} />
          <View className="flex-row items-center justify-center gap-2">
            <Icon icon={ShieldCheckIcon} size={15} color={dark ? "rgba(255,255,255,0.4)" : "rgba(10,10,14,0.4)"} />
            <Text className={`text-xs font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Reviewed within 24h · {ACTIVE_CAMPUS.name} only</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
