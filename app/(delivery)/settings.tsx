import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { toast } from "sonner-native";
import { Eyebrow } from "../../src/components/ui/SectionHeader";
import { AppearanceCard, SettingsCard, SettingsRow, SettingsSwitchRow } from "../../src/components/ui/Settings";
import { Icon } from "../../src/components/ui/Icon";
import {
  ArrowLeft01Icon,
  BanknoteIcon,
  BubbleChatIcon,
  Logout01Icon,
} from "../../src/components/icons";

export default function DeliverySettings() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { dark } = useTheme();
  const [assignments, setAssignments] = useState(true);
  const [sounds, setSounds] = useState(true);

  const soon = (label: string) => toast(`${label} coming soon`);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.replace("/onboarding");
  };

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center pt-1 mb-5">
          <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 items-center justify-center">
            <Icon icon={ArrowLeft01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
          </TouchableOpacity>
          <Text className={`text-[20px] font-inter-bold tracking-tight ml-3 ${dark ? "text-white" : "text-ink"}`}>Settings</Text>
        </View>

        <AppearanceCard />

        <SettingsCard>
          <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-1 ${dark ? "text-white/50" : "text-ink/50"}`}>
            Notifications
          </Text>
          <SettingsSwitchRow label="New assignments" subtitle="Ping when orders drop near you" value={assignments} onValueChange={setAssignments} />
          <SettingsSwitchRow label="Sounds" subtitle="Play a tone with alerts" value={sounds} onValueChange={setSounds} last />
        </SettingsCard>

        <SettingsCard>
          <SettingsRow icon={BanknoteIcon} label="Payout account" subtitle="Where earnings land" onPress={() => soon("Payout account")} last />
        </SettingsCard>

        <SettingsCard>
          <SettingsRow icon={BubbleChatIcon} label="Help center" subtitle="FAQs and support" onPress={() => router.push("/legal/terms" as any)} />
          <SettingsRow icon={BubbleChatIcon} label="Terms & privacy" subtitle="The fine print" onPress={() => router.push("/legal/terms" as any)} last />
        </SettingsCard>

        <View className="items-center mt-2 mb-6">
          <Eyebrow>Vento v1.0.0</Eyebrow>
        </View>

        <SettingsCard>
          <SettingsRow icon={Logout01Icon} label="Sign out" danger onPress={handleSignOut} last />
        </SettingsCard>
      </ScrollView>
    </SafeAreaView>
  );
}
