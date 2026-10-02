import { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../../src/stores/cartStore";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { Icon } from "../../src/components/ui/Icon";
import {
  Search01Icon,
  Notification01Icon,
  BubbleChatIcon,
  StarIcon,
  PlusSignIcon,
} from "../../src/components/icons";
import { SectionHeader, Eyebrow } from "../../src/components/ui/SectionHeader";
import { StoryRow, PromoBanner } from "../../src/components/ui/Cards";

const smartFilters = ["All", "Under ₦2,000", "25 min or less", "4.6+ rated"] as const;

const stories = [
  { id: "s1", label: "Tasty Bites", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200" },
  { id: "s2", label: "Mama Cass", image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200" },
  { id: "s3", label: "Fresh Mart", image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=200" },
  { id: "s4", label: "Grill House", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200" },
  { id: "s5", label: "Suya Spot", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
];

const popularItems = [
  { id: "pop-1", name: "Pepperoni Pizza Slice", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600", price: 1500, rating: 4.5, eta: 25, seller_id: "seller-4", seller_name: "Pizzeria Delfina" },
  { id: "pop-2", name: "Grilled Chicken Bowl", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600", price: 2200, rating: 4.7, eta: 30, seller_id: "seller-5", seller_name: "Grill House" },
  { id: "pop-3", name: "Suya Platter", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600", price: 3000, rating: 4.8, eta: 20, seller_id: "seller-6", seller_name: "Suya Spot" },
  { id: "pop-4", name: "Fish & Chips", image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600", price: 2800, rating: 4.4, eta: 35, seller_id: "seller-7", seller_name: "Ocean Basket" },
  { id: "pop-5", name: "Burger Meal", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600", price: 1800, rating: 4.6, eta: 22, seller_id: "seller-8", seller_name: "Burger King" },
  { id: "pop-6", name: "Shawarma Wrap", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600", price: 1200, rating: 4.3, eta: 18, seller_id: "seller-9", seller_name: "Shawarma Express" },
];

export default function Browse() {
  const router = useRouter();
  const { addItem } = useCart();
  const [filter, setFilter] = useState<(typeof smartFilters)[number]>("All");
  const [query, setQuery] = useState("");

  const handleAdd = (item: (typeof popularItems)[number]) => {
    addItem({ id: item.id, name: item.name, price: item.price, image_url: item.image, seller_id: item.seller_id, seller_name: item.seller_name }, 1);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    toast.success(`${item.name} added to bag`);
  };

  const q = query.trim().toLowerCase();
  const visible = popularItems.filter((i) => {
    if (q && !`${i.name} ${i.seller_name}`.toLowerCase().includes(q)) return false;
    if (filter === "Under ₦2,000") return i.price <= 2000;
    if (filter === "25 min or less") return i.eta <= 25;
    if (filter === "4.6+ rated") return i.rating >= 4.6;
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-ink" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-2 flex-row items-center justify-between">
          <Text className="text-white text-[22px] font-inter-bold tracking-tight">Vento</Text>
          <View className="flex-row items-center gap-2.5">
            <TouchableOpacity
              onPress={() => router.push("/(buyer)/chat" as any)}
              className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
            >
              <Icon icon={BubbleChatIcon} size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
              <Icon icon={Notification01Icon} size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(buyer)/profile" as any)} className="w-10 h-10 rounded-full bg-white items-center justify-center">
              <Text className="text-ink font-inter-bold">C</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting + search */}
        <View className="px-5 mt-5">
          <Text className="text-white text-[28px] font-inter-bold tracking-tight leading-[30px]">
            What are we{"\n"}eating today?
          </Text>
          <View className="flex-row items-center bg-white/[0.07] border border-white/10 rounded-full pl-4 pr-1.5 py-1.5 mt-4">
            <Icon icon={Search01Icon} size={17} color="rgba(255,255,255,0.45)" />
            <TextInput
              placeholder="Jollof, suya, shawarma…"
              placeholderTextColor="rgba(255,255,255,0.38)"
              value={query}
              onChangeText={setQuery}
              className="flex-1 text-white text-[15px] font-inter ml-2"
            />
            {q ? (
              <TouchableOpacity onPress={() => setQuery("")} className="bg-white/15 px-4 py-2.5 rounded-full">
                <Text className="text-white text-[13px] font-inter-bold">Clear</Text>
              </TouchableOpacity>
            ) : (
              <View className="bg-white px-4 py-2.5 rounded-full">
                <Text className="text-ink text-[13px] font-inter-bold">Search</Text>
              </View>
            )}
          </View>
        </View>

        {/* Smart filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-5 pl-5" contentContainerStyle={{ paddingRight: 20 }}>
          {smartFilters.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              className={`mr-2 px-5 py-2.5 rounded-full ${filter === f ? "bg-white" : "bg-white/[0.07]"}`}
            >
              <Text className={`text-[13px] font-inter-bold ${filter === f ? "text-ink" : "text-white/60"}`}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured hero */}
        <View className="px-5 mt-5">
          <TouchableOpacity
            activeOpacity={0.94}
            onPress={() => router.push(`/(buyer)/food-details?id=pop-3` as any)}
            className="rounded-[28px] overflow-hidden"
          >
            <Image source={{ uri: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900" }} style={{ width: "100%", height: 320 }} contentFit="cover" transition={300} />
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.55)"]}
              locations={[0.4, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View className="absolute top-4 left-4">
              <Eyebrow dark>Featured</Eyebrow>
            </View>
            <View className="absolute bottom-0 left-0 right-0 p-5">
              <Text className="text-white text-[26px] font-inter-bold tracking-tight">Suya Platter</Text>
              <Text className="text-white/70 text-[13px] font-inter mt-1">Fire-grilled. Yaji-dusted. Unmissable.</Text>
              <View className="flex-row items-center justify-between mt-3.5">
                <Text className="text-white/70 text-[12px] font-inter-semibold">Suya Spot • 20 min</Text>
                <View className="bg-white px-5 py-2.5 rounded-full">
                  <Text className="text-ink text-[13px] font-inter-bold">Order</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Single ember moment */}
        <View className="px-5 mt-4">
          <PromoBanner title="Midnight craving?" subtitle="Hot food from kitchens still open near you." cta="Order" />
        </View>

        {/* Kitchens */}
        <View className="mt-7 pl-5">
          <View className="pr-5">
            <SectionHeader title="Kitchens you follow" action="See all" dark />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
            <StoryRow items={stories} />
          </ScrollView>
        </View>

        {/* Filtered list */}
        <View className="px-5 mt-7">
          <SectionHeader
            title={q || filter !== "All" ? `${visible.length} result${visible.length === 1 ? "" : "s"}` : "Nearby"}
            action="See all"
            dark
          />
          <View className="gap-2.5">
            {visible.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/(buyer)/food-details?id=${item.id}` as any)}
                activeOpacity={0.9}
                className="flex-row items-center py-2"
              >
                <Image source={{ uri: item.image }} style={{ width: 76, height: 76, borderRadius: 20 }} contentFit="cover" transition={200} />
                <View className="flex-1 ml-3.5">
                  <Text className="text-white font-inter-bold text-[15px] tracking-tight" numberOfLines={1}>{item.name}</Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    <Icon icon={StarIcon} size={12} color="rgba(255,255,255,0.55)" />
                    <Text className="text-white/45 text-[12px] font-inter">{item.seller_name} • {item.eta} min • {item.rating}</Text>
                  </View>
                  <Text className="text-white font-inter-bold text-[14px] mt-1">₦{item.price.toLocaleString()}</Text>
                </View>
                <TouchableOpacity onPress={() => handleAdd(item)} className="w-10 h-10 rounded-full bg-white items-center justify-center">
                  <Icon icon={PlusSignIcon} size={18} color="#0A0A0E" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            {visible.length === 0 && (
              <View className="py-10 items-center">
                <Text className="text-white text-[16px] font-inter-bold">Nothing matches</Text>
                <Text className="text-white/50 text-[13px] font-inter mt-1">Try a different search or filter.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
