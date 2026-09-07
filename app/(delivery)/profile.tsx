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
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  Edit2,
  Package,
  TrendingUp,
  DollarSign,
  LogOut,
} from "lucide-react-native";
import { AppButton } from "../../src/components/ui/AppButton";

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
    router.replace("/onboarding" as any);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FAF5EA]">
        <ActivityIndicator size="large" color="#1B1B8F" />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <ScrollView className="flex-1 bg-[#FAF5EA] px-5 pt-14" contentContainerStyle={{ paddingBottom: 120 }}>
      <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-3">
        Account
      </Text>
      {/* Profile Header */}
      <View className="bg-white rounded-[28px] p-6 border border-[#E7E0D2] mb-4">
        <View className="items-center">
          <View className="w-24 h-24 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-4">
            <Text className="text-2xl text-ink font-bold">
              {profile.name?.charAt(0) || "U"}
            </Text>
          </View>
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-xl font-bold text-ink">{profile.name}</Text>
            <View className="bg-[#EDEDF7] px-3 py-1.5 rounded-full">
              <Text className="text-[11px] text-[#1B1B8F] font-bold uppercase tracking-[0.5px]">
                Rider
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Mail color="#6E6A75" size={16} />
            <Text className="text-sm text-ink/55">
              {user?.email || profile.email}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-white rounded-[26px] p-4 border border-[#E7E0D2]">
          <View className="w-10 h-10 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-2">
            <Package color="#1B1B8F" size={18} />
          </View>
          <Text className="text-2xl font-bold text-ink">
            {mockStats.totalDeliveries}
          </Text>
          <Text className="text-xs text-ink/55">Deliveries</Text>
        </View>
        <View className="flex-1 bg-white rounded-[26px] p-4 border border-[#E7E0D2]">
          <View className="w-10 h-10 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-2">
            <TrendingUp color="#12805C" size={18} />
          </View>
          <Text className="text-2xl font-bold text-ink">
            {mockStats.completedDeliveries}
          </Text>
          <Text className="text-xs text-ink/55">Completed</Text>
        </View>
        <View className="flex-1 bg-white rounded-[26px] p-4 border border-[#E7E0D2]">
          <View className="w-10 h-10 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mb-2">
            <DollarSign color="#1B1B8F" size={18} />
          </View>
          <Text className="text-base font-bold text-ink">
            ₦{mockStats.totalEarnings.toLocaleString()}
          </Text>
          <Text className="text-xs text-ink/55">Earnings</Text>
        </View>
      </View>

      {/* Profile Details */}
      <View className="bg-white rounded-[26px] p-6 border border-[#E7E0D2]">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-ink">Profile Details</Text>
          {!editing && (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              className="flex-row items-center gap-1.5 bg-[#FAF5EA] border border-[#E7E0D2] px-3 h-10 rounded-full"
            >
              <Edit2 color="#1B1B8F" size={14} />
              <Text className="text-sm text-[#1B1B8F] font-bold">Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="gap-4">
          <View>
            <View className="flex-row items-center gap-2 mb-2">
              <User color="#6E6A75" size={15} />
              <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55">Name</Text>
            </View>
            <TextInput
              value={formData.name}
              onChangeText={(val) => setFormData({ ...formData, name: val })}
              editable={editing}
              className={`bg-[#FAF5EA] rounded-full px-4 h-14 text-sm text-ink border ${editing ? "border-[#1B1B8F]" : "border-[#E7E0D2]"}`}
            />
          </View>

          <View>
            <View className="flex-row items-center gap-2 mb-2">
              <Phone color="#6E6A75" size={15} />
              <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55">Phone Number</Text>
            </View>
            <TextInput
              value={formData.phone}
              onChangeText={(val) => setFormData({ ...formData, phone: val })}
              editable={editing}
              placeholder="Enter phone number"
              placeholderTextColor="#9CA3AF"
              className={`bg-[#FAF5EA] rounded-full px-4 h-14 text-sm text-ink border ${editing ? "border-[#1B1B8F]" : "border-[#E7E0D2]"}`}
            />
          </View>

          {editing && (
            <View className="gap-3 pt-2">
              <AppButton title="Save Changes" variant="ink" onPress={handleUpdateProfile} />
              <TouchableOpacity
                onPress={() => {
                  setEditing(false);
                  setFormData({ name: profile.name, phone: profile.phone });
                }}
                className="w-full border border-[#E7E0D2] h-14 rounded-full items-center justify-center bg-white"
              >
                <Text className="text-ink font-bold">Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        onPress={handleSignOut}
        className="mt-4 bg-white rounded-[26px] p-4 border border-[#E7E0D2] items-center flex-row justify-center gap-2"
      >
        <LogOut size={16} color="#C0361F" />
        <Text className="text-[#C0361F] font-bold">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
