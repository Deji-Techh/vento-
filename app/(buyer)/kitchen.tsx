import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../../src/stores/cartStore";
import { useTheme } from "../../src/contexts/ThemeContext";
import { fireFromEvent } from "../../src/stores/flyStore";
import { supabase } from "../../src/lib/supabase";
import { buzz } from "../../src/lib/haptics";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { Enter } from "../../src/components/motion";
import { EmptyState } from "../../src/components/ui/Cards";
import { Skeleton } from "../../src/components/ui/Skeleton";
import { Icon } from "../../src/components/ui/Icon";
import {
  ArrowLeft01Icon,
  StarIcon,
  PlusSignIcon,
  MapPinIcon,
  Clock01Icon,
} from "../../src/components/icons";
import { ACTIVE_CAMPUS } from "../../src/lib/campus";

type Kitchen = { id: string; name: string; description: string };
type Item = { id: string; name: string; price: number; image_url: string | null };

export default function Kitchen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const { dark } = useTheme();
  const [following, setFollowing] = useState(false);
  const [kitchen, setKitchen] = useState<Kitchen | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) { setLoading(false); return; }
      const { data: s } = await supabase.from("sellers").select("id, store_name, description").eq("id", id).eq("approved", true).maybeSingle();
      if (!alive) return;
      if (!s) { setKitchen(null); setLoading(false); return; }
      setKitchen({ id: (s as any).id, name: (s as any).store_name, description: (s as any).description || "" });
      const { data: m } = await supabase.from("menu_items").select("id, name, price, image_url").eq("seller_id", id).eq("available", true).order("created_at", { ascending: false });
      if (alive) { setItems((m as any) || []); setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  const toggleFollow = () => {
    setFollowing(!following);
    buzz();
    if (kitchen) toast.success(following ? `Unfollowed ${kitchen.name}` : `Following ${kitchen.name}`);
  };

  const handleAdd = (item: Item, e?: any) => {
    if (!kitchen || !id) return;
    addItem({ id: item.id, name: item.name, price: item.price, image_url: item.image_url || "", seller_id: id, seller_name: kitchen.name }, 1);
    if (e) fireFromEvent(e);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    toast.success(`${item.name} added to bag`);
  };

  if (loading) {
    return (
      <View className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`}>
        <Skeleton width="100%" height={300} radius={0} />
        <View className="px-6 pt-5 gap-3"><Skeleton width="70%" height={28} radius={10} /><Skeleton width="100%" height={76} radius={20} /><Skeleton width="100%" height={76} radius={20} /></View>
      </View>
    );
  }

  if (!kitchen) {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-row px-5 pt-1">
          <TouchableOpacity onPress={() => (router.canGoBack() ? router.back() : router.replace("/(buyer)/browse" as any))} accessibilityLabel="Go back" className={`w-11 h-11 rounded-full items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}>
            <Icon icon={ArrowLeft01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
          </TouchableOpacity>
        </View>
        <View className="flex-1 px-6 pt-10">
          <EmptyState title="Kitchen not found" subtitle="It may have been removed by admin." actionLabel="Back to browse" onAction={() => router.replace("/(buyer)/browse" as any)} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <View>
          <View style={{ width: "100%", height: 300 }} className={dark ? "bg-white/10" : "bg-ink/10"}>
            <LinearGradient colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0)", dark ? "rgba(10,10,14,0.92)" : "rgba(250,245,234,0.95)"]} locations={[0, 0.45, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
          </View>
          <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0">
            <View className="flex-row justify-between px-5 pt-1">
              <TouchableOpacity onPress={() => (router.canGoBack() ? router.back() : router.replace("/(buyer)/browse" as any))} accessibilityLabel="Go back" className="w-11 h-11 rounded-full items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <Icon icon={ArrowLeft01Icon} size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <View className="absolute bottom-0 left-0 right-0 px-6 pb-4">
            <View className="flex-row items-center gap-1.5">
              <Icon icon={StarIcon} size={13} color="#fff" />
              <Text className="text-white text-[13px] font-inter-bold">{ACTIVE_CAMPUS.name}</Text>
            </View>
            <View className="flex-row items-end justify-between mt-1.5">
              <Text className="text-white text-[32px] font-serif-bold tracking-tight flex-1">{kitchen.name}</Text>
              <TouchableOpacity onPress={toggleFollow} accessibilityRole="button" accessibilityState={{ selected: following }} accessibilityLabel={following ? `Unfollow ${kitchen.name}` : `Follow ${kitchen.name}`} className={`px-5 h-[44px] rounded-full ml-3 items-center justify-center ${following ? "bg-white/20 border border-white/30" : "bg-white"}`}>
                <Text className={`text-[13px] font-inter-bold ${following ? "text-white" : "text-ink"}`}>{following ? "Following" : "Follow"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-6 pt-5">
          <Enter>
            <View className={`rounded-[24px] p-5 border ${dark ? "bg-white/[0.04] border-white/10" : "bg-white border-border"}`}>
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1.5">
                  <Icon icon={MapPinIcon} size={15} color={dark ? "rgba(255,255,255,0.6)" : "rgba(10,10,14,0.55)"} />
                  <Text className={`text-[13px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>{ACTIVE_CAMPUS.town}</Text>
                </View>
                <View className={`w-px h-4 ${dark ? "bg-white/15" : "bg-ink/10"}`} />
                <View className="flex-row items-center gap-1.5">
                  <Icon icon={Clock01Icon} size={15} color={dark ? "rgba(255,255,255,0.6)" : "rgba(10,10,14,0.55)"} />
                  <Text className={`text-[13px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>Open till late</Text>
                </View>
              </View>
              {kitchen.description ? (
                <Text className={`text-[14px] font-inter leading-[21px] mt-3 ${dark ? "text-white/60" : "text-ink/60"}`}>{kitchen.description}</Text>
              ) : null}
            </View>
          </Enter>

          <View className="mt-7 mb-3">
            <Text className={`text-[21px] font-serif-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Menu · {items.length}</Text>
          </View>
          {items.length === 0 ? (
            <EmptyState title="No items yet" subtitle="Admin hasn't published items for this kitchen." />
          ) : (
            <FlatList
              data={items}
              keyExtractor={(i) => i.id}
              scrollEnabled={false}
              initialNumToRender={10}
              windowSize={5}
              removeClippedSubviews
              renderItem={({ item, index: i }) => (
                <Enter key={item.id} delay={Math.min(i * 40, 120)}>
                  <View className="flex-row items-center py-2">
                    {item.image_url ? (
                      <Image source={{ uri: item.image_url }} style={{ width: 76, height: 76, borderRadius: 20, backgroundColor: dark ? "rgba(255,255,255,0.06)" : "rgba(10,10,14,0.05)" }} contentFit="cover" transition={200} cachePolicy="memory-disk" />
                    ) : (
                      <View style={{ width: 76, height: 76, borderRadius: 20 }} className={dark ? "bg-white/10" : "bg-ink/10"} />
                    )}
                    <View className="flex-1 ml-3.5">
                      <Text className={`font-inter-bold text-[15px] tracking-tight ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>{item.name}</Text>
                      <Text className={`font-inter-bold text-[14px] mt-1 ${dark ? "text-white" : "text-ink"}`}>₦{item.price.toLocaleString()}</Text>
                    </View>
                    <TouchableOpacity onPress={(e) => handleAdd(item, e)} accessibilityLabel={`Add ${item.name}`} className={`w-11 h-11 rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}>
                      <Icon icon={PlusSignIcon} size={18} color={dark ? "#0A0A0E" : "#fff"} />
                    </TouchableOpacity>
                  </View>
                </Enter>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
