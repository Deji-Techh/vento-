import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import * as Haptics from "expo-haptics";
import { EmptyState } from "../../src/components/ui/Cards";
import { Enter } from "../../src/components/motion";
import { Icon } from "../../src/components/ui/Icon";
import {
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  Navigation01Icon,
  StarIcon,
  Wallet01Icon,
  ShoppingBag02Icon,
} from "../../src/components/icons";

type Item = {
  id: string;
  icon: any;
  tint: string;
  title: string;
  body: string;
  time: string;
  href?: string;
};

const fresh: Item[] = [
  { id: "n1", icon: CheckmarkCircle01Icon, tint: "#12805C", title: "Order delivered", body: "Grill House dropped your Chicken Bowl. Enjoy!", time: "2m", href: "/(buyer)/orders" },
  { id: "n2", icon: Navigation01Icon, tint: "#1B1B8F", title: "Rider is nearby", body: "Emeka is 1 km away with your food.", time: "9m", href: "/(buyer)/track-delivery" },
  { id: "n3", icon: StarIcon, tint: "#FF5A1F", title: "Suya Spot has a deal", body: "20% off platters till midnight.", time: "1h", href: "/(buyer)/browse" },
];

const earlier: Item[] = [
  { id: "n4", icon: Wallet01Icon, tint: "#12805C", title: "Refund processed", body: "₦1,200 is back in your Vento Pay wallet.", time: "Yesterday", href: "/(buyer)/orders" },
  { id: "n5", icon: ShoppingBag02Icon, tint: "#1B1B8F", title: "Reorder in one tap", body: "Mama Cass Jollof — you order this every Friday.", time: "2d", href: "/(buyer)/browse" },
];

export default function Notifications() {
  const router = useRouter();
  const { dark } = useTheme();
  const [read, setRead] = useState<string[]>(["n4", "n5"]);

  const unread = (id: string) => !read.includes(id);
  const markRead = (id: string) => setRead((r) => (r.includes(id) ? r : [...r, id]));
  const unreadCount = [...fresh, ...earlier].filter((i) => unread(i.id)).length;

  const open = (item: Item) => {
    markRead(item.id);
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    if (item.href) router.push(item.href as any);
  };

  const markAll = () => {
    setRead([...fresh, ...earlier].map((i) => i.id));
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const Section = ({ title, items }: { title: string; items: Item[] }) => (
    <View className="mb-6">
      <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-2.5 ${dark ? "text-white/50" : "text-ink/50"}`}>
        {title}
      </Text>
      <View className={`rounded-[24px] overflow-hidden border ${dark ? "bg-white/[0.04] border-white/10" : "bg-white border-border"}`}>
        {items.map((item, i) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => open(item)}
            activeOpacity={0.85}
            className={`flex-row gap-3.5 p-4 ${i < items.length - 1 ? (dark ? "border-b border-white/10" : "border-b border-border") : ""}`}
          >
            <View className="w-11 h-11 rounded-full items-center justify-center shrink-0" style={{ backgroundColor: `${item.tint}1F` }}>
              <Icon icon={item.icon} size={20} color={item.tint} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between gap-2">
                <Text className={`text-[15px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>{item.title}</Text>
                <Text className={`text-[12px] font-inter shrink-0 ${dark ? "text-white/40" : "text-ink/40"}`}>{item.time}</Text>
              </View>
              <Text className={`text-[13px] font-inter mt-0.5 leading-[19px] ${dark ? "text-white/60" : "text-ink/60"}`}>{item.body}</Text>
            </View>
            {unread(item.id) && <View className="w-2 h-2 rounded-full bg-ember mt-2 shrink-0" />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <View className="px-5 pt-1 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className={`w-11 h-11 rounded-full items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}>
            <Icon icon={ArrowLeft01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
          </TouchableOpacity>
          <Text className={`text-[20px] font-inter-bold tracking-tight ml-3 ${dark ? "text-white" : "text-ink"}`}>
            Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAll} className="active:opacity-60">
            <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Enter>
          <Section title="New" items={fresh} />
        </Enter>
        <Enter delay={60}>
          <Section title="Earlier" items={earlier} />
        </Enter>
        {unreadCount === 0 && (
          <EmptyState title="All caught up" subtitle="New order updates will land here." />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
