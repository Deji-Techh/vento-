import { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { Eyebrow, SectionHeader, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import {
  UsersIcon,
  Store01Icon,
  ReceiptIcon,
  Settings01Icon,
  ShieldCheckIcon,
  Wallet01Icon,
  ChartLineIcon,
} from "../../src/components/icons";

const mockStats = {
  totalUsers: 156,
  totalSellers: 24,
  totalOrders: 892,
  totalAgents: 8,
};

export default function AdminSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats] = useState(mockStats);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1B1B8F" />
        </View>
      </SafeAreaView>
    );
  }

  const overview = [
    { label: "Total Users", value: stats.totalUsers, icon: UsersIcon, tint: "#1B1B8F" },
    { label: "Total Sellers", value: stats.totalSellers, icon: Store01Icon, tint: "#12805C" },
    { label: "Total Orders", value: stats.totalOrders, icon: ReceiptIcon, tint: "#1B1B8F" },
    { label: "Delivery Agents", value: stats.totalAgents, icon: Settings01Icon, tint: "#1B1B8F" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 12, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Eyebrow>Configuration</Eyebrow>
          <Text className="text-[28px] font-inter-bold text-ink tracking-tight mt-1">
            Settings
          </Text>
          <Text className="text-[13px] font-inter text-ink/55 mt-1">
            {user?.email ? `${user.email} • ` : ""}Platform overview and configuration
          </Text>
        </View>

        {/* Platform stats */}
        <View className="bg-white rounded-[28px] p-6 border border-border">
          <View className="flex-row items-center gap-2 mb-4">
            <Icon icon={ChartLineIcon} size={18} color="#1B1B8F" />
            <Eyebrow>Platform overview</Eyebrow>
          </View>
          <View className="gap-4">
            {overview.map((row) => (
              <View key={row.label} className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="w-11 h-11 rounded-full bg-cream border border-border items-center justify-center">
                    <Icon icon={row.icon} size={20} color={row.tint} />
                  </View>
                  <Text className="text-ink font-inter-semibold text-[14px]">
                    {row.label}
                  </Text>
                </View>
                <Text className="font-inter-bold text-[18px] text-ink">{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Platform configuration */}
        <View>
          <SectionHeader title="Platform configuration" />
          <View className="bg-white rounded-[24px] p-6 border border-border">
            <View className="gap-3">
              <View className="flex-row items-center justify-between bg-cream border border-border rounded-full px-5 h-14">
                <View className="flex-row items-center gap-2">
                  <Icon icon={Wallet01Icon} size={16} color="#6E6A75" />
                  <Text className="text-ink font-inter-semibold text-[14px]">
                    Delivery Fee
                  </Text>
                </View>
                <Text className="font-inter-bold text-ink text-[14px]">₦300 - ₦800</Text>
              </View>
              <View className="flex-row items-center justify-between bg-cream border border-border rounded-full px-5 h-14">
                <View className="flex-row items-center gap-2">
                  <Icon icon={ChartLineIcon} size={16} color="#6E6A75" />
                  <Text className="text-ink font-inter-semibold text-[14px]">
                    Platform Commission
                  </Text>
                </View>
                <Text className="font-inter-bold text-ink text-[14px]">10%</Text>
              </View>
              <View className="flex-row items-center justify-between bg-cream border border-border rounded-full px-5 h-14">
                <View className="flex-row items-center gap-2">
                  <Icon icon={ShieldCheckIcon} size={16} color="#6E6A75" />
                  <Text className="text-ink font-inter-semibold text-[14px]">
                    Auto-assign Orders
                  </Text>
                </View>
                <StatusChip label="Enabled" tone="success" />
              </View>
              <View className="flex-row items-center justify-between bg-cream border border-border rounded-full px-5 h-14">
                <View className="flex-row items-center gap-2">
                  <Icon icon={Settings01Icon} size={16} color="#6E6A75" />
                  <Text className="text-ink font-inter-semibold text-[14px]">
                    Maintenance Mode
                  </Text>
                </View>
                <StatusChip label="Disabled" tone="neutral" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
