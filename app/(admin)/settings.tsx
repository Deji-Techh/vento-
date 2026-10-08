import { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { Eyebrow, SectionHeader, StatusChip } from "../../src/components/ui/SectionHeader";
import { AppearanceCard } from "../../src/components/ui/Settings";
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
  const { dark } = useTheme();
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
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
        </View>
      </SafeAreaView>
    );
  }

  const overview = [
    { label: "Total Users", value: stats.totalUsers, icon: UsersIcon, tint: dark ? "#fff" : "#0A0A0E" },
    { label: "Total Sellers", value: stats.totalSellers, icon: Store01Icon, tint: "#12805C" },
    { label: "Total Orders", value: stats.totalOrders, icon: ReceiptIcon, tint: dark ? "#fff" : "#0A0A0E" },
    { label: "Delivery Agents", value: stats.totalAgents, icon: UsersIcon, tint: "#B54708" },
  ];

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 12, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Eyebrow>Configuration</Eyebrow>
          <Text className={`text-[28px] font-inter-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>
            Settings
          </Text>
          <Text className={`text-[13px] font-inter mt-1 ${dark ? "text-white/55" : "text-ink/55"}`}>
            {user?.email ? `${user.email} • ` : ""}Platform overview and configuration
          </Text>
        </View>

        <AppearanceCard />

        {/* Platform stats */}
        <View className={`rounded-[28px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <View className="flex-row items-center gap-2 mb-4">
            <Icon icon={ChartLineIcon} size={18} color={dark ? "#fff" : "#0A0A0E"} />
            <Eyebrow>Platform overview</Eyebrow>
          </View>
          <View className="gap-4">
            {overview.map((row) => (
              <View key={row.label} className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className={`w-11 h-11 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                    <Icon icon={row.icon} size={20} color={row.tint} />
                  </View>
                  <Text className={`font-inter-semibold text-[14px] ${dark ? "text-white" : "text-ink"}`}>
                    {row.label}
                  </Text>
                </View>
                <Text className={`font-inter-bold text-[18px] ${dark ? "text-white" : "text-ink"}`}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Platform configuration */}
        <View>
          <SectionHeader title="Platform configuration" />
          <View className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className="gap-3">
              <View className={`flex-row items-center justify-between border rounded-full px-5 h-14 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                <View className="flex-row items-center gap-2">
                  <Icon icon={Wallet01Icon} size={16} color={dark ? "rgba(255,255,255,0.6)" : "#6E6A75"} />
                  <Text className={`font-inter-semibold text-[14px] ${dark ? "text-white" : "text-ink"}`}>
                    Delivery Fee
                  </Text>
                </View>
                <Text className={`font-inter-bold text-[14px] ${dark ? "text-white" : "text-ink"}`}>₦300 - ₦800</Text>
              </View>
              <View className={`flex-row items-center justify-between border rounded-full px-5 h-14 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                <View className="flex-row items-center gap-2">
                  <Icon icon={ChartLineIcon} size={16} color={dark ? "rgba(255,255,255,0.6)" : "#6E6A75"} />
                  <Text className={`font-inter-semibold text-[14px] ${dark ? "text-white" : "text-ink"}`}>
                    Platform Commission
                  </Text>
                </View>
                <Text className={`font-inter-bold text-[14px] ${dark ? "text-white" : "text-ink"}`}>10%</Text>
              </View>
              <View className={`flex-row items-center justify-between border rounded-full px-5 h-14 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                <View className="flex-row items-center gap-2">
                  <Icon icon={ShieldCheckIcon} size={16} color={dark ? "rgba(255,255,255,0.6)" : "#6E6A75"} />
                  <Text className={`font-inter-semibold text-[14px] ${dark ? "text-white" : "text-ink"}`}>
                    Auto-assign Orders
                  </Text>
                </View>
                <StatusChip label="Enabled" tone="success" />
              </View>
              <View className={`flex-row items-center justify-between border rounded-full px-5 h-14 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                <View className="flex-row items-center gap-2">
                  <Icon icon={Settings01Icon} size={16} color={dark ? "rgba(255,255,255,0.6)" : "#6E6A75"} />
                  <Text className={`font-inter-semibold text-[14px] ${dark ? "text-white" : "text-ink"}`}>
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
