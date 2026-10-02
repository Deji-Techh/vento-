import { Tabs } from "expo-router";
import TabBar from "../../src/components/TabBar";
import { ic, DashboardSquare01Icon, Store01Icon, ReceiptIcon, Wallet01Icon, UserIcon } from "../../src/components/icons";

const tabs = [
  { icon: ic(DashboardSquare01Icon), label: "Home", href: "/(seller)/dashboard" },
  { icon: ic(Store01Icon), label: "Menu", href: "/(seller)/menu" },
  { icon: ic(ReceiptIcon), label: "Orders", href: "/(seller)/orders" },
  { icon: ic(Wallet01Icon), label: "Earnings", href: "/(seller)/earnings" },
  { icon: ic(UserIcon), label: "Account", href: "/(seller)/profile" },
];

export default function SellerLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={() => <TabBar tabs={tabs} />}
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
