import { Tabs } from "expo-router";
import { Home, ReceiptText, ShoppingBag, User } from "lucide-react-native";
import TabBar from "../../src/components/TabBar";
import { useCart } from "../../src/stores/cartStore";

const tabs = [
  { icon: Home, label: "Home", href: "/(buyer)/browse" },
  { icon: ReceiptText, label: "Orders", href: "/(buyer)/orders" },
  { icon: User, label: "Account", href: "/(buyer)/profile" },
];

export default function BuyerLayout() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={() => (
        <TabBar
          tabs={tabs}
          dark
          action={{ icon: ShoppingBag, label: "Bag", href: "/(buyer)/cart", badge: count }}
        />
      )}
    >
      <Tabs.Screen name="browse" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="orders" options={{ href: null }} />
      <Tabs.Screen name="food-details" options={{ href: null }} />
      <Tabs.Screen name="track-delivery" options={{ href: null }} />
      <Tabs.Screen name="live-map" options={{ href: null }} />
      <Tabs.Screen name="checkout" options={{ href: null }} />
    </Tabs>
  );
}
