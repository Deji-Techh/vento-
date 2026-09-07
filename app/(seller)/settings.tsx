import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import {
  Store,
  Bell,
  Clock,
  MapPin,
  CreditCard,
  ChevronRight,
  LogOut,
} from "lucide-react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { useRouter } from "expo-router";

const settingsItems = [
  { icon: Store, label: "Store Information", subtitle: "Name, description, hours" },
  { icon: Bell, label: "Notifications", subtitle: "Order alerts, promotions" },
  { icon: Clock, label: "Operating Hours", subtitle: "Set your open/close times" },
  { icon: MapPin, label: "Delivery Radius", subtitle: "Maximum delivery distance" },
  { icon: CreditCard, label: "Payment Settings", subtitle: "Payout preferences" },
];

export default function SellerSettings() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/onboarding" as any);
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-[#FAF5EA] px-5 pt-14 pb-10" contentContainerStyle={{ paddingBottom: 120 }}>
      <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">
        Preferences
      </Text>
      <Text className="text-[28px] font-bold text-ink mt-1 mb-1">Settings</Text>
      <Text className="text-sm text-ink/55 mb-6">Store preferences</Text>

      {/* Toggle Settings */}
      <View className="bg-white rounded-[26px] p-6 mb-4 border border-[#E7E0D2]">
        <View className="flex-row items-center justify-between py-3 border-b border-[#E7E0D2]">
          <View className="flex-1 pr-3">
            <Text className="font-bold text-ink">
              Push Notifications
            </Text>
            <Text className="text-sm text-ink/55">Order alerts and updates</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ true: "#1B1B8F", false: "#D8D2C4" }}
          />
        </View>
        <View className="flex-row items-center justify-between py-3">
          <View className="flex-1 pr-3">
            <Text className="font-bold text-ink">
              Auto-Accept Orders
            </Text>
            <Text className="text-sm text-ink/55">
              Automatically accept incoming orders
            </Text>
          </View>
          <Switch
            value={autoAccept}
            onValueChange={setAutoAccept}
            trackColor={{ true: "#1B1B8F", false: "#D8D2C4" }}
          />
        </View>
      </View>

      {/* Settings Items */}
      <View className="bg-white rounded-[26px] overflow-hidden mb-4 border border-[#E7E0D2]">
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            className={`flex-row items-center p-4 ${
              index < settingsItems.length - 1 ? "border-b border-[#E7E0D2]" : ""
            }`}
          >
            <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center mr-3">
              <item.icon color="#1B1B8F" size={20} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-ink">{item.label}</Text>
              <Text className="text-sm text-ink/55">{item.subtitle}</Text>
            </View>
            <ChevronRight color="#6E6A75" size={20} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        onPress={handleSignOut}
        className="bg-white rounded-[26px] p-5 flex-row items-center gap-3 border border-[#E7E0D2]"
      >
        <View className="w-11 h-11 rounded-full bg-[#FDE8E4] items-center justify-center">
          <LogOut color="#C0361F" size={20} />
        </View>
        <Text className="text-[#C0361F] font-bold">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
