import { useState } from "react";
import {
  View,
  Text,
  TextInput,
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
          router.replace("/onboarding");
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-[#f8f6f5] px-4 pt-8 pb-6">
      <Text className="text-2xl font-bold mb-6">Settings</Text>

      {/* Toggle Settings */}
      <View className="bg-white rounded-2xl p-4 mb-4">
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
          <View>
            <Text className="font-semibold text-gray-900">
              Push Notifications
            </Text>
            <Text className="text-sm text-gray-500">Order alerts & updates</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ true: "#000080", false: "#D1D5DB" }}
          />
        </View>
        <View className="flex-row items-center justify-between py-3">
          <View>
            <Text className="font-semibold text-gray-900">
              Auto-Accept Orders
            </Text>
            <Text className="text-sm text-gray-500">
              Automatically accept incoming orders
            </Text>
          </View>
          <Switch
            value={autoAccept}
            onValueChange={setAutoAccept}
            trackColor={{ true: "#000080", false: "#D1D5DB" }}
          />
        </View>
      </View>

      {/* Settings Items */}
      <View className="bg-white rounded-2xl overflow-hidden mb-4">
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            className={`flex-row items-center p-4 ${
              index < settingsItems.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center mr-3">
              <item.icon color="#000080" size={20} />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">{item.label}</Text>
              <Text className="text-sm text-gray-500">{item.subtitle}</Text>
            </View>
            <ChevronRight color="#9CA3AF" size={20} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        onPress={handleSignOut}
        className="bg-white rounded-2xl p-4 flex-row items-center gap-3"
      >
        <LogOut color="#EF4444" size={20} />
        <Text className="text-red-500 font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
