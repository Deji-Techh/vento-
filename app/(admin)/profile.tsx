import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
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

const mockProfile = {
  id: "mock-admin-001",
  name: "Admin Vento",
  email: "admin@vento.com",
  phone: "+2348000000001",
  avatar_url: null,
  role: "admin",
};

export default function AdminProfile() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  useEffect(() => {
    const t = setTimeout(() => {
      setProfile(mockProfile);
      setFormData({ name: mockProfile.name, phone: mockProfile.phone });
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProfile((prev: any) => ({
        ...prev,
        name: formData.name,
        phone: formData.phone,
      }));
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
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/onboarding" as any);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
        <View className="flex-1 px-5 pt-10 gap-4">
          <View className="items-center">
            <Skeleton width={96} height={96} radius={48} dark={false} />
            <View className="mt-3" />
            <Skeleton width={180} height={24} radius={8} dark={false} />
            <View className="mt-2" />
            <Skeleton width={140} height={14} radius={6} dark={false} />
          </View>
          <Skeleton width="100%" height={90} radius={24} dark={false} />
          <Skeleton width="100%" height={56} radius={28} dark={false} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) return null;

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
      >
        <Eyebrow>Account</Eyebrow>

        {/* Profile header */}
        <View className="bg-white rounded-[28px] p-6 border border-border mt-3 mb-4">
          <View className="items-center">
            <View className="w-24 h-24 rounded-full bg-cream border border-border items-center justify-center mb-4">
              <Text className="text-[28px] text-ink font-inter-bold">
                {profile.name?.charAt(0) || "A"}
              </Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-[20px] font-inter-bold text-ink tracking-tight">
                {profile.name}
              </Text>
              <View className="bg-primary/10 px-3 py-1.5 rounded-full flex-row items-center gap-1">
                <Icon icon={ShieldCheckIcon} size={12} color="#1B1B8F" />
                <Text className="text-[11px] text-primary font-inter-bold uppercase tracking-[0.5px]">
                  Admin
                </Text>
              </View>
            </View>
            <Text className="text-[13px] font-inter text-ink/55">
              {user?.email || profile.email}
            </Text>
          </View>
        </View>

        {/* Profile details */}
        <View className="bg-white rounded-[24px] p-6 border border-border">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-[20px] font-inter-bold text-ink tracking-tight">
              Profile details
            </Text>
            {!editing && (
              <TouchableOpacity
                onPress={() => setEditing(true)}
                activeOpacity={0.85}
                className="flex-row items-center gap-1.5 bg-cream border border-border px-4 py-2.5 rounded-full"
              >
                <Icon icon={Edit02Icon} size={14} color="#1B1B8F" />
                <Text className="text-[13px] text-primary font-inter-bold">Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="gap-5">
            <View>
              <View className="flex-row items-center gap-2 mb-2">
                <Icon icon={UserIcon} size={16} color="rgba(10,10,14,0.45)" />
                <Text className="text-[11px] text-ink/50 font-inter-bold uppercase tracking-[2px]">
                  Name
                </Text>
              </View>
              {editing ? (
                <TextField
                  value={formData.name}
                  onChangeText={(val) => setFormData({ ...formData, name: val })}
                  placeholder="Enter full name"
                  autoCapitalize="words"
                  dark={false}
                />
              ) : (
                <Text className="text-[16px] font-inter-semibold text-ink">
                  {formData.name}
                </Text>
              )}
            </View>

            <View>
              <Text className="text-[11px] text-ink/50 font-inter-bold uppercase tracking-[2px] mb-2">
                Email
              </Text>
              <Text className="text-[16px] font-inter-semibold text-ink/55">
                {user?.email || profile.email}
              </Text>
            </View>

            <View>
              <View className="flex-row items-center gap-2 mb-2">
                <Icon icon={PhoneIcon} size={16} color="rgba(10,10,14,0.45)" />
                <Text className="text-[11px] text-ink/50 font-inter-bold uppercase tracking-[2px]">
                  Phone number
                </Text>
              </View>
              {editing ? (
                <TextField
                  value={formData.phone}
                  onChangeText={(val) => setFormData({ ...formData, phone: val })}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  dark={false}
                />
              ) : (
                <Text className="text-[16px] font-inter-semibold text-ink">
                  {formData.phone || "—"}
                </Text>
              )}
            </View>

            {editing && (
              <View className="gap-3 pt-2">
                <AppButton
                  title="Save Changes"
                  variant="ink"
                  loading={saving}
                  disabled={saving}
                  onPress={handleUpdateProfile}
                />
                <AppButton
                  title="Cancel"
                  variant="ghost-light"
                  onPress={() => {
                    setEditing(false);
                    setFormData({ name: profile.name, phone: profile.phone });
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
          className="mt-4 bg-white rounded-[24px] h-14 px-4 border border-border items-center flex-row justify-center gap-2"
        >
          <Icon icon={Logout01Icon} size={18} color="#D92D20" />
          <Text className="text-destructive font-inter-bold text-[15px]">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
