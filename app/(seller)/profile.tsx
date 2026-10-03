import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import {
  UserIcon,
  Edit02Icon,
  Logout01Icon,
  Store01Icon,
} from "../../src/components/icons";

export default function SellerProfile() {
  const router = useRouter();
  const { user, signOut, loading: authLoading, profile: authProfile, refreshProfile } = useAuth();
  const { dark } = useTheme();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [seller, setSeller] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/onboarding" as any);
  }, [authLoading, user]);

  useEffect(() => {
    if (authProfile) {
      setFormData({ name: authProfile.name || "", phone: authProfile.phone || "" });
      supabase
        .from("sellers")
        .select("*")
        .eq("owner_id", authProfile.id)
        .maybeSingle()
        .then(({ data }) => setSeller(data));
    }
  }, [authProfile]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .update({ name: formData.name.trim(), phone: formData.phone.trim() || null })
        .eq("id", user.id);
      if (error) throw error;
      await refreshProfile();
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

  if (authLoading || (user && !authProfile)) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
      </SafeAreaView>
    );
  }

  if (!user) return null;

  const profile = authProfile!;

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
            {seller?.store_name ? (
              <View className="flex-row items-center gap-2 mt-2">
                <Icon icon={Store01Icon} size={15} color="#1B1B8F" />
                <Text className="text-[13px] font-inter-semibold text-primary">{seller.store_name}</Text>
              </View>
            ) : null}
          </View>
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
              <TextField label="Store name" value={seller?.store_name || ""} onChangeText={() => {}} placeholder="No store yet" />
            </View>

            {editing && (
              <View className="gap-3 pt-2">
                <AppButton title="Save Changes" variant={dark ? "white" : "ink"} loading={saving} onPress={handleUpdateProfile} />
                <AppButton
                  title="Cancel"
                  variant={dark ? "ghost-dark" : "ghost-light"}
                  onPress={() => {
                    setEditing(false);
                    setFormData({ name: profile.name, phone: profile.phone || "" });
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
