import { Tabs } from "expo-router";
import { Home, Grid3X3, MessageCircle, ShoppingCart, User } from "lucide-react-native";
import TabBar from "../../src/components/TabBar";

const tabs = [
  { icon: Home, label: "Home", href: "/(buyer)/browse" },
  { icon: Grid3X3, label: "Categories", href: "/(buyer)/browse" },
  { icon: MessageCircle, label: "Chat", href: "/(buyer)/chat" },
  { icon: ShoppingCart, label: "Cart", href: "/(buyer)/cart" },
  { icon: User, label: "Account", href: "/(buyer)/profile" },
];

export default function BuyerLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar tabs={tabs} />}
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
