import { Tabs } from "expo-router";
import TabBar from "../../src/components/TabBar";
import { ic, DashboardSquare01Icon, UsersIcon, ReceiptIcon, Settings01Icon, UserIcon } from "../../src/components/icons";

const tabs = [
  { icon: ic(DashboardSquare01Icon), label: "Dashboard", href: "/(admin)" },
  { icon: ic(UsersIcon), label: "Users", href: "/(admin)/users" },
  { icon: ic(ReceiptIcon), label: "Orders", href: "/(admin)/orders" },
  { icon: ic(Settings01Icon), label: "Settings", href: "/(admin)/settings" },
  { icon: ic(UserIcon), label: "Account", href: "/(admin)/profile" },
];

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={() => <TabBar tabs={tabs} dark={false} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="users" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="settings" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
