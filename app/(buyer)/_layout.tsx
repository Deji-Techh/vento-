import { Tabs } from "expo-router";
import TabBar from "../../src/components/TabBar";
import { ic, Home01Icon, ReceiptIcon, UserIcon, ShoppingBag02Icon } from "../../src/components/icons";
import { useCart } from "../../src/stores/cartStore";

const tabs = [
  { icon: ic(Home01Icon), label: "Home", href: "/(buyer)/browse" },
  { icon: ic(ReceiptIcon), label: "Orders", href: "/(buyer)/orders" },
  { icon: ic(UserIcon), label: "Account", href: "/(buyer)/profile" },
];

export default function BuyerLayout() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={() => (
        <TabBar
          tabs={tabs}
          action={{ icon: ic(ShoppingBag02Icon), label: "Bag", href: "/(buyer)/cart", badge: count }}
        />
      )}
    >
      <Tabs.Screen name="browse" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="orders" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="food-details" options={{ href: null }} />
      <Tabs.Screen name="track-delivery" options={{ href: null }} />
      <Tabs.Screen name="live-map" options={{ href: null }} />
      <Tabs.Screen name="checkout" options={{ href: null }} />
    </Tabs>
  );
}
