import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { AppButton } from "../../src/components/ui/AppButton";
import { Eyebrow } from "../../src/components/ui/SectionHeader";
import { Skeleton } from "../../src/components/ui/Skeleton";
import { Icon } from "../../src/components/ui/Icon";
import { UserIcon, PhoneIcon, Edit02Icon, Logout01Icon } from "../../src/components/icons";
import { toast } from "sonner-native";

const mockProfile = {
  id: "mock-buyer-001",
  name: "Chidi Okonkwo",
  email: "chidi@campus.edu",
  phone: "+2348000000003",
  role: "buyer",
};

export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useAuth();
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
    try {
      setSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProfile((prev: any) => ({ ...prev, name: formData.name, phone: formData.phone }));
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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-ink" edges={["top"]}>
        <View className="flex-1 px-6 pt-10 gap-4">
          <View className="items-center">
            <Skeleton width={96} height={96} radius={48} dark />
            <Skeleton width={180} height={24} radius={8} dark />
            <View className="mt-2" />
            <Skeleton width={140} height={14} radius={6} dark />
          </View>
          <Skeleton width="100%" height={90} radius={20} dark />
          <Skeleton width="100%" height={56} radius={28} dark />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) return null;

  return (
    <SafeAreaView className="flex-1 bg-ink" edges={["top"]}>
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 130, paddingTop: 8 }} showsVerticalScrollIndicator={false}>
        <View className="items-center pt-6 pb-8">
          <Eyebrow dark>Account</Eyebrow>
          <View className="w-24 h-24 rounded-full bg-white/10 items-center justify-center mt-4 mb-4 border-2 border-white">
            <Text className="text-3xl text-white font-inter-bold">{profile.name?.charAt(0) || "U"}</Text>
          </View>
          <Text className="text-white text-[24px] font-inter-bold tracking-tight text-center">{profile.name}</Text>
          <Text className="text-[11px] text-white/50 font-inter-bold uppercase tracking-[2px] mt-2 capitalize">
            {profile.role}
          </Text>
          <Text className="text-[13px] font-inter text-white/55 mt-1.5">{user?.email || profile.email}</Text>
        </View>

        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-[20px] font-inter-bold tracking-tight">Profile details</Text>
            {!editing && (
              <TouchableOpacity
                onPress={() => setEditing(true)}
                activeOpacity={0.85}
                className="flex-row items-center gap-1.5 bg-white/10 px-4 py-2 rounded-full"
              >
                <Icon icon={Edit02Icon} size={14} color="#fff" />
                <Text className="text-[13px] text-white font-inter-bold">Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="gap-7">
            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <Icon icon={UserIcon} size={16} color="rgba(255,255,255,0.45)" />
                <Text className="text-[11px] text-white/50 font-inter-bold uppercase tracking-[2px]">Name</Text>
              </View>
              <TextInput
                value={formData.name}
                onChangeText={(val) => setFormData({ ...formData, name: val })}
                editable={editing}
                placeholder="Enter your name"
                placeholderTextColor="rgba(255,255,255,0.35)"
                className="bg-transparent px-0 h-14 text-[16px] text-white font-inter-semibold border-b border-white/15"
                style={{ borderBottomWidth: 1 }}
              />
            </View>

            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <Icon icon={PhoneIcon} size={16} color="rgba(255,255,255,0.45)" />
                <Text className="text-[11px] text-white/50 font-inter-bold uppercase tracking-[2px]">Phone number</Text>
              </View>
              <TextInput
                value={formData.phone}
                onChangeText={(val) => setFormData({ ...formData, phone: val })}
                editable={editing}
                placeholder="Enter phone number"
                placeholderTextColor="rgba(255,255,255,0.35)"
                keyboardType="phone-pad"
                className="bg-transparent px-0 h-14 text-[16px] text-white font-inter-semibold border-b border-white/15"
                style={{ borderBottomWidth: 1 }}
              />
            </View>

            {editing && (
              <View className="gap-3 pt-3">
                <AppButton title="Save Changes" variant="white" loading={saving} onPress={handleUpdateProfile} />
                <TouchableOpacity
                  onPress={() => {
                    setEditing(false);
                    setFormData({ name: profile.name, phone: profile.phone });
                  }}
                  activeOpacity={0.85}
                  className="w-full h-14 rounded-full items-center justify-center border border-white/15 bg-white/10"
                >
                  <Text className="text-white font-inter-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.85}
          className="mt-1 rounded-full h-14 bg-white/10 border border-white/10 flex-row items-center justify-center gap-2"
        >
          <Icon icon={Logout01Icon} size={18} color="#fff" />
          <Text className="text-white font-inter-bold text-[15px]">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
