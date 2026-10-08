import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { AppButton } from "../../src/components/ui/AppButton";
import { Eyebrow } from "../../src/components/ui/SectionHeader";
import { Skeleton } from "../../src/components/ui/Skeleton";
import { Icon } from "../../src/components/ui/Icon";
import { UserIcon, PhoneIcon, Edit02Icon, Logout01Icon, Settings01Icon } from "../../src/components/icons";
import { toast } from "sonner-native";

export default function Profile() {
  const router = useRouter();
  const { user, signOut, loading: authLoading, profile: authProfile, refreshProfile } = useAuth();
  const { dark } = useTheme();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });

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
    router.replace("/onboarding");
  };

  if (authLoading || (user && !authProfile)) {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 px-6 pt-10 gap-4">
          <View className="items-center">
            <Skeleton width={96} height={96} radius={48} />
            <Skeleton width={180} height={24} radius={8} />
            <View className="mt-2" />
            <Skeleton width={140} height={14} radius={6} />
          </View>
          <Skeleton width="100%" height={90} radius={20} />
          <Skeleton width="100%" height={56} radius={28} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 px-6 pt-10 pb-8 items-center justify-center">
          <View className={`w-[88px] h-[88px] rounded-full items-center justify-center mb-6 ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}>
            <Icon icon={UserIcon} size={34} color={dark ? "#fff" : "#0A0A0E"} />
          </View>
          <Text className={`text-[24px] font-inter-bold tracking-tight text-center ${dark ? "text-white" : "text-ink"}`}>
            You're browsing{"\n"}as a guest
          </Text>
          <Text className={`text-[14px] font-inter mt-3 text-center leading-[21px] max-w-[260px] ${dark ? "text-white/55" : "text-ink/55"}`}>
            Sign in to checkout, track orders and keep your bag in sync.
          </Text>
          <View className="w-full mt-8 gap-3">
            <AppButton title="Sign in" variant={dark ? "white" : "ink"} onPress={() => router.push("/auth/login")} />
            <AppButton title="Create account" variant={dark ? "ghost-dark" : "ghost-light"} onPress={() => router.push("/auth/signup")} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const profile = authProfile!;

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 130, paddingTop: 8 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between pt-2">
          <View className="w-11" />
          <Eyebrow>Account</Eyebrow>
          <TouchableOpacity
            onPress={() => router.push("/(buyer)/settings" as any)}
            className={`w-11 h-11 rounded-full items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}
          >
            <Icon icon={Settings01Icon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
          </TouchableOpacity>
        </View>

        <View className="items-center pt-4 pb-8">
          <View className={`w-24 h-24 rounded-full items-center justify-center mt-4 mb-4 border-2 ${dark ? "bg-white/10 border-white" : "bg-ink/[0.05] border-ink"}`}>
            <Text className={`text-3xl font-inter-bold ${dark ? "text-white" : "text-ink"}`}>{profile.name?.charAt(0) || "U"}</Text>
          </View>
          <Text className={`text-[24px] font-inter-bold tracking-tight text-center ${dark ? "text-white" : "text-ink"}`}>{profile.name}</Text>
          <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mt-2 capitalize ${dark ? "text-white/50" : "text-ink/50"}`}>
            {profile.role}
          </Text>
          <Text className={`text-[13px] font-inter mt-1.5 ${dark ? "text-white/55" : "text-ink/55"}`}>{user?.email || profile.email}</Text>
        </View>

        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className={`text-[20px] font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Profile details</Text>
            {!editing && (
              <TouchableOpacity
                onPress={() => setEditing(true)}
                activeOpacity={0.85}
                className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}
              >
                <Icon icon={Edit02Icon} size={14} color={dark ? "#fff" : "#0A0A0E"} />
                <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="gap-7">
            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <Icon icon={UserIcon} size={16} color={dark ? "rgba(255,255,255,0.45)" : "rgba(10,10,14,0.45)"} />
                <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/50" : "text-ink/50"}`}>Name</Text>
              </View>
              <TextInput
                value={formData.name}
                onChangeText={(val) => setFormData({ ...formData, name: val })}
                editable={editing}
                placeholder="Enter your name"
                placeholderTextColor={dark ? "rgba(255,255,255,0.35)" : "rgba(10,10,14,0.35)"}
                className={`bg-transparent px-0 h-14 text-[16px] font-inter-semibold border-b ${dark ? "text-white border-white/15" : "text-ink border-ink/15"}`}
                style={{ borderBottomWidth: 1 }}
              />
            </View>

            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <Icon icon={PhoneIcon} size={16} color={dark ? "rgba(255,255,255,0.45)" : "rgba(10,10,14,0.45)"} />
                <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/50" : "text-ink/50"}`}>Phone number</Text>
              </View>
              <TextInput
                value={formData.phone}
                onChangeText={(val) => setFormData({ ...formData, phone: val })}
                editable={editing}
                placeholder="Enter phone number"
                placeholderTextColor={dark ? "rgba(255,255,255,0.35)" : "rgba(10,10,14,0.35)"}
                keyboardType="phone-pad"
                className={`bg-transparent px-0 h-14 text-[16px] font-inter-semibold border-b ${dark ? "text-white border-white/15" : "text-ink border-ink/15"}`}
                style={{ borderBottomWidth: 1 }}
              />
            </View>

            {editing && (
              <View className="gap-3 pt-3">
                <AppButton title="Save Changes" variant={dark ? "white" : "ink"} loading={saving} onPress={handleUpdateProfile} />
                <TouchableOpacity
                  onPress={() => {
                    setEditing(false);
                    setFormData({ name: profile.name, phone: profile.phone || "" });
                  }}
                  activeOpacity={0.85}
                  className={`w-full h-14 rounded-full items-center justify-center border ${dark ? "border-white/15 bg-white/10" : "border-ink/10 bg-ink/[0.04]"}`}
                >
                  <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.85}
          className={`mt-1 rounded-full h-14 border flex-row items-center justify-center gap-2 ${dark ? "bg-white/10 border-white/10" : "bg-ink/[0.04] border-ink/10"}`}
        >
          <Icon icon={Logout01Icon} size={18} color={dark ? "#fff" : "#0A0A0E"} />
          <Text className={`font-inter-bold text-[15px] ${dark ? "text-white" : "text-ink"}`}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
