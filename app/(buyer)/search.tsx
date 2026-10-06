import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { Icon } from "../../src/components/ui/Icon";
import { Search01Icon, ArrowLeft01Icon } from "../../src/components/icons";
import { EmptyState } from "../../src/components/ui/Cards";
import { buzz } from "../../src/lib/haptics";

const RECENT_KEY = "vento-search-recents";

export default function Search() {
  const router = useRouter();
  const { dark } = useTheme();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => { AsyncStorage.getItem(RECENT_KEY).then((v) => { if (v) setRecents(JSON.parse(v)); }).catch(() => {}); }, []);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase.from("menu_items").select("id, name, price, image_url, seller_id").eq("available", true).limit(50);
      if (alive) setItems(data || []);
    })();
    return () => { alive = false; };
  }, []);

  const results = useMemo(() => {
    if (!debounced) return [];
    return items.filter((i) => `${i.name}`.toLowerCase().includes(debounced)).slice(0, 20);
  }, [debounced, items]);

  const saveRecent = async (v: string) => {
    const next = [v, ...recents.filter((r) => r !== v)].slice(0, 6);
    setRecents(next);
    AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next)).catch(() => {});
  };

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <View className="flex-row items-center px-5 pt-1 gap-2">
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" className="w-11 h-11 items-center justify-center">
          <Icon icon={ArrowLeft01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
        </TouchableOpacity>
        <View className={`flex-1 flex-row items-center rounded-full pl-4 pr-4 h-[52px] ${dark ? "bg-white/[0.07]" : "bg-ink/[0.05]"}`}>
          <Icon icon={Search01Icon} size={17} color={dark ? "rgba(255,255,255,0.45)" : "rgba(10,10,14,0.4)"} />
          <TextInput
            autoFocus
            placeholder="Search live catalogue…"
            placeholderTextColor={dark ? "rgba(255,255,255,0.38)" : "rgba(10,10,14,0.35)"}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            accessibilityLabel="Search food"
            className={`flex-1 text-[15px] font-inter ml-2 ${dark ? "text-white" : "text-ink"}`}
          />
        </View>
      </View>
      {!debounced ? (
        <View className="px-5 mt-4">
          <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-2 ${dark ? "text-white/50" : "text-ink/50"}`}>Recent</Text>
          {recents.length === 0 ? (
            <Text className={`text-[14px] font-inter ${dark ? "text-white/50" : "text-ink/50"}`}>No recent searches yet.</Text>
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {recents.map((r) => (
                <TouchableOpacity key={r} onPress={() => { buzz(); setQuery(r); }} className={`px-4 h-[44px] rounded-full justify-center border ${dark ? "border-white/15" : "border-ink/15"}`}>
                  <Text className={`text-[13px] font-inter-medium ${dark ? "text-white" : "text-ink"}`}>{r}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => { setRecents([]); AsyncStorage.removeItem(RECENT_KEY).catch(() => {}); }} className="px-4 h-[44px] rounded-full justify-center">
                <Text className={`text-[13px] font-inter-bold ${dark ? "text-white/50" : "text-ink/50"}`}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : results.length === 0 ? (
        <View className="px-5 mt-4">
          <EmptyState title="No matches" subtitle="Try another keyword. New admin listings appear here first." />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(i) => i.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 10 }}
          initialNumToRender={10}
          windowSize={5}
          removeClippedSubviews
          ListHeaderComponent={<Text accessibilityLiveRegion="polite" className={`text-[12px] font-inter mb-1 ${dark ? "text-white/50" : "text-ink/50"}`}>{results.length} result{results.length === 1 ? "" : "s"}</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => { saveRecent(item.name); router.push(`/(buyer)/food-details?id=${item.id}` as any); }}
              className={`flex-row items-center p-3 rounded-[20px] border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
            >
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={{ width: 56, height: 56, borderRadius: 16 }} contentFit="cover" transition={200} />
              ) : (
                <View style={{ width: 56, height: 56, borderRadius: 16 }} className={dark ? "bg-white/10" : "bg-ink/10"} />
              )}
              <View className="flex-1 ml-3">
                <Text className={`font-inter-bold text-[15px] ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>{item.name}</Text>
                <Text className={`text-[13px] font-inter-bold mt-0.5 ${dark ? "text-white/60" : "text-ink/60"}`}>₦{Number(item.price).toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
