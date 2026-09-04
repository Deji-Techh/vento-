import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  Users,
  Store,
  ShoppingBag,
  Settings as SettingsIcon,
} from "lucide-react-native";

const mockStats = {
  totalUsers: 156,
  totalSellers: 24,
  totalOrders: 892,
  totalAgents: 8,
};

export default function AdminSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-6 gap-6">
      <View>
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
        <Text className="text-gray-500">Platform overview and configuration</Text>
      </View>

      {/* Platform Stats */}
      <View className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Platform Overview
        </Text>
        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
                <Users color="#000080" size={20} />
              </View>
              <Text className="text-gray-900">Total Users</Text>
            </View>
            <Text className="font-bold text-lg">{stats.totalUsers}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center">
                <Store color="#16A34A" size={20} />
              </View>
              <Text className="text-gray-900">Total Sellers</Text>
            </View>
            <Text className="font-bold text-lg">{stats.totalSellers}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-purple-50 items-center justify-center">
                <ShoppingBag color="#7C3AED" size={20} />
              </View>
              <Text className="text-gray-900">Total Orders</Text>
            </View>
            <Text className="font-bold text-lg">{stats.totalOrders}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-amber-50 items-center justify-center">
                <SettingsIcon color="#EAB308" size={20} />
              </View>
              <Text className="text-gray-900">Delivery Agents</Text>
            </View>
            <Text className="font-bold text-lg">{stats.totalAgents}</Text>
          </View>
        </View>
      </View>

      {/* Platform Settings */}
      <View className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Platform Configuration
        </Text>
        <View className="gap-3">
          <View className="flex-row items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
            <Text className="text-gray-900">Delivery Fee</Text>
            <Text className="font-medium">₦300 - ₦800</Text>
          </View>
          <View className="flex-row items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
            <Text className="text-gray-900">Platform Commission</Text>
            <Text className="font-medium">10%</Text>
          </View>
          <View className="flex-row items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
            <Text className="text-gray-900">Auto-assign Orders</Text>
            <View className="bg-green-100 px-2 py-0.5 rounded-full">
              <Text className="text-xs font-semibold text-green-700">
                Enabled
              </Text>
            </View>
          </View>
          <View className="flex-row items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
            <Text className="text-gray-900">Maintenance Mode</Text>
            <View className="bg-gray-100 px-2 py-0.5 rounded-full">
              <Text className="text-xs font-semibold text-gray-700">
                Disabled
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
