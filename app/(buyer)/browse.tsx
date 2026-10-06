import { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Platform, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../../src/stores/cartStore";
import { useTheme } from "../../src/contexts/ThemeContext";
import { fireFromEvent } from "../../src/stores/flyStore";
import { supabase } from "../../src/lib/supabase";
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
import { StoryRow } from "../../src/components/ui/Cards";
import { EmptyState } from "../../src/components/ui/Cards";
import { Skeleton } from "../../src/components/ui/Skeleton";
import { Enter } from "../../src/components/motion";

const moods = ["All", "Spicy", "Comfort", "Fresh", "Fast"] as const;

function greeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 9) return "Early bird";
  if (h >= 9 && h < 12) return "Good morning";
  if (h >= 12 && h < 15) return "Good afternoon";
  if (h >= 15 && h < 17) return "Slow afternoon";
  if (h >= 17 && h < 21) return "Good evening";
  return "Night owl";
}

type Item = { id: string; name: string; price: number; image_url: string | null; seller_id: string; seller_name: string; category: string };
type Kitchen = { id: string; label: string; image: string };

export default function Browse() {
  const router = useRouter();
  const { addItem } = useCart();
  const { dark } = useTheme();
  const [mood, setMood] = useState<(typeof moods)[number]>("All");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const { data: sellers, error: se } = await supabase
        .from("sellers")
        .select("id, store_name, description")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(20);
      if (se) throw se;
      const sellerName = new Map((sellers || []).map((s: any) => [s.id, s.store_name]));
      setKitchens((sellers || []).map((s: any) => ({ id: s.id, label: s.store_name, image: "" })));
      const { data: menu, error: me } = await supabase
        .from("menu_items")
        .select("id, name, price, image_url, seller_id, category")
        .eq("available", true)
        .order("created_at", { ascending: false })
        .limit(50);
      if (me) throw me;
      setItems(
        (menu || []).map((m: any) => ({
          id: m.id,
          name: m.name,
          price: m.price,
          image_url: m.image_url,
          seller_id: m.seller_id,
          seller_name: sellerName.get(m.seller_id) || "Kitchen",
          category: m.category || "mains",
        }))
      );
    } catch (e: any) {
      setError(e.message || "Couldn't load listings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    load();
  };

  const buzz = () => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
  };

  const handleAdd = (item: Item, e?: any) => {
    addItem({ id: item.id, name: item.name, price: item.price, image_url: item.image_url || "", seller_id: item.seller_id, seller_name: item.seller_name }, 1);
    if (e) fireFromEvent(e);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    toast.success(`${item.name} added to bag`, { action: { label: "View bag", onClick: () => router.push("/(buyer)/cart" as any) } });
  };

  const q = query.trim().toLowerCase();
  const suggestions = q ? items.filter((i) => `${i.name} ${i.seller_name}`.toLowerCase().includes(q)).slice(0, 3) : [];
  const kitchenHits = q ? kitchens.filter((s) => s.label.toLowerCase().includes(q)).slice(0, 2) : [];
  const showSuggest = focused && q.length > 0;

  const visible = items.filter((i) => {
    if (q && !`${i.name} ${i.seller_name}`.toLowerCase().includes(q)) return false;
    if (mood !== "All" && !`${i.category} ${i.name}`.toLowerCase().includes(mood.toLowerCase())) return false;
    return true;
  });

  const hero = visible[0] || items[0];

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
        <Enter>
          <View className="px-5 mt-2">
            <View className="flex-row items-center justify-between gap-3">
              <Text className={`text-[30px] font-display-bold tracking-tight leading-[32px] flex-1 ${dark ? "text-white" : "text-ink"}`}>
                {greeting()}
              </Text>
              <View className="flex-row items-center gap-1 shrink-0">
                <TouchableOpacity
                  onPress={() => router.push("/(buyer)/chat" as any)}
                  accessibilityLabel="Open chat"
                  accessibilityRole="button"
                  className="w-11 h-11 items-center justify-center"
                >
                  <Icon icon={BubbleChatIcon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/(buyer)/notifications" as any)}
                  accessibilityLabel="Open notifications"
                  accessibilityRole="button"
                  className="w-11 h-11 items-center justify-center"
                >
                  <Icon icon={Notification01Icon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
                </TouchableOpacity>
              </View>
            </View>
            <View className={`flex-row items-center rounded-full pl-4 pr-4 py-3.5 mt-4 ${dark ? "bg-white/[0.07]" : "bg-ink/[0.05]"}`}>
              <Icon icon={Search01Icon} size={17} color={dark ? "rgba(255,255,255,0.45)" : "rgba(10,10,14,0.4)"} />
              <TextInput
                placeholder="Jollof, suya, shawarma…"
                placeholderTextColor={dark ? "rgba(255,255,255,0.38)" : "rgba(10,10,14,0.35)"}
                value={query}
                onChangeText={setQuery}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                onSubmitEditing={() => setFocused(false)}
                returnKeyType="search"
                accessibilityLabel="Search food and kitchens"
                className={`flex-1 text-[15px] font-inter ml-2 ${dark ? "text-white" : "text-ink"}`}
              />
              {q ? (
                <TouchableOpacity onPress={() => setQuery("")} hitSlop={8} accessibilityLabel="Clear search">
                  <Text className={`text-[13px] font-inter-medium ${dark ? "text-white/50" : "text-ink/40"}`}>Clear</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {showSuggest && (
              <View className={`mt-2 rounded-[20px] border overflow-hidden ${dark ? "bg-surface-dark border-white/10" : "bg-white border-border"}`}>
                {suggestions.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => {
                      setFocused(false);
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
                    <Text className={`text-[14px] font-inter-medium flex-1 ${dark ? "text-white" : "text-ink"}`}>{k.label}</Text>
                    <Text className={`text-[11px] font-inter-bold uppercase tracking-[1px] ${dark ? "text-white/40" : "text-ink/40"}`}>Kitchen</Text>
                  </TouchableOpacity>
                ))}
                {q && suggestions.length === 0 && kitchenHits.length === 0 && (
                  <View className="px-4 py-3.5 items-center">
                    <Text className={`text-[13px] font-inter ${dark ? "text-white/50" : "text-ink/50"}`}>No matches in live catalogue</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </Enter>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 pl-5" contentContainerStyle={{ paddingRight: 20 }}>
          {moods.map((m) => {
            const active = mood === m;
            return (
              <TouchableOpacity
                key={m}
                onPress={() => { buzz(); setMood(m); }}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Filter ${m}`}
                className="mr-5 items-center"
              >
                <Text className={`text-[15px] ${active ? "font-inter-bold" : "font-inter"} ${dark ? (active ? "text-white" : "text-white/45") : active ? "text-ink" : "text-ink/40"}`}>{m}</Text>
                <View className={`h-[2px] rounded-full mt-1 self-stretch ${active ? (dark ? "bg-white" : "bg-ink") : "bg-transparent"}`} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading ? (
          <View className="px-5 mt-4 gap-3">
            <Skeleton width="100%" height={200} radius={20} />
            <Skeleton width="100%" height={76} radius={20} />
            <Skeleton width="100%" height={76} radius={20} />
            <Skeleton width="100%" height={76} radius={20} />
          </View>
        ) : error ? (
          <View className="px-5 mt-4">
            <EmptyState title="Couldn't load listings" subtitle={error} actionLabel="Retry" onAction={load} />
          </View>
        ) : items.length === 0 ? (
          <View className="px-5 mt-4">
            <EmptyState title="No listings yet" subtitle="The admin hasn't published anything. Check back soon — new items appear here first." actionLabel="Refresh" onAction={load} />
          </View>
        ) : (
          <>
            {hero ? (
              <Enter delay={80}>
                <View className="px-5 mt-4">
                  <TouchableOpacity
                    activeOpacity={0.92}
                    onPress={() => router.push(`/(buyer)/food-details?id=${hero.id}` as any)}
                    accessibilityLabel={`Featured ${hero.name}`}
                    className="rounded-[20px] overflow-hidden"
                    style={{ height: 200 }}
                  >
                    {hero.image_url ? (
                      <Image source={{ uri: hero.image_url }} style={{ width: "100%", height: "100%" }} contentFit="cover" transition={200} cachePolicy="memory-disk" priority="high" />
                    ) : (
                      <View className={`w-full h-full ${dark ? "bg-white/10" : "bg-ink/10"}`} />
                    )}
                    <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]} locations={[0.45, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
                    <View className="absolute top-3 left-3">
                      <Eyebrow dark>Featured</Eyebrow>
                    </View>
                    <View className="absolute bottom-0 left-0 right-0 p-4 flex-row items-end justify-between">
                      <View>
                        <Text className="text-white text-[20px] font-display-bold tracking-tight">{hero.name}</Text>
                        <Text className="text-white/75 text-[13px] font-inter-bold mt-0.5">₦{hero.price.toLocaleString()} · {hero.seller_name}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={(e) => handleAdd(hero, e)}
                        accessibilityLabel={`Add ${hero.name} to bag`}
                        className="w-11 h-11 rounded-full bg-white items-center justify-center"
                      >
                        <Icon icon={PlusSignIcon} size={17} color="#0A0A0E" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </View>
              </Enter>
            ) : null}

            {kitchens.length > 0 ? (
              <View className="mt-5 pl-5">
                <View className="pr-5">
                  <SectionHeader title="Kitchens" />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                  <StoryRow items={kitchens} onPress={(id) => router.push(`/(buyer)/kitchen?id=${id}` as any)} />
                </ScrollView>
              </View>
            ) : null}

            <View className="px-5 mt-5">
              <SectionHeader title={q || mood !== "All" ? `${visible.length} craving${visible.length === 1 ? "" : "s"}` : "Nearby"} />
              <View className="gap-2.5">
                {visible.map((item, i) => (
                  <Enter key={item.id} delay={Math.min(i * 40, 160)}>
                    <TouchableOpacity
                      onPress={() => router.push(`/(buyer)/food-details?id=${item.id}` as any)}
                      activeOpacity={0.9}
                      accessibilityLabel={`${item.name}, ₦${item.price.toLocaleString()}`}
                      className="flex-row items-center py-2"
                    >
                      {item.image_url ? (
                        <Image source={{ uri: item.image_url }} style={{ width: 76, height: 76, borderRadius: 20, backgroundColor: dark ? "rgba(255,255,255,0.06)" : "rgba(10,10,14,0.05)" }} contentFit="cover" transition={200} cachePolicy="memory-disk" />
                      ) : (
                        <View style={{ width: 76, height: 76, borderRadius: 20 }} className={dark ? "bg-white/10" : "bg-ink/10"} />
                      )}
                      <View className="flex-1 ml-3.5">
                        <Text className={`font-inter-bold text-[15px] tracking-tight ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>{item.name}</Text>
                        <View className="flex-row items-center gap-1 mt-1">
                          <Icon icon={StarIcon} size={12} color={dark ? "rgba(255,255,255,0.55)" : "rgba(10,10,14,0.5)"} />
                          <Text className={`text-[12px] font-inter ${dark ? "text-white/45" : "text-ink/50"}`}>{item.seller_name}</Text>
                        </View>
                        <Text className={`font-inter-bold text-[14px] mt-1 ${dark ? "text-white" : "text-ink"}`}>₦{item.price.toLocaleString()}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={(e) => handleAdd(item, e)}
                        accessibilityLabel={`Add ${item.name}`}
                        className={`w-11 h-11 rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}
                      >
                        <Icon icon={PlusSignIcon} size={18} color={dark ? "#0A0A0E" : "#fff"} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </Enter>
                ))}
                {visible.length === 0 && (
                  <EmptyState title="Nothing matches" subtitle="Try a different search or mood." actionLabel="Clear filters" onAction={() => { setQuery(""); setMood("All"); }} />
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
