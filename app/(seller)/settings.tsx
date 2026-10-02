import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Eyebrow } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import {
  Store01Icon,
  Notification01Icon,
  Clock01Icon,
  MapPinIcon,
  CreditCardIcon,
  Logout01Icon,
} from "../../src/components/icons";

const settingsItems = [
  { icon: Store01Icon, label: "Store information", subtitle: "Name, description, hours" },
  { icon: Notification01Icon, label: "Notifications", subtitle: "Order alerts, promotions" },
  { icon: Clock01Icon, label: "Operating hours", subtitle: "Set your open/close times" },
  { icon: MapPinIcon, label: "Delivery radius", subtitle: "Maximum delivery distance" },
  { icon: CreditCardIcon, label: "Payment settings", subtitle: "Payout preferences" },
];

export default function SellerSettings() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    toast.success("Signed out");
    router.replace("/onboarding" as any);
  };

  const pressRow = (label: string) => toast.success(`${label} coming soon`);

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <Eyebrow>Preferences</Eyebrow>
        <Text className="text-[28px] font-inter-bold text-ink mt-1 tracking-tight">Settings</Text>
        <Text className="text-[13px] font-inter text-ink/55 mt-1 mb-6">Store preferences</Text>

        <View className="bg-white rounded-[24px] p-6 mb-4 border border-border">
          <View className="flex-row items-center justify-between py-3 border-b border-border">
            <View className="flex-1 pr-3">
              <Text className="font-inter-bold text-ink">Push notifications</Text>
              <Text className="text-[13px] font-inter text-ink/55">Order alerts and updates</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={(v) => {
                setNotifications(v);
                if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              }}
              trackColor={{ true: "#0A0A0E", false: "#D8D2C4" }}
            />
          </View>
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-1 pr-3">
              <Text className="font-inter-bold text-ink">Auto-accept orders</Text>
              <Text className="text-[13px] font-inter text-ink/55">Automatically accept incoming orders</Text>
            </View>
            <Switch
              value={autoAccept}
              onValueChange={(v) => {
                setAutoAccept(v);
                if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                toast.success(v ? "Auto-accept on" : "Auto-accept off");
              }}
              trackColor={{ true: "#0A0A0E", false: "#D8D2C4" }}
            />
          </View>
        </View>

        <View className="bg-white rounded-[24px] overflow-hidden mb-4 border border-border">
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => pressRow(item.label)}
              activeOpacity={0.85}
              className={`flex-row items-center p-4 ${index < settingsItems.length - 1 ? "border-b border-border" : ""}`}
            >
              <View className="w-11 h-11 rounded-full bg-cream border border-border items-center justify-center mr-3">
                <Icon icon={item.icon} size={20} color="#1B1B8F" />
              </View>
              <View className="flex-1">
                <Text className="font-inter-bold text-ink">{item.label}</Text>
                <Text className="text-[13px] font-inter text-ink/55">{item.subtitle}</Text>
              </View>
              <Text className="text-ink/55 text-lg font-inter">›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.85}
          className="bg-white rounded-[24px] p-5 flex-row items-center gap-3 border border-border"
        >
          <View className="w-11 h-11 rounded-full bg-destructive/10 items-center justify-center">
            <Icon icon={Logout01Icon} size={20} color="#D92D20" />
          </View>
          <Text className="text-destructive font-inter-bold">Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
