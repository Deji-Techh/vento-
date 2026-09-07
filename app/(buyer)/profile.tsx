import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  User,
  Phone,
  Edit2,
  LogOut,
} from "lucide-react-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { Eyebrow } from "../../src/components/ui/SectionHeader";

const mockProfile = {
  id: "mock-buyer-001",
  name: "Chidi Okonkwo",
  email: "chidi@campus.edu",
  phone: "+2348000000003",
  avatar_url: null,
  role: "buyer",
};

const mockOrderStats = {
  total: 12,
  completed: 10,
};

export default function Profile() {
  const router = useRouter();
  const { user, role: authRole, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [orderStats, setOrderStats] = useState({ total: 0, completed: 0 });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  useEffect(() => {
    setTimeout(() => {
      setProfile(mockProfile);
      setFormData({ name: mockProfile.name, phone: mockProfile.phone });
      setRole(mockProfile.role);
      setOrderStats(mockOrderStats);
      setLoading(false);
    }, 800);
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProfile((prev: any) => ({
        ...prev,
        name: formData.name,
        phone: formData.phone,
      }));
      Alert.alert("Success", "Profile updated successfully");
      setEditing(false);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/onboarding");
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-ink">
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <SafeAreaView className="flex-1 bg-ink" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header — editorial, no boxes */}
        <View className="items-center pt-6 pb-8">
          <Eyebrow dark>Account</Eyebrow>
          <View className="w-24 h-24 rounded-full bg-white/10 items-center justify-center mt-4 mb-4 border-2 border-white">
            <Text className="text-3xl text-white font-bold">
              {profile.name?.charAt(0) || "U"}
            </Text>
          </View>
          <Text className="text-white text-[24px] font-bold tracking-tight text-center">
            {profile.name}
          </Text>
          <Text className="text-[11px] text-white/50 font-bold uppercase tracking-[2px] mt-2 capitalize">
            {role}
          </Text>
          <Text className="text-sm text-white/55 mt-1.5">
            {user?.email || profile.email}
          </Text>
        </View>

        {/* Stats — plain numbers with dividers */}
        <View className="flex-row items-center border-y border-white/10 py-5 mb-8">
          <View className="flex-1 items-center">
            <Text className="text-white text-[28px] font-bold tracking-tight">
              {orderStats.total}
            </Text>
            <Text className="text-[11px] text-white/50 font-bold uppercase tracking-[2px] mt-1.5">
              Total orders
            </Text>
          </View>
          <View className="w-px self-stretch bg-white/10" />
          <View className="flex-1 items-center">
            <Text className="text-white text-[28px] font-bold tracking-tight">
              {orderStats.completed}
            </Text>
            <Text className="text-[11px] text-white/50 font-bold uppercase tracking-[2px] mt-1.5">
              Completed
            </Text>
          </View>
        </View>

        {/* Profile details — underline inputs */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-[21px] font-bold tracking-tight">
              Profile details
            </Text>
            {!editing && (
              <TouchableOpacity
                onPress={() => setEditing(true)}
                activeOpacity={0.85}
                className="flex-row items-center gap-1.5 bg-white/10 border border-white/10 px-4 py-2 rounded-full"
              >
                <Edit2 color="#FFFFFF" size={14} />
                <Text className="text-[13px] text-white font-bold">Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="gap-7">
            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <User color="rgba(255,255,255,0.45)" size={16} />
                <Text className="text-[11px] text-white/50 font-bold uppercase tracking-[2px]">
                  Name
                </Text>
              </View>
              <TextInput
                value={formData.name}
                onChangeText={(val) => setFormData({ ...formData, name: val })}
                editable={editing}
                placeholder="Enter your name"
                placeholderTextColor="rgba(255,255,255,0.35)"
                className="bg-transparent border-b px-0 h-14 text-[16px] text-white font-semibold border-white/15"
                style={{ borderBottomWidth: 1 }}
              />
            </View>

            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <Phone color="rgba(255,255,255,0.45)" size={16} />
                <Text className="text-[11px] text-white/50 font-bold uppercase tracking-[2px]">
                  Phone number
                </Text>
              </View>
              <TextInput
                value={formData.phone}
                onChangeText={(val) => setFormData({ ...formData, phone: val })}
                editable={editing}
                placeholder="Enter phone number"
                placeholderTextColor="rgba(255,255,255,0.35)"
                keyboardType="phone-pad"
                className="bg-transparent border-b px-0 h-14 text-[16px] text-white font-semibold border-white/15"
                style={{ borderBottomWidth: 1 }}
              />
            </View>

            {editing && (
              <View className="gap-3 pt-3">
                <AppButton
                  title="Save Changes"
                  variant="white"
                  loading={loading}
                  onPress={handleUpdateProfile}
                />
                <TouchableOpacity
                  onPress={() => {
                    setEditing(false);
                    setFormData({ name: profile.name, phone: profile.phone });
                  }}
                  activeOpacity={0.85}
                  className="w-full h-14 rounded-full items-center justify-center border border-white/15 bg-white/10"
                >
                  <Text className="text-white font-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Sign out — ghost */}
        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.85}
          className="mt-1 rounded-full h-14 bg-white/10 border border-white/10 flex-row items-center justify-center gap-2"
        >
          <LogOut color="#FFFFFF" size={18} />
          <Text className="text-white font-bold text-[15px]">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
