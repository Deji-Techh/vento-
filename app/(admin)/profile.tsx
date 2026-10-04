import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow } from "../../src/components/ui/SectionHeader";
import { Skeleton } from "../../src/components/ui/Skeleton";
import { Icon } from "../../src/components/ui/Icon";
import {
  UserIcon,
  PhoneIcon,
  Edit02Icon,
  Logout01Icon,
  ShieldCheckIcon,
} from "../../src/components/icons";

export default function AdminProfile() {
  const router = useRouter();
  const { user, signOut, loading: authLoading, profile: authProfile, refreshProfile } = useAuth();
  const { dark } = useTheme();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  useEffect(() => {
    if (!authLoading && !user) router.replace("/onboarding" as any);
  }, [authLoading, user]);

  useEffect(() => {
    if (authProfile) {
      setFormData({ name: authProfile.name || "", phone: authProfile.phone || "" });
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
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
          () => {}
        );
      }
      toast.success("Profile updated");
      setEditing(false);
    } catch (error: any) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      }
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/onboarding" as any);
  };

  if (authLoading || (user && !authProfile)) {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 px-5 pt-10 gap-4">
          <View className="items-center">
            <Skeleton width={96} height={96} radius={48} />
            <View className="mt-3" />
            <Skeleton width={180} height={24} radius={8} />
            <View className="mt-2" />
            <Skeleton width={140} height={14} radius={6} />
          </View>
          <Skeleton width="100%" height={90} radius={24} />
          <Skeleton width="100%" height={56} radius={28} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) return null;

  const profile = authProfile!;

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
      >
        <Eyebrow>Account</Eyebrow>

        {/* Profile header */}
        <View className={`rounded-[28px] p-6 border mt-3 mb-4 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <View className="items-center">
            <View className={`w-24 h-24 rounded-full border items-center justify-center mb-4 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
              <Text className={`text-[28px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
                {profile.name?.charAt(0) || "A"}
              </Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <Text className={`text-[20px] font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
                {profile.name}
              </Text>
              <View className={`px-3 py-1.5 rounded-full flex-row items-center gap-1 ${dark ? "bg-white/10" : "bg-ink/[0.06]"}`}>
                <Icon icon={ShieldCheckIcon} size={12} color={dark ? "#fff" : "#0A0A0E"} />
                <Text className={`text-[11px] font-inter-bold uppercase tracking-[0.5px] ${dark ? "text-white" : "text-ink"}`}>
                  Admin
                </Text>
              </View>
            </View>
            <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
              {user?.email || profile.email}
            </Text>
          </View>
        </View>

        {/* Profile details */}
        <View className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <View className="flex-row items-center justify-between mb-6">
            <Text className={`text-[20px] font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
              Profile details
            </Text>
            {!editing && (
              <TouchableOpacity
                onPress={() => setEditing(true)}
                activeOpacity={0.85}
                className={`flex-row items-center gap-1.5 border px-4 py-2.5 rounded-full ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}
              >
                <Icon icon={Edit02Icon} size={14} color={dark ? "#fff" : "#0A0A0E"} />
                <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="gap-5">
            <View>
              <View className="flex-row items-center gap-2 mb-2">
                <Icon icon={UserIcon} size={16} color={dark ? "rgba(255,255,255,0.45)" : "rgba(10,10,14,0.45)"} />
                <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/50" : "text-ink/50"}`}>
                  Name
                </Text>
              </View>
              {editing ? (
                <TextField
                  value={formData.name}
                  onChangeText={(val) => setFormData({ ...formData, name: val })}
                  placeholder="Enter full name"
                  autoCapitalize="words"
                />
              ) : (
                <Text className={`text-[16px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>
                  {formData.name}
                </Text>
              )}
            </View>

            <View>
              <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-2 ${dark ? "text-white/50" : "text-ink/50"}`}>
                Email
              </Text>
              <Text className={`text-[16px] font-inter-semibold ${dark ? "text-white/55" : "text-ink/55"}`}>
                {user?.email || profile.email}
              </Text>
            </View>

            <View>
              <View className="flex-row items-center gap-2 mb-2">
                <Icon icon={PhoneIcon} size={16} color={dark ? "rgba(255,255,255,0.45)" : "rgba(10,10,14,0.45)"} />
                <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/50" : "text-ink/50"}`}>
                  Phone number
                </Text>
              </View>
              {editing ? (
                <TextField
                  value={formData.phone}
                  onChangeText={(val) => setFormData({ ...formData, phone: val })}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text className={`text-[16px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>
                  {formData.phone || "—"}
                </Text>
              )}
            </View>

            {editing && (
              <View className="gap-3 pt-2">
                <AppButton
                  title="Save Changes"
                  variant={dark ? "white" : "ink"}
                  loading={saving}
                  disabled={saving}
                  onPress={handleUpdateProfile}
                />
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

        {/* Sign out */}
        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.85}
          className={`mt-4 rounded-[24px] h-14 px-4 border items-center flex-row justify-center gap-2 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
        >
          <Icon icon={Logout01Icon} size={18} color="#D92D20" />
          <Text className="text-destructive font-inter-bold text-[15px]">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
