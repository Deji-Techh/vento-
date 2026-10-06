import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../../src/stores/cartStore";
import { useTheme } from "../../src/contexts/ThemeContext";
import { fireFromEvent } from "../../src/stores/flyStore";
import { supabase } from "../../src/lib/supabase";
import { buzz } from "../../src/lib/haptics";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { Enter } from "../../src/components/motion";
import { EmptyState } from "../../src/components/ui/Cards";
import { Skeleton } from "../../src/components/ui/Skeleton";
import { Icon } from "../../src/components/ui/Icon";
import {
  ArrowLeft01Icon,
  FavouriteIcon,
  StarIcon,
  MinusSignIcon,
  PlusSignIcon,
  MapPinIcon,
} from "../../src/components/icons";

type Product = { id: string; name: string; description: string; price: number; image_url: string | null; seller_id: string; seller_name: string; prep_time: number; category: string };

export default function FoodDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const { dark } = useTheme();
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = useState(1);
  const [fav, setFav] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) { setLoading(false); return; }
      try {
        const { data, error } = await supabase
          .from("menu_items")
          .select("id, name, description, price, image_url, seller_id, prep_time, category, available, sellers(store_name)")
          .eq("id", id)
          .maybeSingle();
        if (error) throw error;
        if (!data || !(data as any).available) { if (alive) setProduct(null); return; }
        if (alive) setProduct({ id: (data as any).id, name: (data as any).name, description: (data as any).description || "", price: (data as any).price, image_url: (data as any).image_url, seller_id: (data as any).seller_id, seller_name: (data as any).sellers?.store_name || "Kitchen", prep_time: (data as any).prep_time ?? 25, category: (data as any).category || "mains" });
      } catch (e: any) {
        if (alive) setError(e.message || "Couldn't load this item");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const step = (d: number) => {
    setQuantity(Math.max(1, Math.min(20, quantity + d)));
    buzz();
  };

  const handleAdd = (e?: any) => {
    if (!product) return;
    addItem({ id: product.id, name: product.name, price: product.price, image_url: product.image_url || "", seller_id: product.seller_id, seller_name: product.seller_name }, quantity);
    if (e) fireFromEvent(e);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    toast.success(`${quantity} × ${product.name} added to bag`, { action: { label: "View bag", onClick: () => router.push("/(buyer)/cart" as any) } });
  };

  if (loading) {
    return (
      <View className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`}>
        <Skeleton width="100%" height={400} radius={0} />
        <View className="px-6 pt-5 gap-3"><Skeleton width="60%" height={20} radius={8} /><Skeleton width="90%" height={30} radius={10} /><Skeleton width="100%" height={80} radius={16} /></View>
      </View>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-row px-5 pt-1">
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" className={`w-11 h-11 rounded-full items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}>
            <Icon icon={ArrowLeft01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
          </TouchableOpacity>
        </View>
        <View className="flex-1 px-6 pt-10">
          <EmptyState title="Item unavailable" subtitle={error || "This item was removed or hidden by admin."} actionLabel="Back to browse" onAction={() => router.replace("/(buyer)/browse" as any)} />
        </View>
      </SafeAreaView>
    );
  }

  const total = (product.price * quantity).toLocaleString();

  return (
    <View className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 210 }}>
        <View>
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={{ width: "100%", height: 400 }} contentFit="cover" transition={200} cachePolicy="memory-disk" priority="high" />
          ) : (
            <View style={{ width: "100%", height: 400 }} className={dark ? "bg-white/10" : "bg-ink/10"} />
          )}
          <LinearGradient
            colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0)", dark ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.95)"]}
            locations={[0, 0.45, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0">
            <View className="flex-row justify-between px-5 pt-1">
              <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" className="w-11 h-11 rounded-full items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <Icon icon={ArrowLeft01Icon} size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setFav(!fav); buzz(); }}
                accessibilityLabel={fav ? "Remove from favourites" : "Save to favourites"}
                className="w-11 h-11 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <Icon icon={FavouriteIcon} size={20} color={fav ? "#fff" : "rgba(255,255,255,0.55)"} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        <View className="px-6 pt-5">
          <Enter>
            <View className="flex-row items-center gap-1.5">
              <Icon icon={MapPinIcon} size={13} color={dark ? "rgba(255,255,255,0.5)" : "rgba(10,10,14,0.5)"} />
              <Text className={`text-[11px] font-inter-bold tracking-[2px] uppercase ${dark ? "text-white/50" : "text-ink/50"}`}>
                {product.seller_name} • ~{product.prep_time} min
              </Text>
            </View>
            <Text className={`text-[30px] font-display-bold tracking-tight mt-2 ${dark ? "text-white" : "text-ink"}`}>{product.name}</Text>
            <View className="flex-row items-center gap-1.5 mt-2.5">
              <Icon icon={StarIcon} size={14} color={dark ? "#fff" : "#0A0A0E"} />
              <Text className={`text-[13px] font-inter ${dark ? "text-white/45" : "text-ink/50"}`}>{product.category} · ₦{product.price.toLocaleString()}</Text>
            </View>
            {product.description ? (
              <Text className={`text-[15px] font-inter leading-[23px] mt-3 ${dark ? "text-white/55" : "text-ink/60"}`}>{product.description}</Text>
            ) : null}
          </Enter>
        </View>
      </ScrollView>

      <View className={`absolute bottom-0 w-full px-5 pt-4 border-t ${dark ? "bg-ink border-white/10" : "bg-cream border-border"}`} style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
        <View className="flex-row items-center gap-3 mb-3.5">
          <View className={`flex-row items-center rounded-full p-1 ${dark ? "bg-white/[0.07]" : "bg-ink/[0.05]"}`}>
            <TouchableOpacity onPress={() => step(-1)} accessibilityLabel="Decrease quantity" hitSlop={8} className="w-11 h-11 rounded-full items-center justify-center">
              <Icon icon={MinusSignIcon} size={17} color={dark ? "#fff" : "#0A0A0E"} />
            </TouchableOpacity>
            <Text accessibilityLabel={`Quantity ${quantity}`} className={`w-9 text-center font-inter-bold text-[16px] ${dark ? "text-white" : "text-ink"}`}>{quantity}</Text>
            <TouchableOpacity onPress={() => step(1)} accessibilityLabel="Increase quantity" hitSlop={8} className={`w-11 h-11 rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}>
              <Icon icon={PlusSignIcon} size={18} color={dark ? "#0A0A0E" : "#fff"} />
            </TouchableOpacity>
          </View>
          <View className="flex-1">
            <AppButton title={`Add to bag · ₦${total}`} variant={dark ? "white" : "ink"} onPress={(e) => handleAdd(e)} />
          </View>
        </View>
      </View>
    </View>
  );
}
