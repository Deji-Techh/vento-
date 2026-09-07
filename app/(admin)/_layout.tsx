import { Tabs } from "expo-router";
import { LayoutDashboard, Users, ShoppingBag, Settings, User } from "lucide-react-native";
import TabBar from "../../src/components/TabBar";

const tabs = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/(admin)" },
  { icon: Users, label: "Users", href: "/(admin)/users" },
  { icon: ShoppingBag, label: "Orders", href: "/(admin)/orders" },
  { icon: Settings, label: "Settings", href: "/(admin)/settings" },
  { icon: User, label: "Account", href: "/(admin)/profile" },
];

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar tabs={tabs} dark={false} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="users" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="settings" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
