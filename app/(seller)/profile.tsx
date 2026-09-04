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
  ShoppingBag,
  Store,
  DollarSign,
} from "lucide-react-native";

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
  const { user, role: authRole, signOut } = useAuth();
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
    router.replace("/onboarding");
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <ScrollView className="flex-1 bg-white px-4 py-8">
      {/* Profile Header */}
      <View className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
        <View className="items-center">
          <View className="w-24 h-24 rounded-full bg-blue-900 items-center justify-center mb-4 border-4 border-blue-100">
            <Text className="text-2xl text-white font-bold">
              {profile.name?.charAt(0) || "U"}
            </Text>
          </View>
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-xl font-bold">{profile.name}</Text>
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="text-xs text-blue-900 font-medium capitalize">
                {profile.role}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Mail color="#9CA3AF" size={16} />
            <Text className="text-sm text-gray-500">
              {user?.email || profile.email}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="flex-row gap-3 mb-6">
        <View className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm text-gray-500">Total Orders</Text>
            <ShoppingBag color="#000080" size={20} />
          </View>
          <Text className="text-3xl font-bold">{mockStats.totalOrders}</Text>
        </View>
        <View className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm text-gray-500">Completed</Text>
            <Store color="#16A34A" size={20} />
          </View>
          <Text className="text-3xl font-bold">
            {mockStats.completedOrders}
          </Text>
        </View>
        <View className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm text-gray-500">Earnings</Text>
            <DollarSign color="#EAB308" size={20} />
          </View>
          <Text className="text-xl font-bold">
            ₦{mockStats.totalEarnings.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Profile Details */}
      <View className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold">Profile Details</Text>
          {!editing && (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              className="flex-row items-center gap-1"
            >
              <Edit2 color="#000080" size={16} />
              <Text className="text-sm text-blue-900 font-medium">Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="gap-4">
          <View>
            <View className="flex-row items-center gap-2 mb-1">
              <User color="#9CA3AF" size={16} />
              <Text className="text-sm text-gray-500">Name</Text>
            </View>
            <TextInput
              value={formData.name}
              onChangeText={(val) => setFormData({ ...formData, name: val })}
              editable={editing}
              className={`bg-white border rounded-lg px-3 py-2 text-sm ${
                editing ? "border-blue-900" : "border-gray-300"
              }`}
            />
          </View>

          <View>
            <View className="flex-row items-center gap-2 mb-1">
              <Phone color="#9CA3AF" size={16} />
              <Text className="text-sm text-gray-500">Phone Number</Text>
            </View>
            <TextInput
              value={formData.phone}
              onChangeText={(val) => setFormData({ ...formData, phone: val })}
              editable={editing}
              placeholder="Enter phone number"
              placeholderTextColor="#9CA3AF"
              className={`bg-white border rounded-lg px-3 py-2 text-sm ${
                editing ? "border-blue-900" : "border-gray-300"
              }`}
            />
          </View>

          <View>
            <View className="flex-row items-center gap-2 mb-1">
              <Store color="#9CA3AF" size={16} />
              <Text className="text-sm text-gray-500">Store Name</Text>
            </View>
            <TextInput
              value={profile.store_name}
              editable={false}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </View>

          {editing && (
            <View className="flex-row gap-2 pt-4">
              <TouchableOpacity
                onPress={handleUpdateProfile}
                disabled={loading}
                className="flex-1 bg-blue-900 h-10 rounded-lg items-center justify-center"
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text className="text-white font-semibold">
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setEditing(false);
                  setFormData({ name: profile.name, phone: profile.phone });
                }}
                className="flex-1 border border-gray-300 h-10 rounded-lg items-center justify-center"
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        onPress={handleSignOut}
        className="bg-gray-50 rounded-xl p-4 border border-gray-200 items-center"
      >
        <Text className="text-red-500 font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
