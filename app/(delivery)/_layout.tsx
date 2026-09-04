import { Tabs } from "expo-router";
import { LayoutDashboard, Package, Map, Wallet, User } from "lucide-react-native";
import TabBar from "../../src/components/TabBar";

const tabs = [
  { icon: LayoutDashboard, label: "Home", href: "/(delivery)/dashboard" },
  { icon: Package, label: "Deliveries", href: "/(delivery)/tasks" },
  { icon: Map, label: "Map", href: "/(delivery)/map" },
  { icon: Wallet, label: "Earnings", href: "/(delivery)/earnings" },
  { icon: User, label: "Account", href: "/(delivery)/profile" },
];

export default function DeliveryLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar tabs={tabs} />}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="tasks" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="earnings" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
