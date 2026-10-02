import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import {
  UserIcon,
  PhoneIcon,
  Edit02Icon,
  Logout01Icon,
  Package01Icon,
  ChartLineIcon,
  BanknoteIcon,
} from "../../src/components/icons";

const mockProfile = {
  id: "mock-agent-001",
  name: "Emeka Rider",
  email: "emeka@campus.edu",
  phone: "+2348000000004",
  avatar_url: null,
  role: "delivery_agent",
};

const mockStats = {
  totalDeliveries: 23,
  completedDeliveries: 21,
  totalEarnings: 45000,
};

export default function DeliveryProfile() {
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
      setProfile((prev: any) => ({
        ...prev,
        name: formData.name,
        phone: formData.phone,
      }));
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
    router.replace("/onboarding" as any);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-cream">
        <ActivityIndicator size="large" color="#0A0A0E" />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <ScrollView className="flex-1 bg-cream px-5 pt-14" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <Eyebrow>Account</Eyebrow>

      {/* Profile header */}
      <View className="bg-white rounded-[28px] p-6 border border-border mt-4 mb-4">
        <View className="items-center">
          <View className="w-24 h-24 rounded-full bg-cream border border-border items-center justify-center mb-4">
            <Text className="text-[28px] text-ink font-inter-bold">
              {profile.name?.charAt(0) || "U"}
            </Text>
          </View>
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-[20px] font-inter-bold text-ink tracking-tight">{profile.name}</Text>
            <StatusChip label="Rider" tone="info" />
          </View>
          <Text className="text-[13px] font-inter text-ink/55">
            {user?.email || profile.email}
          </Text>
        </View>
      </View>

      {/* Stats cards */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-white rounded-[24px] p-4 border border-border">
          <View className="w-10 h-10 rounded-full bg-cream border border-border items-center justify-center mb-2">
            <Icon icon={Package01Icon} size={18} color="#0A0A0E" />
          </View>
          <Text className="text-[20px] font-inter-bold text-ink">
            {mockStats.totalDeliveries}
          </Text>
          <Text className="text-[12px] font-inter text-ink/55">Deliveries</Text>
        </View>
        <View className="flex-1 bg-white rounded-[24px] p-4 border border-border">
          <View className="w-10 h-10 rounded-full bg-cream border border-border items-center justify-center mb-2">
            <Icon icon={ChartLineIcon} size={18} color="#12805C" />
          </View>
          <Text className="text-[20px] font-inter-bold text-ink">
            {mockStats.completedDeliveries}
          </Text>
          <Text className="text-[12px] font-inter text-ink/55">Completed</Text>
        </View>
        <View className="flex-1 bg-white rounded-[24px] p-4 border border-border">
          <View className="w-10 h-10 rounded-full bg-cream border border-border items-center justify-center mb-2">
            <Icon icon={BanknoteIcon} size={18} color="#0A0A0E" />
          </View>
          <Text className="text-[16px] font-inter-bold text-ink">
            ₦{mockStats.totalEarnings.toLocaleString()}
          </Text>
          <Text className="text-[12px] font-inter text-ink/55">Earnings</Text>
        </View>
      </View>

      {/* Profile details */}
      <View className="bg-white rounded-[24px] p-6 border border-border">
        <View className="flex-row items-center justify-between mb-5">
          <Text className="text-[18px] font-inter-bold text-ink tracking-tight">Profile details</Text>
          {!editing && (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              activeOpacity={0.85}
              className="flex-row items-center gap-1.5 bg-cream border border-border px-4 h-10 rounded-full"
            >
              <Icon icon={Edit02Icon} size={14} color="#0A0A0E" />
              <Text className="text-[13px] text-ink font-inter-bold">Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="gap-5">
          <View>
            <View className="flex-row items-center gap-2 mb-2">
              <Icon icon={UserIcon} size={16} color="rgba(10,10,14,0.45)" />
              <Text className="text-[11px] font-inter-bold uppercase tracking-[2px] text-ink/55">Name</Text>
            </View>
            {editing ? (
              <TextField
                value={formData.name}
                onChangeText={(val) => setFormData({ ...formData, name: val })}
                placeholder="Enter your name"
                dark={false}
              />
            ) : (
              <View className="bg-cream rounded-[20px] px-4 h-14 justify-center border border-border">
                <Text className="text-[15px] font-inter-semibold text-ink">{formData.name}</Text>
              </View>
            )}
          </View>

          <View>
            <View className="flex-row items-center gap-2 mb-2">
              <Icon icon={PhoneIcon} size={16} color="rgba(10,10,14,0.45)" />
              <Text className="text-[11px] font-inter-bold uppercase tracking-[2px] text-ink/55">Phone number</Text>
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
              <View className="bg-cream rounded-[20px] px-4 h-14 justify-center border border-border">
                <Text className="text-[15px] font-inter-semibold text-ink">{formData.phone}</Text>
              </View>
            )}
          </View>

          {editing && (
            <View className="gap-3 pt-2">
              <AppButton title="Save Changes" variant="ink" loading={saving} onPress={handleUpdateProfile} />
              <TouchableOpacity
                onPress={() => {
                  setEditing(false);
                  setFormData({ name: profile.name, phone: profile.phone });
                }}
                activeOpacity={0.85}
                className="w-full border border-border h-14 rounded-full items-center justify-center bg-white"
              >
                <Text className="text-ink font-inter-bold">Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Sign out */}
      <TouchableOpacity
        onPress={handleSignOut}
        activeOpacity={0.85}
        className="mt-4 bg-white rounded-[24px] p-4 border border-border items-center flex-row justify-center gap-2"
      >
        <Icon icon={Logout01Icon} size={16} color="#D92D20" />
        <Text className="text-destructive font-inter-bold">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
