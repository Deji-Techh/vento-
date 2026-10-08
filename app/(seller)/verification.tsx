import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { ACTIVE_CAMPUS, CAMPUSES } from "../../src/lib/campus";
import { buzz } from "../../src/lib/haptics";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow } from "../../src/components/ui/SectionHeader";
import { EmptyState } from "../../src/components/ui/Cards";
import { Skeleton } from "../../src/components/ui/Skeleton";
import { Icon } from "../../src/components/ui/Icon";
import {
  CheckmarkCircle01Icon,
  IdentificationIcon,
  BankIcon,
  ShieldCheckIcon,
} from "../../src/components/icons";

// Campus verification: uni ID + bank account. No gov ID uploads.
// Vento is universities-only — launch campus is Igbinedion University.
export default function SellerVerification() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { dark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [existing, setExisting] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ uniId: "", hostel: "", bankName: "", accountNumber: "", accountName: "" });

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("sellers").select("id, verification_status, approved").eq("owner_id", user.id).limit(1).maybeSingle();
      if (alive) { setExisting(data || null); setLoading(false); }
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
      const summary = `IUOK · ID ${form.uniId.trim()} · ${form.hostel.trim() || "hostel n/a"} · ${form.bankName.trim()} ${form.accountNumber.trim()}`;
      if (existing) {
        const { error } = await supabase.from("sellers").update({ verification_status: "documents_submitted", description: summary }).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("sellers").insert({
          owner_id: user.id,
          store_name: profile?.name ? `${profile.name}'s Kitchen` : "New Seller",
          description: summary,
          approved: false,
          verification_status: "documents_submitted",
        });
        if (error) throw error;
      }
      buzz("success");
      toast.success("Submitted — admin reviews within 24h");
      router.back();
    } catch (e: any) {
      buzz("error");
      toast.error(e.message || "Couldn't submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 px-5 pt-4 gap-3"><Skeleton width="60%" height={28} radius={10} /><Skeleton width="100%" height={140} radius={24} /><Skeleton width="100%" height={140} radius={24} /></View>
      </SafeAreaView>
    );
  }

  if (existing?.verification_status === "verified" || existing?.approved) {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 px-5 pt-4">
          <Eyebrow>Compliance</Eyebrow>
          <Text className={`text-[28px] font-inter-bold mt-1 tracking-tight ${dark ? "text-white" : "text-ink"}`}>Verified ✓</Text>
          <View className="mt-4"><EmptyState title="You're verified" subtitle={`${ACTIVE_CAMPUS.name} · you can receive orders.`} actionLabel="Back to dashboard" onAction={() => router.back()} /></View>
        </View>
      </SafeAreaView>
    );
  }

  if (existing?.verification_status === "documents_submitted") {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 px-5 pt-4">
          <Eyebrow>Compliance</Eyebrow>
          <Text className={`text-[28px] font-inter-bold mt-1 tracking-tight ${dark ? "text-white" : "text-ink"}`}>Under review</Text>
          <View className="mt-4"><EmptyState title="Documents received" subtitle="Admin reviews within 24h. You'll be notified on approval." actionLabel="Back" onAction={() => router.back()} /></View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Eyebrow>{`Compliance · ${ACTIVE_CAMPUS.name}`}</Eyebrow>
        <Text className={`text-[28px] font-inter-bold mt-1 tracking-tight ${dark ? "text-white" : "text-ink"}`}>Verify account</Text>
        <Text className={`text-[13px] font-inter mt-1 mb-6 ${dark ? "text-white/55" : "text-ink/55"}`}>Uni ID + bank account. No gov ID needed.</Text>

        <View className={`rounded-[24px] border p-6 mb-4 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-3 ${dark ? "text-white/50" : "text-ink/50"}`}>Campus</Text>
          {CAMPUSES.map((c) => (
            <View key={c.id} className="flex-row items-center justify-between py-2.5">
              <View className="flex-1 pr-3">
                <Text className={`font-inter-bold text-[14px] ${dark ? "text-white" : "text-ink"}`}>{c.name}</Text>
                <Text className={`text-[12px] font-inter ${dark ? "text-white/50" : "text-ink/50"}`}>{c.town}</Text>
              </View>
              {c.active ? (
                <View className="flex-row items-center gap-1.5"><Icon icon={CheckmarkCircle01Icon} size={16} color="#12805C" /><Text className="text-[12px] font-inter-bold text-[#12805C]">Live</Text></View>
              ) : (
                <Text className={`text-[12px] font-inter-bold ${dark ? "text-white/40" : "text-ink/40"}`}>Soon</Text>
              )}
            </View>
          ))}
        </View>

        {step === 1 ? (
          <View className="gap-4">
            <View className={`rounded-[24px] border p-6 gap-4 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
              <View className="flex-row items-center gap-2">
                <Icon icon={IdentificationIcon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
                <Text className={`text-lg font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Uni ID</Text>
              </View>
              <TextField label="Student / staff ID number" value={form.uniId} onChangeText={(v) => setForm({ ...form, uniId: v })} placeholder="e.g. IUO/2022/1234" autoCapitalize="characters" />
              <TextField label="Hostel / area" value={form.hostel} onChangeText={(v) => setForm({ ...form, hostel: v })} placeholder="e.g. Hall 2, Block C" />
            </View>
            <AppButton title="Continue" variant={dark ? "white" : "ink"} onPress={() => { if (!form.uniId.trim()) { toast.error("Enter your uni ID number"); return; } if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {}); setStep(2); }} />
          </View>
        ) : (
          <View className="gap-4">
            <View className={`rounded-[24px] border p-6 gap-4 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
              <View className="flex-row items-center gap-2">
                <Icon icon={BankIcon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
                <Text className={`text-lg font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Bank account</Text>
              </View>
              <TextField label="Bank name" value={form.bankName} onChangeText={(v) => setForm({ ...form, bankName: v })} placeholder="e.g. GTBank, Access Bank" />
              <TextField label="Account number" value={form.accountNumber} onChangeText={(v) => setForm({ ...form, accountNumber: v })} placeholder="10-digit account number" keyboardType="numeric" />
              <TextField label="Account name" value={form.accountName} onChangeText={(v) => setForm({ ...form, accountName: v })} placeholder="Name on bank account" />
            </View>
            <AppButton title="Submit for verification" variant={dark ? "white" : "ink"} loading={submitting} onPress={submit} />
            <TouchableOpacity onPress={() => setStep(1)} className="items-center"><Text className={`text-[13px] font-inter-bold ${dark ? "text-white/60" : "text-ink/60"}`}>← Back</Text></TouchableOpacity>
            <View className="flex-row items-center justify-center gap-2">
              <Icon icon={ShieldCheckIcon} size={15} color={dark ? "rgba(255,255,255,0.4)" : "rgba(10,10,14,0.4)"} />
              <Text className={`text-xs font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Reviewed within 24h · {ACTIVE_CAMPUS.name} only</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
