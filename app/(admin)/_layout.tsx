import { Tabs } from "expo-router";
import TabBar from "../../src/components/TabBar";
import { RequireRole } from "../../src/components/AuthGuard";
import { ic, DashboardSquare01Icon, UsersIcon, ReceiptIcon, Settings01Icon, UserIcon, Store01Icon } from "../../src/components/icons";

const tabs = [
  { icon: ic(DashboardSquare01Icon), label: "Dashboard", href: "/(admin)" },
  { icon: ic(Store01Icon), label: "Listings", href: "/(admin)/listings" },
  { icon: ic(UsersIcon), label: "Users", href: "/(admin)/users" },
  { icon: ic(ReceiptIcon), label: "Orders", href: "/(admin)/orders" },
  { icon: ic(Settings01Icon), label: "Settings", href: "/(admin)/settings" },
  { icon: ic(UserIcon), label: "Account", href: "/(admin)/profile" },
];

export default function AdminLayout() {
  return (
    <RequireRole allow={["admin"]} redirectTo="/auth/login">
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={() => <TabBar tabs={tabs} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="listings" />
      <Tabs.Screen name="users" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="settings" />
      <Tabs.Screen name="profile" />
    </Tabs>
    </RequireRole>
  );
}
