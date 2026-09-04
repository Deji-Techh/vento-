import { Tabs } from "expo-router";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, DollarSign, User } from "lucide-react-native";
import TabBar from "../../src/components/TabBar";

const tabs = [
  { icon: LayoutDashboard, label: "Home", href: "/(seller)/dashboard" },
  { icon: UtensilsCrossed, label: "Menu", href: "/(seller)/menu" },
  { icon: ShoppingBag, label: "Orders", href: "/(seller)/orders" },
  { icon: DollarSign, label: "Earnings", href: "/(seller)/earnings" },
  { icon: User, label: "Account", href: "/(seller)/profile" },
];

export default function SellerLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar tabs={tabs} />}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="menu" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="earnings" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="verification" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
