import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Platform, FlatList, Dimensions, RefreshControl } from "react-native";
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
} from "../../src/components/icons";
import { SectionHeader, Eyebrow } from "../../src/components/ui/SectionHeader";
import { StoryRow, PromoBanner } from "../../src/components/ui/Cards";
import { Enter } from "../../src/components/motion";

const { width: WIN } = Dimensions.get("window");

const moods = ["All", "Spicy", "Comfort", "Fresh", "Fast"] as const;

const stories = [
  { id: "s1", label: "Tasty Bites", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200" },
  { id: "s2", label: "Mama Cass", image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200" },
  { id: "s3", label: "Fresh Mart", image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=200" },
  { id: "s4", label: "Grill House", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200" },
  { id: "s5", label: "Suya Spot", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
];

const popularItems = [
  { id: "pop-1", name: "Pepperoni Pizza Slice", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600", price: 1500, rating: 4.5, eta: 25, mood: "Comfort", seller_id: "seller-4", seller_name: "Pizzeria Delfina" },
  { id: "pop-2", name: "Grilled Chicken Bowl", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600", price: 2200, rating: 4.7, eta: 30, mood: "Fresh", seller_id: "seller-5", seller_name: "Grill House" },
  { id: "pop-3", name: "Suya Platter", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600", price: 3000, rating: 4.8, eta: 20, mood: "Spicy", seller_id: "seller-6", seller_name: "Suya Spot" },
  { id: "pop-4", name: "Fish & Chips", image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600", price: 2800, rating: 4.4, eta: 35, mood: "Comfort", seller_id: "seller-7", seller_name: "Ocean Basket" },
  { id: "pop-5", name: "Burger Meal", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600", price: 1800, rating: 4.6, eta: 22, mood: "Comfort", seller_id: "seller-8", seller_name: "Burger King" },
  { id: "pop-6", name: "Shawarma Wrap", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600", price: 1200, rating: 4.3, eta: 18, mood: "Fast", seller_id: "seller-9", seller_name: "Shawarma Express" },
];

const featured = [
  { id: "pop-3", eyebrow: "Featured", title: "Suya Platter", sub: "Fire-grilled. Yaji-dusted. Unmissable.", meta: "Suya Spot • 20 min", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900" },
  { id: "pop-5", eyebrow: "Loved tonight", title: "Burger Meal", sub: "Smashed patty, special sauce, fries.", meta: "Burger King • 22 min", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900" },
  { id: "pop-1", eyebrow: "Crowd pleaser", title: "Pepperoni Pizza Slice", sub: "Stone-oven, molten mozzarella.", meta: "Pizzeria Delfina • 25 min", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900" },
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
  const [hero, setHero] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const heroRef = useRef<FlatList>(null);
  const cardW = WIN - 40;

  useEffect(() => {
    const t = setInterval(() => {
      setHero((h) => {
        const n = (h + 1) % featured.length;
        heroRef.current?.scrollToOffset({ offset: n * cardW, animated: true });
        return n;
      });
    }, 4500);
    return () => clearInterval(t);
  }, [cardW]);

  const onRefresh = () => {
    setRefreshing(true);
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    setTimeout(() => setRefreshing(false), 900);
  };

  const buzz = () => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
  };

  const handleAdd = (item: (typeof popularItems)[number], e?: any) => {
    addItem({ id: item.id, name: item.name, price: item.price, image_url: item.image, seller_id: item.seller_id, seller_name: item.seller_name }, 1);
    if (e) fireFromEvent(e);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    toast.success(`${item.name} added to bag`);
  };

  const q = query.trim().toLowerCase();
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={dark ? "#fff" : "#0A0A0E"}
            title="Hunting cravings…"
          />
        }
      >
        {/* Header */}
        <View className="px-5 pt-2 flex-row items-center justify-between">
          <Text className={`text-[22px] font-display-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Vento</Text>
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

        {/* Craving greeting */}
        <Enter>
          <View className="px-5 mt-5">
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
          </View>
        </Enter>

        {/* Moods */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-5 pl-5" contentContainerStyle={{ paddingRight: 20 }}>
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

        {/* Rotating featured */}
        <Enter delay={60}>
          <View className="mt-5">
            <FlatList
              ref={heroRef}
              data={featured}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(f) => f.id}
              onMomentumScrollEnd={(e) => setHero(Math.round(e.nativeEvent.contentOffset.x / cardW))}
              renderItem={({ item }) => (
                <View style={{ width: cardW, marginLeft: 20 }}>
                  <TouchableOpacity
                    activeOpacity={0.94}
                    onPress={() => router.push(`/(buyer)/food-details?id=${item.id}` as any)}
                    className="rounded-[28px] overflow-hidden"
                  >
                    <Image source={{ uri: item.image }} style={{ width: "100%", height: 300 }} contentFit="cover" transition={300} />
                    <LinearGradient
                      colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.55)"]}
                      locations={[0.4, 1]}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                    />
                    <View className="absolute top-4 left-4">
                      <Eyebrow dark>{item.eyebrow}</Eyebrow>
                    </View>
                    <View className="absolute bottom-0 left-0 right-0 p-5">
                      <Text className="text-white text-[26px] font-display-bold tracking-tight">{item.title}</Text>
                      <Text className="text-white/70 text-[13px] font-inter mt-1">{item.sub}</Text>
                      <View className="flex-row items-center justify-between mt-3.5">
                        <Text className="text-white/70 text-[12px] font-inter-semibold">{item.meta}</Text>
                        <View className="bg-white px-5 py-2.5 rounded-full">
                          <Text className="text-ink text-[13px] font-inter-bold">Order</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
            <View className="items-center mt-3 flex-row justify-center gap-1.5">
              {featured.map((f, i) => (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => {
                    setHero(i);
                    heroRef.current?.scrollToOffset({ offset: i * cardW, animated: true });
                  }}
                  className={`h-1.5 rounded-full ${i === hero ? (dark ? "w-6 bg-white" : "w-6 bg-ink") : dark ? "w-1.5 bg-white/25" : "w-1.5 bg-ink/20"}`}
                />
              ))}
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

        {/* Filtered list */}
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
                  <Image source={{ uri: item.image }} style={{ width: 76, height: 76, borderRadius: 20 }} contentFit="cover" transition={200} />
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
