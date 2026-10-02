import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useCart } from "../../src/stores/cartStore";
import { useTheme } from "../../src/contexts/ThemeContext";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { EmptyState } from "../../src/components/ui/Cards";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { Enter } from "../../src/components/motion";
import { Icon } from "../../src/components/ui/Icon";
import { Wallet01Icon, BubbleChatIcon, CheckmarkCircle01Icon } from "../../src/components/icons";

const history = [
  { id: 1, time: "Yesterday, 17:00", name: "Tasty Bites", item: "Chicken & Chips Combo", status: "Delivered", tone: "success" as const, price: 4500, image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200" },
  { id: 2, time: "Yesterday, 10:30", name: "Mama Cass", item: "Jollof Rice Special", status: "Delivered", tone: "success" as const, price: 3200, image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200" },
  { id: 3, time: "3 Jul, 14:52", name: "Fresh Mart", item: "Fresh Fruit Bowl, Smoothie Pack", status: "Delivered", tone: "success" as const, price: 5800, image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=200" },
  { id: 4, time: "3 Jul, 13:16", name: "Pizzeria Delfina", item: "Pepperoni Pizza Slice, Coke", status: "Delivered", tone: "success" as const, price: 2500, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200" },
];

const ongoing = [
  { id: 5, time: "Today, 12:15", name: "Grill House", item: "Grilled Chicken Bowl", status: "On the way", tone: "info" as const, price: 2200, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600" },
];

export default function Orders() {
  const router = useRouter();
  const { addItem } = useCart();
  const { dark } = useTheme();
  const [tab, setTab] = useState<"Ongoing" | "History">("History");

  const list = tab === "Ongoing" ? ongoing : history;

  const reorder = (o: { id: number; name: string; item: string; price: number; image: string }) => {
    addItem({ id: `re-${o.id}`, name: o.item, price: o.price, image_url: o.image, seller_id: `seller-${o.id}`, seller_name: o.name }, 1);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    toast.success("Added to bag");
    router.push("/(buyer)/cart" as any);
  };

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <View className="px-6 pt-2 pb-2">
        <Eyebrow>Order history</Eyebrow>
        <Text className={`text-[28px] font-inter-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>Orders</Text>

        <View className="flex-row gap-2 mt-4">
          {(["Ongoing", "History"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => {
                setTab(t);
                if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
              }}
              activeOpacity={0.85}
              className={`px-5 py-2.5 rounded-full ${tab === t ? (dark ? "bg-white" : "bg-ink") : dark ? "bg-white/10" : "bg-ink/[0.05]"}`}
            >
              <Text className={`text-[13px] font-inter-bold ${tab === t ? (dark ? "text-ink" : "text-white") : dark ? "text-white/60" : "text-ink/55"}`}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          activeOpacity={0.9}
          className={`border rounded-[24px] px-4 py-4 flex-row items-center gap-3 mb-2 mt-3 ${dark ? "border-white/10" : "bg-white border-border"}`}
        >
          <View className={`w-11 h-11 rounded-2xl items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}>
            <Icon icon={Wallet01Icon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
          </View>
          <View className="flex-1">
            <Text className={`text-[15px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Vento Pay transactions</Text>
            <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`}>Receipts, refunds and wallet</Text>
          </View>
        </TouchableOpacity>

        {list.length === 0 ? (
          <View className="mt-6">
            <EmptyState title="Nothing here yet" subtitle="Orders in this tab will show up here." />
          </View>
        ) : (
          <View>
            {list.map((order, index) => (
              <Enter key={order.id} delay={Math.min(index * 50, 150)}>
                <View className={`py-5 ${index < list.length - 1 ? (dark ? "border-b border-white/10" : "border-b border-ink/10") : ""}`}>
                  <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-3 ${dark ? "text-white/50" : "text-ink/50"}`}>
                    {order.time}
                  </Text>
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-start gap-4 flex-1">
                      <Image source={{ uri: order.image }} style={{ width: 76, height: 76, borderRadius: 18 }} contentFit="cover" transition={200} />
                      <View className="flex-1 pr-2">
                        <Text className={`text-[16px] font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>
                          {order.name}
                        </Text>
                        <View className="mt-1.5">
                          <StatusChip label={order.status} tone={order.tone} />
                        </View>
                        <Text className={`text-[13px] font-inter mt-1.5 ${dark ? "text-white/55" : "text-ink/55"}`} numberOfLines={1}>
                          {order.item}
                        </Text>
                      </View>
                    </View>
                    <Text className={`text-[15px] font-inter-bold ml-2 ${dark ? "text-white" : "text-ink"}`}>
                      ₦{order.price.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row gap-2 mt-4">
                    {tab === "Ongoing" ? (
                      <>
                        <TouchableOpacity
                          onPress={() => router.push("/(buyer)/track-delivery" as any)}
                          className={`flex-1 py-3 rounded-full items-center ${dark ? "bg-white" : "bg-ink"}`}
                        >
                          <Text className={`text-[13px] font-inter-bold ${dark ? "text-ink" : "text-white"}`}>Track order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => router.push("/(buyer)/chat" as any)}
                          className={`w-12 h-12 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/15" : "bg-ink/[0.05] border-ink/10"}`}
                        >
                          <Icon icon={BubbleChatIcon} size={18} color={dark ? "#fff" : "#0A0A0E"} />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          onPress={() => reorder(order)}
                          className={`flex-1 py-3 rounded-full items-center ${dark ? "bg-white" : "bg-ink"}`}
                        >
                          <Text className={`text-[13px] font-inter-bold ${dark ? "text-ink" : "text-white"}`}>Reorder</Text>
                        </TouchableOpacity>
                        <View className={`w-12 h-12 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/15" : "bg-ink/[0.05] border-ink/10"}`}>
                          <Icon icon={CheckmarkCircle01Icon} size={18} color={dark ? "rgba(255,255,255,0.6)" : "rgba(10,10,14,0.5)"} />
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </Enter>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
