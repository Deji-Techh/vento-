import { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, Platform, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { buzz } from "../../src/lib/haptics";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { EmptyState } from "../../src/components/ui/Cards";
import { StatusChip } from "../../src/components/ui/SectionHeader";
import { Enter } from "../../src/components/motion";
import { Icon } from "../../src/components/ui/Icon";
import {
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  Wallet01Icon,
} from "../../src/components/icons";

type Kind = "order" | "deal" | "wallet";

type Item = {
  id: string;
  kind: Kind;
  title: string;
  body: string;
  time: string;
  read: boolean;
  image?: string;
  tag?: string;
  status?: string;
  progress?: number;
  amount?: string;
  href?: string;
};

const filters = ["All", "Orders", "Deals", "Wallet"] as const;

export default function Notifications() {
  const router = useRouter();
  const { user } = useAuth();
  const { dark } = useTheme();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) { setItems([]); setLoading(false); setRefreshing(false); return; }
    try {
      const { data, error } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      setItems(
        (data || []).map((n: any) => ({
          id: n.id, kind: n.kind, title: n.title, body: n.body || "", time: new Date(n.created_at).toLocaleString(),
          image: n.image_url || undefined, href: n.href || undefined, read: n.read,
        }))
      );
    } catch {
      // honest empty state below
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel(`notifications:${user.id}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => load()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, load]);

  const unread = (id: string) => !items.find((i) => i.id === id)?.read;
  const visible = items.filter((i) => {
    if (filter === "Orders") return i.kind === "order";
    if (filter === "Deals") return i.kind === "deal";
    if (filter === "Wallet") return i.kind === "wallet";
    return true;
  });
  const unreadCount = items.filter((i) => unread(i.id)).length;

  const open = async (item: Item) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, read: true } : i)));
    buzz();
    await supabase.from("notifications").update({ read: true }).eq("id", item.id);
    if (item.href) router.push(item.href as any);
  };

  const markAll = async () => {
    if (!user) return;
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    buzz("success");
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
  };

  const card = `rounded-[24px] overflow-hidden border mb-3 ${dark ? "bg-white/[0.04] border-white/10" : "bg-white border-border"}`;

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <View className="px-5 pt-1 pb-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 items-center justify-center">
            <Icon icon={ArrowLeft01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
          </TouchableOpacity>
          <Text className={`text-[28px] font-display-bold tracking-tight ml-3 ${dark ? "text-white" : "text-ink"}`}>
            Inbox{unreadCount > 0 ? ` · ${unreadCount}` : ""}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAll} className="active:opacity-60">
            <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Read all</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-5 mb-4" contentContainerStyle={{ paddingRight: 20 }} style={{ flexGrow: 0 }}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => {
              setFilter(f);
              if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
            }}
            className={`mr-2 px-5 py-2.5 rounded-full ${filter === f ? (dark ? "bg-white" : "bg-ink") : dark ? "bg-white/[0.07]" : "bg-ink/[0.05]"}`}
          >
            <Text className={`text-[13px] font-inter-bold ${filter === f ? (dark ? "text-ink" : "text-white") : dark ? "text-white/60" : "text-ink/55"}`}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40, gap: 12 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        windowSize={5}
        removeClippedSubviews
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); buzz(); load(); }} tintColor={dark ? "#fff" : "#0A0A0E"} />}
        ListEmptyComponent={
          loading ? (
            <Text className={`text-[13px] font-inter text-center py-8 ${dark ? "text-white/50" : "text-ink/50"}`}>Loading inbox…</Text>
          ) : !user ? (
            <EmptyState title="Sign in for updates" subtitle="Order, deal and wallet alerts land here." actionLabel="Log in" onAction={() => router.push("/auth/login" as any)} />
          ) : (
            <EmptyState title="All quiet" subtitle="Order updates, deals and wallet alerts appear here." />
          )
        }
        ListFooterComponent={visible.length > 0 && unreadCount === 0 ? (
          <View className="items-center mt-2">
            <View className="flex-row items-center gap-1.5">
              <Icon icon={CheckmarkCircle01Icon} size={14} color={dark ? "rgba(255,255,255,0.4)" : "rgba(10,10,14,0.35)"} />
              <Text className={`text-[12px] font-inter-medium ${dark ? "text-white/40" : "text-ink/40"}`}>All caught up</Text>
            </View>
          </View>
        ) : null}
        renderItem={({ item, index: i }) => (
          <Enter key={item.id} delay={Math.min(i * 50, 150)}>
            {item.kind === "deal" && item.image ? (
              <TouchableOpacity onPress={() => open(item)} activeOpacity={0.92} className={card}>
                <View>
                  <Image source={{ uri: item.image }} style={{ width: "100%", height: 150 }} contentFit="cover" transition={250} />
                  <LinearGradient
                    colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)"]}
                    locations={[0.4, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                  />
                  {item.tag && (
                    <View className="absolute top-3 left-3 bg-white px-3 py-1.5 rounded-full">
                      <Text className="text-ink text-[11px] font-inter-bold">{item.tag}</Text>
                    </View>
                  )}
                  <View className="absolute bottom-0 left-0 right-0 p-4">
                    <Text className="text-white text-[17px] font-inter-bold tracking-tight">{item.title}</Text>
                    <Text className="text-white/70 text-[12px] font-inter mt-0.5" numberOfLines={1}>{item.body}</Text>
                  </View>
                </View>
                <View className="px-4 py-3 flex-row items-center justify-between">
                  <Text className={`text-[12px] font-inter ${dark ? "text-white/45" : "text-ink/45"}`}>{item.time}</Text>
                  <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Order now ›</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => open(item)} activeOpacity={0.9} className={`${card} ${unread(item.id) ? (dark ? "bg-white/[0.07]" : "bg-ink/[0.04]") : ""}`}>
                <View className="flex-row gap-3.5 p-4">
                  {unread(item.id) && <View className={`w-1 rounded-full ${dark ? "bg-white" : "bg-ink"}`} />}
                  {item.kind === "wallet" ? (
                    <View className="w-[68px] h-[68px] rounded-[18px] items-center justify-center bg-success/15 shrink-0">
                      <Icon icon={Wallet01Icon} size={26} color="#0E9F6E" />
                    </View>
                  ) : (
                    item.image ? <Image source={{ uri: item.image }} style={{ width: 68, height: 68, borderRadius: 18 }} contentFit="cover" transition={200} /> : <View style={{ width: 68, height: 68, borderRadius: 18 }} className={dark ? "bg-white/10" : "bg-ink/10"} />
                  )}
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between gap-2">
                      <Text className={`text-[15px] font-inter-bold flex-1 ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>
                        {item.kind === "wallet" ? item.amount : item.title}
                      </Text>
                      <Text className={`text-[12px] font-inter shrink-0 ${dark ? "text-white/40" : "text-ink/40"}`}>{item.time}</Text>
                    </View>
                    <Text className={`text-[13px] font-inter mt-0.5 leading-[19px] ${dark ? "text-white/60" : "text-ink/60"}`} numberOfLines={2}>
                      {item.kind === "wallet" ? item.body : item.body}
                    </Text>
                    {item.status && (
                      <View className="mt-2 flex-row items-center gap-2">
                        <StatusChip label={item.status} tone={item.progress === 1 ? "success" : "info"} />
                        {item.progress != null && item.progress < 1 && (
                          <View className={`flex-1 h-1 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-ink/10"}`}>
                            <View className={`h-full rounded-full ${dark ? "bg-white" : "bg-ink"}`} style={{ width: `${item.progress * 100}%` }} />
                          </View>
                        )}
                      </View>
                    )}
                    {item.kind === "wallet" && (
                      <View className="mt-2">
                        <StatusChip label="Wallet credited" tone="success" />
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </Enter>
        )}
      />
    </SafeAreaView>
  );
}
