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
import { StatusChip } from "../../src/components/ui/SectionHeader";
import { Enter } from "../../src/components/motion";
import { Icon } from "../../src/components/ui/Icon";
import { Wallet01Icon, PlusSignIcon } from "../../src/components/icons";

const sections = [
  {
    day: "Yesterday",
    items: [
      { id: 1, time: "17:00", name: "Tasty Bites", item: "Chicken & Chips Combo", status: "Delivered", tone: "success" as const, price: 4500, image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200" },
      { id: 2, time: "10:30", name: "Mama Cass", item: "Jollof Rice Special", status: "Delivered", tone: "success" as const, price: 3200, image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200" },
    ],
  },
  {
    day: "3 July",
    items: [
      { id: 3, time: "14:52", name: "Fresh Mart", item: "Fresh Fruit Bowl, Smoothie Pack", status: "Delivered", tone: "success" as const, price: 5800, image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=200" },
      { id: 4, time: "13:16", name: "Pizzeria Delfina", item: "Pepperoni Pizza Slice, Coke", status: "Delivered", tone: "success" as const, price: 2500, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200" },
    ],
  },
];

const live = { id: 5, time: "12:15", name: "Grill House", item: "Grilled Chicken Bowl", price: 2200, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600" };

export default function Orders() {
  const router = useRouter();
  const { addItem } = useCart();
  const { dark } = useTheme();
  const [tab, setTab] = useState<"Ongoing" | "History">("History");

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
        <Text className={`text-[28px] font-display-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Orders</Text>

        <View className="flex-row mt-3">
          {(["Ongoing", "History"] as const).map((t) => {
            const active = tab === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => {
                  setTab(t);
                  if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
                }}
                activeOpacity={0.85}
                className="mr-5 items-center"
              >
                <Text className={`text-[15px] ${active ? "font-inter-bold" : "font-inter"} ${dark ? (active ? "text-white" : "text-white/45") : active ? "text-ink" : "text-ink/40"}`}>{t}</Text>
                <View className={`h-[2px] rounded-full mt-1 self-stretch ${active ? (dark ? "bg-white" : "bg-ink") : "bg-transparent"}`} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => router.push("/(buyer)/vento-pay" as any)}
          activeOpacity={0.9}
          className={`rounded-[24px] px-4 py-4 flex-row items-center gap-3 mb-2 mt-3 ${dark ? "bg-white/[0.06]" : "bg-ink/[0.05]"}`}
        >
          <View className={`w-11 h-11 rounded-2xl items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}>
            <Icon icon={Wallet01Icon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
          </View>
          <View className="flex-1">
            <Text className={`text-[15px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Vento Pay transactions</Text>
            <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`}>Receipts, refunds and wallet</Text>
          </View>
        </TouchableOpacity>

        {tab === "Ongoing" ? (
          <Enter>
            <TouchableOpacity
              onPress={() => router.push("/(buyer)/track-delivery" as any)}
              activeOpacity={0.92}
              className={`rounded-[24px] p-4 mt-3 ${dark ? "bg-white/[0.06]" : "bg-ink/[0.05]"}`}
            >
              <View className="flex-row items-center gap-3">
                <Image source={{ uri: live.image }} style={{ width: 56, height: 56, borderRadius: 16 }} contentFit="cover" transition={200} />
                <View className="flex-1">
                  <Text className={`text-[15px] font-inter-bold ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>
                    {live.name}
                  </Text>
                  <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`} numberOfLines={1}>
                    {live.item} · {live.time}
                  </Text>
                </View>
                <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Track ›</Text>
              </View>
              <View className={`h-1 rounded-full overflow-hidden mt-3.5 ${dark ? "bg-white/10" : "bg-ink/10"}`}>
                <View className={`h-full w-2/3 rounded-full ${dark ? "bg-white" : "bg-ink"}`} />
              </View>
              <Text className={`text-[12px] font-inter mt-2 ${dark ? "text-white/50" : "text-ink/50"}`}>
                Arriving in 3 min · Rider en route
              </Text>
            </TouchableOpacity>
          </Enter>
        ) : (
          <View>
            {sections.map((s) => (
              <View key={s.day}>
                <Text className={`text-[13px] font-inter-semibold mt-5 mb-1 ${dark ? "text-white/45" : "text-ink/45"}`}>
                  {s.day}
                </Text>
                {s.items.map((order, index) => (
                  <Enter key={order.id} delay={Math.min(index * 50, 150)}>
                    <View className="flex-row items-center py-3">
                      <Image source={{ uri: order.image }} style={{ width: 64, height: 64, borderRadius: 18 }} contentFit="cover" transition={200} />
                      <View className="flex-1 ml-3">
                        <Text className={`text-[15px] font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>
                          {order.name}
                        </Text>
                        <Text className={`text-[13px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`} numberOfLines={1}>
                          {order.item} · {order.time}
                        </Text>
                        <View className="mt-1.5 self-start">
                          <StatusChip label={order.status} tone={order.tone} />
                        </View>
                      </View>
                      <View className="items-end ml-2">
                        <Text className={`text-[14px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
                          ₦{order.price.toLocaleString()}
                        </Text>
                        <TouchableOpacity
                          onPress={() => reorder(order)}
                          className={`w-9 h-9 rounded-full items-center justify-center mt-2 ${dark ? "bg-white" : "bg-ink"}`}
                        >
                          <Icon icon={PlusSignIcon} size={16} color={dark ? "#0A0A0E" : "#fff"} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Enter>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
