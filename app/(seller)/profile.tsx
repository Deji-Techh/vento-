import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import {
  UserIcon,
  Edit02Icon,
  Package01Icon,
  CheckmarkCircle01Icon,
  Wallet01Icon,
  Logout01Icon,
  Store01Icon,
} from "../../src/components/icons";

const mockProfile = {
  id: "mock-seller-001",
  name: "Chef Ada",
  email: "ada@campus.edu",
  phone: "+2348000000002",
  avatar_url: null,
  role: "seller",
  store_name: "Ada's Kitchen",
  approved: true,
};

const mockStats = {
  totalOrders: 47,
  completedOrders: 42,
  totalEarnings: 125000,
};

export default function SellerProfile() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { dark } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  useEffect(() => {
    setTimeout(() => {
      setProfile(mockProfile);
      setFormData({ name: mockProfile.name, phone: mockProfile.phone });
      setLoading(false);
    }, 800);
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      setSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProfile((prev: any) => ({ ...prev, name: formData.name, phone: formData.phone }));
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      toast.success("Profile updated");
      setEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.replace("/onboarding" as any);
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
      </SafeAreaView>
    );
  }

  if (!profile) return null;

  const statCards = [
    { icon: Package01Icon, value: `${mockStats.totalOrders}`, label: "Total orders" },
    { icon: CheckmarkCircle01Icon, value: `${mockStats.completedOrders}`, label: "Completed" },
    { icon: Wallet01Icon, value: `₦${mockStats.totalEarnings.toLocaleString()}`, label: "Earnings" },
  ];

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <Eyebrow>Account</Eyebrow>

        <View className={`rounded-[28px] p-6 border mt-3 mb-4 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <View className="items-center">
            <View className={`w-24 h-24 rounded-full border items-center justify-center mb-4 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
              <Text className={`text-2xl font-inter-bold ${dark ? "text-white" : "text-ink"}`}>{profile.name?.charAt(0) || "U"}</Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <Text className={`text-xl font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>{profile.name}</Text>
              <StatusChip label={profile.role} tone="info" />
            </View>
            <View className="flex-row items-center gap-2">
              <Icon icon={UserIcon} size={15} color={dark ? "rgba(255,255,255,0.4)" : "rgba(10,10,14,0.4)"} />
              <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>{user?.email || profile.email}</Text>
            </View>
            <View className="flex-row items-center gap-2 mt-2">
              <Icon icon={Store01Icon} size={15} color="#1B1B8F" />
              <Text className="text-[13px] font-inter-semibold text-primary">{profile.store_name}</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3 mb-4">
          {statCards.map((s) => (
            <View key={s.label} className={`flex-1 rounded-[24px] p-4 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
              <View className={`w-10 h-10 rounded-full border items-center justify-center mb-2 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                <Icon icon={s.icon} size={18} color="#1B1B8F" />
              </View>
              <Text className={`text-base font-inter-bold ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>
                {s.value}
              </Text>
              <Text className={`text-xs font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View className={`rounded-[24px] p-6 border mb-4 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-lg font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Profile details</Text>
            {!editing && (
              <TouchableOpacity
                onPress={() => setEditing(true)}
                activeOpacity={0.85}
                className={`flex-row items-center gap-1.5 border px-3 h-10 rounded-full ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}
              >
                <Icon icon={Edit02Icon} size={14} color="#1B1B8F" />
                <Text className="text-[13px] text-primary font-inter-bold">Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="gap-4">
            <TextField label="Name" value={formData.name} onChangeText={(v) => setFormData({ ...formData, name: v })} placeholder="Enter your name" />
            <TextField label="Phone number" value={formData.phone} onChangeText={(v) => setFormData({ ...formData, phone: v })} placeholder="Enter phone number" keyboardType="phone-pad" />
            <View className="opacity-70">
              <TextField label="Store name" value={profile.store_name} onChangeText={() => {}} placeholder="Store name" />
            </View>

            {editing && (
              <View className="gap-3 pt-2">
                <AppButton title="Save Changes" variant={dark ? "white" : "ink"} loading={saving} onPress={handleUpdateProfile} />
                <AppButton
                  title="Cancel"
                  variant={dark ? "ghost-dark" : "ghost-light"}
                  onPress={() => {
                    setEditing(false);
                    setFormData({ name: profile.name, phone: profile.phone });
                  }}
                />
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.85}
          className={`rounded-[24px] p-4 border items-center flex-row justify-center gap-2 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
        >
          <Icon icon={Logout01Icon} size={16} color="#D92D20" />
          <Text className="text-destructive font-inter-bold">Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
