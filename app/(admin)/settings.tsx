import { useState, useEffect } from "react";
import {
  View,
  Text,
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
      <View className="flex-1 items-center justify-center bg-[#FAF5EA]">
        <ActivityIndicator size="large" color="#1B1B8F" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#FAF5EA] px-5 pt-14" contentContainerStyle={{ paddingBottom: 120, gap: 16 }}>
      <View>
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">
          Configuration
        </Text>
        <Text className="text-[28px] font-bold text-ink mt-1">Settings</Text>
        <Text className="text-sm text-ink/55">Platform overview and configuration</Text>
      </View>

      {/* Platform Stats white card */}
      <View className="bg-white rounded-[28px] p-6 border border-[#E7E0D2]">
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-4">
          Platform Overview
        </Text>
        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
                <Users color="#1B1B8F" size={20} />
              </View>
              <Text className="text-ink font-semibold">Total Users</Text>
            </View>
            <Text className="font-bold text-lg text-ink">{stats.totalUsers}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
                <Store color="#12805C" size={20} />
              </View>
              <Text className="text-ink font-semibold">Total Sellers</Text>
            </View>
            <Text className="font-bold text-lg text-ink">{stats.totalSellers}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
                <ShoppingBag color="#1B1B8F" size={20} />
              </View>
              <Text className="text-ink font-semibold">Total Orders</Text>
            </View>
            <Text className="font-bold text-lg text-ink">{stats.totalOrders}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
                <SettingsIcon color="#1B1B8F" size={20} />
              </View>
              <Text className="text-ink font-semibold">Delivery Agents</Text>
            </View>
            <Text className="font-bold text-lg text-ink">{stats.totalAgents}</Text>
          </View>
        </View>
      </View>

      {/* Platform Settings */}
      <View className="bg-white rounded-[28px] p-6 border border-[#E7E0D2]">
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55 mb-4">
          Platform Configuration
        </Text>
        <View className="gap-3">
          <View className="flex-row items-center justify-between bg-[#FAF5EA] border border-[#E7E0D2] rounded-full px-5 h-14">
            <Text className="text-ink font-semibold text-sm">Delivery Fee</Text>
            <Text className="font-bold text-ink text-sm">₦300 - ₦800</Text>
          </View>
          <View className="flex-row items-center justify-between bg-[#FAF5EA] border border-[#E7E0D2] rounded-full px-5 h-14">
            <Text className="text-ink font-semibold text-sm">Platform Commission</Text>
            <Text className="font-bold text-ink text-sm">10%</Text>
          </View>
          <View className="flex-row items-center justify-between bg-[#FAF5EA] border border-[#E7E0D2] rounded-full px-5 h-14">
            <Text className="text-ink font-semibold text-sm">Auto-assign Orders</Text>
            <View className="bg-[#E3F2E8] px-3 py-1.5 rounded-full">
              <Text className="text-[11px] font-bold text-[#12805C]">
                Enabled
              </Text>
            </View>
          </View>
          <View className="flex-row items-center justify-between bg-[#FAF5EA] border border-[#E7E0D2] rounded-full px-5 h-14">
            <Text className="text-ink font-semibold text-sm">Maintenance Mode</Text>
            <View className="bg-white border border-[#E7E0D2] px-3 py-1.5 rounded-full">
              <Text className="text-[11px] font-bold text-ink/55">
                Disabled
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
