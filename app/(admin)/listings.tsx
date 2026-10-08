import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { EmptyState } from "../../src/components/ui/Cards";
import { Skeleton } from "../../src/components/ui/Skeleton";
import { toast } from "sonner-native";
import * as Haptics from "expo-haptics";

// Admin-only catalogue: every listing in the app is published here.
// Buyer/seller screens read sellers + menu_items; they never write.
export default function AdminListings() {
  const { user } = useAuth();
  const { dark } = useTheme();
  const [sellers, setSellers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemSeller, setItemSeller] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: s, error: se } = await supabase.from("sellers").select("*").order("created_at", { ascending: false });
      if (se) throw se;
      const { data: m, error: me } = await supabase.from("menu_items").select("*, sellers(store_name)").order("created_at", { ascending: false }).limit(100);
      if (me) throw me;
      setSellers(s || []);
      setItems(m || []);
      if (!itemSeller && s && s.length > 0) setItemSeller(s[0].id);
    } catch (e: any) {
      setError(e.message || "Couldn't load catalogue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const buzz = (ok: boolean) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
  };

  const createStore = async () => {
    if (!storeName.trim()) { toast.error("Store name required"); return; }
    if (!user) { toast.error("Log in as admin first"); return; }
    setSaving(true);
    try {
      const { data, error } = await supabase.from("sellers").insert({
        owner_id: user.id,
        store_name: storeName.trim(),
        description: storeDesc.trim(),
        approved: true,
        verification_status: "verified",
      }).select().single();
      if (error) throw error;
      if (user) await supabase.from("admin_actions").insert({ admin_id: user.id, action_type: "seller_approved", target_id: data.id, meta: { store_name: data.store_name } });
      setStoreName(""); setStoreDesc("");
      setItemSeller(data.id);
      buzz(true); toast.success(`"${data.store_name}" published`);
      load();
    } catch (e: any) { buzz(false); toast.error(e.message || "Couldn't create store"); }
    finally { setSaving(false); }
  };

  const createItem = async () => {
    const price = Math.round(Number(String(itemPrice).replace(/[^0-9.]/g, "")));
    if (!itemName.trim()) { toast.error("Add an item name"); return; }
    if (!price || price <= 0) { toast.error("Enter a valid price"); return; }
    if (!itemSeller) { toast.error("Create a store first"); return; }
    setSaving(true);
    try {
      const { data, error } = await supabase.from("menu_items").insert({
        seller_id: itemSeller,
        name: itemName.trim(),
        description: "",
        price,
        category: "mains",
        prep_time: 25,
        available: true,
      }).select().single();
      if (error) throw error;
      if (user) await supabase.from("admin_actions").insert({ admin_id: user.id, action_type: "listing_published", target_id: data.id, meta: { name: data.name } });
      setItemName(""); setItemPrice("");
      buzz(true); toast.success(`"${data.name}" is live`);
      load();
    } catch (e: any) { buzz(false); toast.error(e.message || "Couldn't publish item"); }
    finally { setSaving(false); }
  };

  const toggleAvailable = async (item: any) => {
    try {
      const { error } = await supabase.from("menu_items").update({ available: !item.available }).eq("id", item.id);
      if (error) throw error;
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i)));
    } catch (e: any) { toast.error(e.message || "Couldn't update"); }
  };

  const deleteItem = async (item: any) => {
    Alert.alert(`Delete "${item.name}"?`, "Buyers will stop seeing it immediately.", [
      { text: "Keep", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        const { error } = await supabase.from("menu_items").delete().eq("id", item.id);
        if (error) { toast.error(error.message); return; }
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        toast.success("Deleted");
      } },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 px-5 pt-4 gap-3">
          <Skeleton width="60%" height={28} radius={10} />
          <Skeleton width="100%" height={120} radius={24} />
          <Skeleton width="100%" height={120} radius={24} />
          <Skeleton width="100%" height={120} radius={24} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 120, paddingTop: 12, gap: 16 }} showsVerticalScrollIndicator={false}>
        <View>
          <Eyebrow>Admin · Catalogue</Eyebrow>
          <Text className={`text-[28px] font-inter-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>Listings</Text>
          <Text className={`text-[13px] font-inter mt-1 ${dark ? "text-white/55" : "text-ink/55"}`}>Only admin publishes. Buyer app reads this — no mocks.</Text>
        </View>

        {error ? (
          <EmptyState title="Couldn't load catalogue" subtitle={error} actionLabel="Retry" onAction={load} />
        ) : null}

        <View className={`rounded-[24px] p-6 border gap-3 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <Text className={`text-[15px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>1 · New store</Text>
          <TextField placeholder="Store name — e.g. Suya Spot" value={storeName} onChangeText={setStoreName} />
          <TextField placeholder="Description (optional)" value={storeDesc} onChangeText={setStoreDesc} />
          <AppButton title="Publish store" variant="ink" loading={saving} onPress={createStore} />
        </View>

        <View className={`rounded-[24px] p-6 border gap-3 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
          <Text className={`text-[15px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>2 · New item</Text>
          <View className="flex-row flex-wrap gap-2">
            {sellers.map((s) => (
              <TouchableOpacity key={s.id} onPress={() => setItemSeller(s.id)} accessibilityRole="button" accessibilityState={{ selected: itemSeller === s.id }} className={`px-4 h-[44px] rounded-full items-center justify-center border ${itemSeller === s.id ? (dark ? "bg-white border-white" : "bg-ink border-ink") : dark ? "border-white/15" : "border-ink/15"}`}>
                <Text className={`text-[13px] font-inter-bold ${itemSeller === s.id ? (dark ? "text-ink" : "text-white") : dark ? "text-white" : "text-ink"}`}>{s.store_name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {sellers.length === 0 ? <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Create a store first.</Text> : null}
          <TextField placeholder="Item name — e.g. Suya Platter" value={itemName} onChangeText={setItemName} />
          <TextField placeholder="Price — e.g. 3000" value={itemPrice} onChangeText={setItemPrice} keyboardType="numeric" />
          <AppButton title="Publish item" variant={dark ? "white" : "ink"} loading={saving} onPress={createItem} />
        </View>

        <View>
          <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] mb-3 ${dark ? "text-white/50" : "text-ink/50"}`}>Live items · {items.length}</Text>
          {items.length === 0 ? (
            <EmptyState title="Catalogue is empty" subtitle="Publish a store + item above. Buyers see an honest empty state until then." />
          ) : (
            <View className="gap-2.5">
              {items.map((item) => (
                <View key={item.id} className={`rounded-[20px] p-4 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-3">
                      <Text className={`font-inter-bold text-[15px] ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>{item.name}</Text>
                      <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-white/50" : "text-ink/50"}`}>{item.sellers?.store_name || "Store"} · ₦{Number(item.price).toLocaleString()}</Text>
                    </View>
                    <StatusChip label={item.available ? "Live" : "Hidden"} tone={item.available ? "success" : "neutral"} />
                  </View>
                  <View className="flex-row gap-2 mt-3">
                    <TouchableOpacity onPress={() => toggleAvailable(item)} accessibilityRole="button" accessibilityLabel={item.available ? `Hide ${item.name}` : `Show ${item.name}`} className={`flex-1 h-[44px] rounded-full items-center justify-center border ${dark ? "border-white/15" : "border-ink/15"}`}>
                      <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>{item.available ? "Hide" : "Show"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteItem(item)} accessibilityRole="button" accessibilityLabel={`Delete ${item.name}`} className="flex-1 h-[44px] rounded-full items-center justify-center bg-[#D92D20]">
                      <Text className="text-[13px] font-inter-bold text-white">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
