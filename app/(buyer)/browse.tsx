import { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Platform, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../../src/stores/cartStore";
import { useTheme } from "../../src/contexts/ThemeContext";
import { fireFromEvent } from "../../src/stores/flyStore";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { Icon } from "../../src/components/ui/Icon";
import {
  Search01Icon,
  Notification01Icon,
  BubbleChatIcon,
  StarIcon,
  PlusSignIcon,
  MapPinIcon,
  Navigation01Icon,
} from "../../src/components/icons";
import { SectionHeader, Eyebrow } from "../../src/components/ui/SectionHeader";
import { StoryRow, PromoBanner } from "../../src/components/ui/Cards";
import { Enter } from "../../src/components/motion";

const moods = ["All", "Spicy", "Comfort", "Fresh", "Fast"] as const;

const stories = [
  { id: "s1", label: "Tasty Bites", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200" },
  { id: "s2", label: "Mama Cass", image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200" },
  { id: "s3", label: "Fresh Mart", image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=200" },
  { id: "s4", label: "Grill House", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200" },
  { id: "s5", label: "Suya Spot", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
];

const popularItems = [
  { id: "pop-1", name: "Pepperoni Pizza Slice", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300", price: 1500, rating: 4.5, eta: 25, mood: "Comfort", seller_id: "seller-4", seller_name: "Pizzeria Delfina" },
  { id: "pop-2", name: "Grilled Chicken Bowl", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300", price: 2200, rating: 4.7, eta: 30, mood: "Fresh", seller_id: "seller-5", seller_name: "Grill House" },
  { id: "pop-3", name: "Suya Platter", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300", price: 3000, rating: 4.8, eta: 20, mood: "Spicy", seller_id: "seller-6", seller_name: "Suya Spot" },
  { id: "pop-4", name: "Fish & Chips", image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=300", price: 2800, rating: 4.4, eta: 35, mood: "Comfort", seller_id: "seller-7", seller_name: "Ocean Basket" },
  { id: "pop-5", name: "Burger Meal", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300", price: 1800, rating: 4.6, eta: 22, mood: "Comfort", seller_id: "seller-8", seller_name: "Burger King" },
  { id: "pop-6", name: "Shawarma Wrap", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300", price: 1200, rating: 4.3, eta: 18, mood: "Fast", seller_id: "seller-9", seller_name: "Shawarma Express" },
];

const reorderItems = [
  { id: "pop-2", name: "Grilled Chicken Bowl", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300", price: 2200, seller_id: "seller-5", seller_name: "Grill House" },
  { id: "pop-3", name: "Suya Platter", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300", price: 3000, seller_id: "seller-6", seller_name: "Suya Spot" },
  { id: "pop-6", name: "Shawarma Wrap", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300", price: 1200, seller_id: "seller-9", seller_name: "Shawarma Express" },
];

function timeLine() {
  const h = new Date().getHours();
  if (h < 11) return "Breakfast spots open now";
  if (h < 15) return "Lunch rush · kitchens at full speed";
  if (h < 19) return "Afternoon cravings, handled";
  if (h < 23) return "Dinner time · order before the rush";
  return "Open late · midnight kitchens";
}

export default function Browse() {
  const router = useRouter();
  const { addItem } = useCart();
  const { dark } = useTheme();
  const [mood, setMood] = useState<(typeof moods)[number]>("All");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [recents, setRecents] = useState<string[]>(["Suya", "Shawarma"]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    Image.prefetch([
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
      ...stories.map((s) => s.image),
    ]);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    setTimeout(() => setRefreshing(false), 900);
  };

  const buzz = () => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
  };

  const handleAdd = (item: { id: string; name: string; price: number; image: string; seller_id: string; seller_name: string }, e?: any) => {
    addItem({ id: item.id, name: item.name, price: item.price, image_url: item.image, seller_id: item.seller_id, seller_name: item.seller_name }, 1);
    if (e) fireFromEvent(e);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    toast.success(`${item.name} added to bag`);
  };

  const q = query.trim().toLowerCase();
  const suggestions = q
    ? popularItems.filter((i) => `${i.name} ${i.seller_name}`.toLowerCase().includes(q)).slice(0, 3)
    : [];
  const kitchenHits = q
    ? stories.filter((s) => s.label.toLowerCase().includes(q)).slice(0, 2)
    : [];
  const showSuggest = focused && (q.length > 0 || recents.length > 0);

  const applySearch = (v: string) => {
    setQuery(v);
    setFocused(false);
    if (v.trim() && !recents.includes(v.trim())) setRecents((r) => [v.trim(), ...r].slice(0, 4));
  };

  const visible = popularItems.filter((i) => {
    if (q && !`${i.name} ${i.seller_name}`.toLowerCase().includes(q)) return false;
    if (mood !== "All" && i.mood !== mood) return false;
    return true;
  });

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={dark ? "#fff" : "#0A0A0E"}
            title="Hunting cravings…"
          />
        }
      >
        {/* Location header */}
        <View className="px-5 pt-2 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => toast("Delivering to Campus Gate")} activeOpacity={0.8} className="flex-row items-center gap-1.5">
            <Icon icon={MapPinIcon} size={18} color="#FF5A1F" />
            <View>
              <Text className={`text-[11px] font-inter-medium ${dark ? "text-white/50" : "text-ink/50"}`}>Deliver to</Text>
              <Text className={`text-[15px] font-inter-bold -mt-0.5 ${dark ? "text-white" : "text-ink"}`}>Campus Gate ▾</Text>
            </View>
          </TouchableOpacity>
          <View className="flex-row items-center gap-2.5">
            <TouchableOpacity
              onPress={() => router.push("/(buyer)/chat" as any)}
              className={`w-10 h-10 rounded-full items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}
            >
              <Icon icon={BubbleChatIcon} size={18} color={dark ? "#fff" : "#0A0A0E"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(buyer)/notifications" as any)}
              className={`w-10 h-10 rounded-full items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}
            >
              <Icon icon={Notification01Icon} size={18} color={dark ? "#fff" : "#0A0A0E"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting + smart search */}
        <Enter>
          <View className="px-5 mt-4">
            <Text className={`text-[11px] font-inter-bold tracking-[2px] uppercase ${dark ? "text-white/50" : "text-ink/50"}`}>
              {timeLine()}
            </Text>
            <Text className={`text-[30px] font-display-bold tracking-tight leading-[32px] mt-1.5 ${dark ? "text-white" : "text-ink"}`}>
              What are we{"\n"}craving today?
            </Text>
            <View className={`flex-row items-center rounded-full pl-4 pr-1.5 py-1.5 mt-4 border ${dark ? "bg-white/[0.07] border-white/10" : "bg-white border-border"}`}>
              <Icon icon={Search01Icon} size={17} color={dark ? "rgba(255,255,255,0.45)" : "rgba(10,10,14,0.4)"} />
              <TextInput
                placeholder="Jollof, suya, shawarma…"
                placeholderTextColor={dark ? "rgba(255,255,255,0.38)" : "rgba(10,10,14,0.35)"}
                value={query}
                onChangeText={setQuery}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                onSubmitEditing={() => applySearch(query)}
                returnKeyType="search"
                className={`flex-1 text-[15px] font-inter ml-2 ${dark ? "text-white" : "text-ink"}`}
              />
              {q ? (
                <TouchableOpacity onPress={() => setQuery("")} className={`px-4 py-2.5 rounded-full ${dark ? "bg-white/15" : "bg-ink/10"}`}>
                  <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Clear</Text>
                </TouchableOpacity>
              ) : (
                <View className={`px-4 py-2.5 rounded-full ${dark ? "bg-white" : "bg-ink"}`}>
                  <Text className={`text-[13px] font-inter-bold ${dark ? "text-ink" : "text-white"}`}>Search</Text>
                </View>
              )}
            </View>

            {showSuggest && (
              <View className={`mt-2 rounded-[20px] border overflow-hidden ${dark ? "bg-surface-dark border-white/10" : "bg-white border-border"}`}>
                {suggestions.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => {
                      applySearch(s.name);
                      router.push(`/(buyer)/food-details?id=${s.id}` as any);
                    }}
                    className={`flex-row items-center gap-3 px-4 py-3 border-b ${dark ? "border-white/[0.07]" : "border-ink/[0.06]"}`}
                  >
                    <Icon icon={Search01Icon} size={15} color={dark ? "rgba(255,255,255,0.4)" : "rgba(10,10,14,0.35)"} />
                    <Text className={`text-[14px] font-inter-medium flex-1 ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>{s.name}</Text>
                    <Text className={`text-[12px] font-inter-bold ${dark ? "text-white/50" : "text-ink/50"}`}>₦{s.price.toLocaleString()}</Text>
                  </TouchableOpacity>
                ))}
                {kitchenHits.map((k) => (
                  <TouchableOpacity
                    key={k.id}
                    onPress={() => {
                      setFocused(false);
                      router.push(`/(buyer)/kitchen?id=${k.id}` as any);
                    }}
                    className={`flex-row items-center gap-3 px-4 py-3 border-b ${dark ? "border-white/[0.07]" : "border-ink/[0.06]"}`}
                  >
                    <Image source={{ uri: k.image }} style={{ width: 28, height: 28, borderRadius: 14 }} contentFit="cover" />
                    <Text className={`text-[14px] font-inter-medium flex-1 ${dark ? "text-white" : "text-ink"}`}>{k.label}</Text>
                    <Text className={`text-[11px] font-inter-bold uppercase tracking-[1px] ${dark ? "text-white/40" : "text-ink/40"}`}>Kitchen</Text>
                  </TouchableOpacity>
                ))}
                {!q && recents.map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => applySearch(r)}
                    className="flex-row items-center gap-3 px-4 py-3"
                  >
                    <Icon icon={Search01Icon} size={15} color={dark ? "rgba(255,255,255,0.4)" : "rgba(10,10,14,0.35)"} />
                    <Text className={`text-[14px] font-inter flex-1 ${dark ? "text-white/70" : "text-ink/70"}`}>{r}</Text>
                  </TouchableOpacity>
                ))}
                {q && suggestions.length === 0 && kitchenHits.length === 0 && (
                  <View className="px-4 py-3.5 items-center">
                    <Text className={`text-[13px] font-inter ${dark ? "text-white/50" : "text-ink/50"}`}>No matches — try “suya”</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </Enter>

        {/* Moods */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 pl-5" contentContainerStyle={{ paddingRight: 20 }}>
          {moods.map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => {
                buzz();
                setMood(m);
              }}
              className={`mr-2 px-5 py-2.5 rounded-full border ${
                mood === m
                  ? "bg-ember border-ember"
                  : dark
                    ? "bg-white/[0.07] border-white/10"
                    : "bg-white border-border"
              }`}
            >
              <Text className={`text-[13px] font-inter-bold ${mood === m ? "text-white" : dark ? "text-white/60" : "text-ink/55"}`}>{m}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Live order band */}
        <Enter delay={60}>
          <View className="px-5 mt-5">
            <TouchableOpacity
              onPress={() => router.push("/(buyer)/track-delivery" as any)}
              activeOpacity={0.92}
              className={`rounded-[24px] p-4 flex-row items-center gap-3.5 border ${dark ? "bg-white/[0.05] border-white/10" : "bg-white border-border"}`}
            >
              <View className="w-12 h-12 rounded-2xl bg-success/15 items-center justify-center">
                <Icon icon={Navigation01Icon} size={22} color="#0E9F6E" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className={`text-[15px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Grill House is on its way</Text>
                </View>
                <View className={`h-1 rounded-full overflow-hidden mt-2 ${dark ? "bg-white/10" : "bg-ink/10"}`}>
                  <View className="h-full w-2/3 bg-success rounded-full" />
                </View>
                <Text className={`text-[12px] font-inter mt-1.5 ${dark ? "text-white/50" : "text-ink/50"}`}>Arriving in 3 min · Tap to track</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Enter>

        {/* Bento hero */}
        <Enter delay={80}>
          <View className="px-5 mt-5">
            <View className="flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.92}
                onPress={() => router.push(`/(buyer)/food-details?id=pop-3` as any)}
                className="rounded-[24px] overflow-hidden"
                style={{ flex: 1.15, height: 300 }}
              >
                <Image source={{ uri: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800" }} style={{ width: "100%", height: "100%" }} contentFit="cover" transition={200} cachePolicy="memory-disk" priority="high" />
                <LinearGradient
                  colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]}
                  locations={[0.45, 1]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                />
                <View className="absolute top-3 left-3">
                  <Eyebrow dark>Featured</Eyebrow>
                </View>
                <View className="absolute bottom-0 left-0 right-0 p-4">
                  <Text className="text-white text-[20px] font-display-bold tracking-tight">Suya Platter</Text>
                  <View className="flex-row items-center justify-between mt-1.5">
                    <Text className="text-white/75 text-[13px] font-inter-bold">₦3,000</Text>
                    <TouchableOpacity
                      onPress={(e) => handleAdd(popularItems[2], e)}
                      className="w-9 h-9 rounded-full bg-white items-center justify-center"
                    >
                      <Icon icon={PlusSignIcon} size={17} color="#0A0A0E" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
              <View className="flex-1 gap-3">
                {[
                  { item: popularItems[4], tag: "4.6★" },
                  { item: popularItems[0], tag: "FAST" },
                ].map(({ item, tag }) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.92}
                    onPress={() => router.push(`/(buyer)/food-details?id=${item.id}` as any)}
                    className="rounded-[24px] overflow-hidden"
                    style={{ height: 144 }}
                  >
                    <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} contentFit="cover" transition={200} cachePolicy="memory-disk" />
                    <LinearGradient
                      colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]}
                      locations={[0.4, 1]}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                    />
                    <View className="absolute top-2.5 left-2.5 bg-black/55 px-2 py-1 rounded-full">
                      <Text className="text-white text-[10px] font-inter-bold">{tag}</Text>
                    </View>
                    <View className="absolute bottom-0 left-0 right-0 p-3">
                      <Text className="text-white text-[14px] font-display-bold tracking-tight" numberOfLines={1}>{item.name}</Text>
                      <Text className="text-white/75 text-[12px] font-inter-bold mt-0.5">₦{item.price.toLocaleString()}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Enter>

        {/* Single ember moment */}
        <Enter delay={100}>
          <View className="px-5 mt-4">
            <PromoBanner
              title="Midnight craving?"
              subtitle="Hot food from kitchens still open near you."
              cta="Order"
              onPress={() => router.push(`/(buyer)/food-details?id=pop-3` as any)}
            />
          </View>
        </Enter>

        {/* Kitchens */}
        <View className="mt-7 pl-5">
          <View className="pr-5">
            <SectionHeader title="Kitchens you follow" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
            <StoryRow items={stories} onPress={(id) => router.push(`/(buyer)/kitchen?id=${id}` as any)} />
          </ScrollView>
        </View>

        {/* Order again */}
        <View className="mt-7 pl-5">
          <View className="pr-5">
            <SectionHeader title="Order again" action="History" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20, gap: 12 }}>
            {reorderItems.map((item) => (
              <View key={item.id} className={`w-[160px] rounded-[20px] overflow-hidden border ${dark ? "bg-white/[0.04] border-white/10" : "bg-white border-border"}`}>
                <TouchableOpacity onPress={() => router.push(`/(buyer)/food-details?id=${item.id}` as any)} activeOpacity={0.9}>
                  <Image source={{ uri: item.image }} style={{ width: "100%", height: 100 }} contentFit="cover" transition={200} cachePolicy="memory-disk" />
                </TouchableOpacity>
                <View className="p-3">
                  <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>{item.name}</Text>
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className={`text-[13px] font-inter-bold ${dark ? "text-white/70" : "text-ink/70"}`}>₦{item.price.toLocaleString()}</Text>
                    <TouchableOpacity
                      onPress={(e) => handleAdd(item, e)}
                      className={`px-3.5 py-2 rounded-full ${dark ? "bg-white" : "bg-ink"}`}
                    >
                      <Text className={`text-[12px] font-inter-bold ${dark ? "text-ink" : "text-white"}`}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Dish list */}
        <View className="px-5 mt-7">
          <SectionHeader
            title={q || mood !== "All" ? `${visible.length} craving${visible.length === 1 ? "" : "s"}` : "Nearby"}
          />
          <View className="gap-2.5">
            {visible.map((item, i) => (
              <Enter key={item.id} delay={Math.min(i * 40, 160)}>
                <TouchableOpacity
                  onPress={() => router.push(`/(buyer)/food-details?id=${item.id}` as any)}
                  activeOpacity={0.9}
                  className="flex-row items-center py-2"
                >
                  <Image source={{ uri: item.image }} style={{ width: 76, height: 76, borderRadius: 20, backgroundColor: dark ? "rgba(255,255,255,0.06)" : "rgba(10,10,14,0.05)" }} contentFit="cover" transition={200} cachePolicy="memory-disk" />
                  <View className="flex-1 ml-3.5">
                    <Text className={`font-inter-bold text-[15px] tracking-tight ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>{item.name}</Text>
                    <View className="flex-row items-center gap-1 mt-1">
                      <Icon icon={StarIcon} size={12} color={dark ? "rgba(255,255,255,0.55)" : "rgba(10,10,14,0.5)"} />
                      <Text className={`text-[12px] font-inter ${dark ? "text-white/45" : "text-ink/50"}`}>{item.seller_name} • {item.eta} min • {item.rating}</Text>
                    </View>
                    <Text className={`font-inter-bold text-[14px] mt-1 ${dark ? "text-white" : "text-ink"}`}>₦{item.price.toLocaleString()}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={(e) => handleAdd(item, e)}
                    className={`w-10 h-10 rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}
                  >
                    <Icon icon={PlusSignIcon} size={18} color={dark ? "#0A0A0E" : "#fff"} />
                  </TouchableOpacity>
                </TouchableOpacity>
              </Enter>
            ))}
            {visible.length === 0 && (
              <View className="py-10 items-center">
                <Text className={`text-[16px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Nothing matches</Text>
                <Text className={`text-[13px] font-inter mt-1 ${dark ? "text-white/50" : "text-ink/50"}`}>Try a different search or mood.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
