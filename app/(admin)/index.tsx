import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { Eyebrow, SectionHeader, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import {
  DashboardSquare01Icon,
  UsersIcon,
  Store01Icon,
  ReceiptIcon,
  Clock01Icon,
  CheckmarkCircle01Icon,
  Delete02Icon,
  DeliveryBox01Icon,
} from "../../src/components/icons";

const mockStats = {
  totalUsers: 156,
  totalSellers: 24,
  pendingSellers: 3,
  totalOrders: 892,
};

const mockPendingSellers = [
  {
    id: "seller-pending-001",
    store_name: "Mama Nkechi's Spot",
    verification_status: "documents_submitted",
    description: "Traditional Nigerian home cooking",
    profiles: { name: "Nkechi Okoro", phone: "+2348012345681" },
  },
  {
    id: "seller-pending-002",
    store_name: "Smoothie King",
    verification_status: "pending",
    description: "Fresh fruit smoothies and juices",
    profiles: { name: "Tunde Bakare", phone: "+2348012345682" },
  },
];

const mockActivities = [
  {
    id: "act-001",
    action_type: "seller_approved",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    profiles: { name: "Admin User" },
  },
  {
    id: "act-002",
    action_type: "document_approved",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    profiles: { name: "Admin User" },
  },
];

const activityLabels: Record<string, string> = {
  seller_approved: "Seller Approved",
  seller_rejected: "Seller Rejected",
  document_approved: "Document Approved",
  document_rejected: "Document Rejected",
};

function verificationTone(status: string): "warning" | "info" | "neutral" {
  if (status === "documents_submitted") return "warning";
  if (status === "pending") return "info";
  return "neutral";
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { dark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats] = useState(mockStats);
  const [pendingSellers, setPendingSellers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPendingSellers(mockPendingSellers);
      setActivities(mockActivities);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const handleApproval = (sellerId: string, approve: boolean) => {
    setPendingSellers((prev) => prev.filter((s) => s.id !== sellerId));
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(
        approve
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      ).catch(() => {});
    }
    if (approve) {
      toast.success("Seller approved");
    } else {
      toast.success("Seller rejected");
    }
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#1B1B8F"} />
        </View>
      </SafeAreaView>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: UsersIcon, tint: "#1B1B8F" },
    { label: "Total Sellers", value: stats.totalSellers, icon: Store01Icon, tint: "#12805C" },
    { label: "Pending", value: stats.pendingSellers, icon: Clock01Icon, tint: "#1B1B8F" },
    { label: "Total Orders", value: stats.totalOrders, icon: ReceiptIcon, tint: "#1B1B8F" },
  ];

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 12, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Eyebrow>Platform</Eyebrow>
          <Text className={`text-[28px] font-inter-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>
            Admin
          </Text>
          <Text className={`text-[13px] font-inter mt-1 ${dark ? "text-white/55" : "text-ink/55"}`}>
            {user?.email ? `${user.email} • ` : ""}Manage your Vento platform
          </Text>
        </View>

        {/* Summary hero */}
        <View className={`rounded-[28px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <View className="flex-row items-center gap-2">
            <Icon icon={DashboardSquare01Icon} size={18} color="#1B1B8F" />
            <Eyebrow>Platform at a glance</Eyebrow>
          </View>
          <Text className={`text-[22px] font-inter-bold tracking-tight mt-3 ${dark ? "text-white" : "text-ink"}`}>
            {stats.totalOrders} orders • {stats.totalUsers} users
          </Text>
          <View className="flex-row gap-2 mt-4">
            <StatusChip label={`${stats.pendingSellers} pending`} tone="warning" />
            <StatusChip label={`${stats.totalSellers} sellers`} tone="info" />
          </View>
        </View>

        {/* Stats grid */}
        <View className="flex-row flex-wrap gap-3">
          {statCards.map((s) => (
            <View
              key={s.label}
              className={`rounded-[24px] p-5 border flex-1 min-w-[45%] ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
            >
              <View className={`w-11 h-11 rounded-full border items-center justify-center mb-2 ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                <Icon icon={s.icon} size={20} color={s.tint} />
              </View>
              <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>{s.label}</Text>
              <Text className={`text-[20px] font-inter-bold mt-0.5 ${dark ? "text-white" : "text-ink"}`}>
                {s.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <View className={`rounded-[24px] border p-6 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-4 ${dark ? "text-white/50" : "text-ink/50"}`}>
            Quick Actions
          </Text>
          <AppButton
            title="Manage Delivery Agents"
            variant={dark ? "white" : "ink"}
            onPress={() => router.push("/(admin)/users" as any)}
          />
        </View>

        {/* Pending sellers */}
        {pendingSellers.length > 0 && (
          <View>
            <SectionHeader title="Pending approvals" action={`${pendingSellers.length}`} />
            <View className="gap-3">
              {pendingSellers.map((seller) => (
                <View
                  key={seller.id}
                  className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
                >
                  <View className="mb-4">
                    <View className="flex-row items-center gap-2 mb-1.5 flex-wrap">
                      <Text className={`font-inter-bold text-[15px] ${dark ? "text-white" : "text-ink"}`}>
                        {seller.store_name}
                      </Text>
                      <StatusChip
                        label={(seller.verification_status || "pending").replaceAll("_", " ")}
                        tone={verificationTone(seller.verification_status || "pending")}
                      />
                    </View>
                    <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
                      {seller.profiles?.name}{" "}
                      {seller.profiles?.phone && `• ${seller.profiles.phone}`}
                    </Text>
                    {seller.description ? (
                      <Text className={`text-[13px] font-inter mt-1 ${dark ? "text-white/55" : "text-ink/55"}`}>
                        {seller.description}
                      </Text>
                    ) : null}
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => router.push("/(admin)/users" as any)}
                      activeOpacity={0.85}
                      className={`flex-1 border h-14 rounded-full items-center justify-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
                    >
                      <Text className={`font-inter-bold text-[14px] ${dark ? "text-white" : "text-ink"}`}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleApproval(seller.id, true)}
                      activeOpacity={0.85}
                      className={`flex-1 h-14 rounded-full items-center justify-center flex-row gap-1.5 ${dark ? "bg-white" : "bg-ink"}`}
                    >
                      <Icon icon={CheckmarkCircle01Icon} size={15} color={dark ? "#0A0A0E" : "#fff"} />
                      <Text className={`font-inter-bold text-[14px] ${dark ? "text-ink" : "text-white"}`}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleApproval(seller.id, false)}
                      activeOpacity={0.85}
                      className={`flex-1 border h-14 rounded-full items-center justify-center flex-row gap-1.5 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
                    >
                      <Icon icon={Delete02Icon} size={15} color="#D92D20" />
                      <Text className={`font-inter-bold text-[14px] ${dark ? "text-white" : "text-ink"}`}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Activity log */}
        <View>
          <SectionHeader title="Recent activity" />
          {activities.length === 0 ? (
            <View className={`rounded-[24px] p-8 items-center border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
              <Text className={`font-inter text-[14px] ${dark ? "text-white/55" : "text-ink/55"}`}>No recent activity</Text>
            </View>
          ) : (
            <View className="gap-3">
              {activities.map((activity) => (
                <View
                  key={activity.id}
                  className={`rounded-[24px] p-5 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
                >
                  <View className="flex-row items-center gap-2 mb-1 flex-wrap">
                    <Text className={`text-[14px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
                      {activityLabels[activity.action_type] || activity.action_type}
                    </Text>
                    <StatusChip
                      label={activity.profiles?.name || "Admin"}
                      tone="neutral"
                    />
                  </View>
                  <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
                    {new Date(activity.created_at).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <View className="mt-3 flex-row items-center gap-2 opacity-60">
            <Icon icon={DeliveryBox01Icon} size={14} color={dark ? "rgba(255,255,255,0.6)" : "#6E6A75"} />
            <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
              Ops monitored in real-time
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
