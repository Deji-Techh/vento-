import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { AppButton } from "../../src/components/ui/AppButton";
import { Enter } from "../../src/components/motion";
import { Icon } from "../../src/components/ui/Icon";
import { ShoppingBag02Icon, Store01Icon, DeliveryBox01Icon } from "../../src/components/icons";
import { toast } from "sonner-native";

const roles = [
  { id: "buyer", label: "Order food", description: "Hot meals, delivered fast.", icon: ShoppingBag02Icon },
  { id: "seller", label: "Sell food", description: "Your kitchen, more orders.", icon: Store01Icon },
  { id: "rider", label: "Deliver", description: "Earn on your schedule.", icon: DeliveryBox01Icon },
];

export default function ChooseRole() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const { dark } = useTheme();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole || saving) return;
    // NEVER add admin here. Admin access is login-only via admin@vento.ng
    // and is granted server-side (profiles.role='admin'). See src/components/AuthGuard.tsx.
    const ALLOWED = ["buyer", "seller", "delivery_agent"] as const;
    const role = selectedRole === "rider" ? "delivery_agent" : selectedRole;
    if (!(ALLOWED as readonly string[]).includes(role)) {
      toast.error("Invalid role");
      return;
    }
    setSaving(true);
    try {
      if (user) {
        const { error } = await supabase.from("profiles").update({ role }).eq("id", user.id);
        if (error) throw error;
        await refreshProfile();
      }
      if (role === "buyer") router.replace("/(buyer)/browse" as any);
      else if (role === "seller") router.replace("/(seller)/dashboard" as any);
      else router.replace("/(delivery)/dashboard" as any);
    } catch {
      toast.error("Couldn't save your role — try again");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top", "bottom"]}>
      <View className="flex-1 px-6 pt-8">
        <Enter>
          <Text className={`text-[11px] font-inter-bold tracking-[2px] uppercase text-center ${dark ? "text-white/50" : "text-ink/50"}`}>Vento</Text>
          <Text className={`text-[30px] font-display-bold tracking-tight text-center mt-2 ${dark ? "text-white" : "text-ink"}`}>What brings you?</Text>
        </Enter>

        <View className="gap-3 mt-9">
          {roles.map((r, i) => {
            const active = selectedRole === r.id;
            return (
              <Enter key={r.id} delay={60 + i * 50}>
                <TouchableOpacity
                  onPress={() => setSelectedRole(r.id)}
                  activeOpacity={0.92}
                  className={`flex-row items-center p-5 rounded-[24px] ${
                    active
                      ? dark
                        ? "bg-white"
                        : "bg-ink"
                      : dark
                        ? "bg-white/[0.06] border border-white/10"
                        : "bg-white border border-border"
                  }`}
                >
                  <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${active ? (dark ? "bg-ink" : "bg-white") : dark ? "bg-white/10" : "bg-ink/[0.05]"}`}>
                    <Icon
                      icon={r.icon}
                      size={22}
                      color={active ? (dark ? "#fff" : "#0A0A0E") : dark ? "rgba(255,255,255,0.6)" : "rgba(10,10,14,0.55)"}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-[17px] font-inter-bold tracking-tight ${active ? (dark ? "text-ink" : "text-white") : dark ? "text-white" : "text-ink"}`}>{r.label}</Text>
                    <Text className={`text-[13px] font-inter mt-0.5 ${active ? (dark ? "text-ink/60" : "text-white/60") : dark ? "text-white/50" : "text-ink/55"}`}>{r.description}</Text>
                  </View>
                  <View className={`w-6 h-6 rounded-full items-center justify-center ${active ? (dark ? "bg-ink" : "bg-white") : dark ? "border-2 border-white/20" : "border-2 border-ink/20"}`}>
                    {active && <Text className={`text-[11px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>✓</Text>}
                  </View>
                </TouchableOpacity>
              </Enter>
            );
          })}
        </View>
      </View>
      <View className="px-6 pb-2">
        <AppButton title="Continue" variant={dark ? "white" : "ink"} disabled={!selectedRole} loading={saving} onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}
