import { Tabs } from "expo-router";
import TabBar from "../../src/components/TabBar";
import { RequireRole } from "../../src/components/AuthGuard";
import { ic, DashboardSquare01Icon, DeliveryBox01Icon, MapPinIcon, Wallet01Icon, UserIcon } from "../../src/components/icons";

const tabs = [
  { icon: ic(DashboardSquare01Icon), label: "Home", href: "/(delivery)/dashboard" },
  { icon: ic(DeliveryBox01Icon), label: "Deliveries", href: "/(delivery)/tasks" },
  { icon: ic(MapPinIcon), label: "Map", href: "/(delivery)/map" },
  { icon: ic(Wallet01Icon), label: "Earnings", href: "/(delivery)/earnings" },
  { icon: ic(UserIcon), label: "Account", href: "/(delivery)/profile" },
];

export default function DeliveryLayout() {
  return (
    <RequireRole allow={["delivery_agent", "admin"]} redirectTo="/auth/choose-role">
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={() => <TabBar tabs={tabs} />}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="tasks" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="earnings" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
    </RequireRole>
  );
}
