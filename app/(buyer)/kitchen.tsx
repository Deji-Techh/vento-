import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../../src/stores/cartStore";
import { useTheme } from "../../src/contexts/ThemeContext";
import { fireFromEvent } from "../../src/stores/flyStore";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { Enter } from "../../src/components/motion";
import { Icon } from "../../src/components/ui/Icon";
import {
  ArrowLeft01Icon,
  StarIcon,
  PlusSignIcon,
  MapPinIcon,
  Clock01Icon,
} from "../../src/components/icons";

const kitchens: Record<string, any> = {
  s1: {
    name: "Tasty Bites", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800",
    rating: 4.6, eta: "25 min", tags: ["Fast food", "Chicken"], about: "Crispy chicken, loaded fries and all-day breakfast, two minutes from Main Gate.",
    items: [
      { id: "k1-1", name: "Chicken & Chips", price: 2500, image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=300", rating: 4.5 },
      { id: "k1-2", name: "Burger Meal", price: 1800, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300", rating: 4.6 },
      { id: "k1-3", name: "Fish & Chips", price: 2800, image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=300", rating: 4.4 },
      { id: "k1-4", name: "Shawarma Wrap", price: 1200, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300", rating: 4.3 },
    ],
  },
  s2: {
    name: "Mama Cass", image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800",
    rating: 4.7, eta: "30 min", tags: ["Local", "Rice"], about: "Party jollof, smoky ofada and Sunday-style combos, cooked fresh every morning.",
    items: [
      { id: "k2-1", name: "Jollof Rice Combo", price: 1800, image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=300", rating: 4.6 },
      { id: "k2-2", name: "Grilled Chicken Bowl", price: 2200, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300", rating: 4.7 },
      { id: "k2-3", name: "Pepperoni Pizza Slice", price: 1500, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300", rating: 4.5 },
    ],
  },
  s3: {
    name: "Fresh Mart", image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800",
    rating: 4.5, eta: "20 min", tags: ["Groceries", "Fresh"], about: "Farm fruit, smoothies and daily essentials delivered in minutes.",
    items: [
      { id: "k3-1", name: "Fresh Fruit Bowl", price: 1500, image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=300", rating: 4.5 },
      { id: "k3-2", name: "Grilled Chicken Bowl", price: 2200, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300", rating: 4.7 },
    ],
  },
  s4: {
    name: "Grill House", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800",
    rating: 4.8, eta: "30 min", tags: ["Grills", "BBQ"], about: "Char-grilled chicken, turkey and fish with house pepper sauce.",
    items: [
      { id: "k4-1", name: "Grilled Chicken Bowl", price: 2200, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300", rating: 4.7 },
      { id: "k4-2", name: "Suya Platter", price: 3000, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300", rating: 4.8 },
      { id: "k4-3", name: "Fish & Chips", price: 2800, image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=300", rating: 4.4 },
    ],
  },
  s5: {
    name: "Suya Spot", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    rating: 4.9, eta: "20 min", tags: ["Suya", "Late night"], about: "Yaji-dusted suya off open flames, till 2 AM every night.",
    items: [
      { id: "k5-1", name: "Suya Platter", price: 3000, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300", rating: 4.8 },
      { id: "k5-2", name: "Shawarma Wrap", price: 1200, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300", rating: 4.3 },
      { id: "k5-3", name: "Grilled Chicken Bowl", price: 2200, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300", rating: 4.7 },
    ],
  },
};

export default function Kitchen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const { dark } = useTheme();
  const [following, setFollowing] = useState(true);

  const kitchen = kitchens[id || ""] || kitchens.s1;

  const toggleFollow = () => {
    setFollowing(!following);
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    toast.success(following ? `Unfollowed ${kitchen.name}` : `Following ${kitchen.name}`);
  };

  const handleAdd = (item: any, e?: any) => {
    addItem({ id: item.id, name: item.name, price: item.price, image_url: item.image, seller_id: id || "s", seller_name: kitchen.name }, 1);
    if (e) fireFromEvent(e);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    toast.success(`${item.name} added to bag`);
  };

  return (
    <View className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <View>
          <Image source={{ uri: kitchen.image }} style={{ width: "100%", height: 300 }} contentFit="cover" transition={200} cachePolicy="memory-disk" priority="high" />
          <LinearGradient
            colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0)", dark ? "rgba(10,10,14,0.92)" : "rgba(250,245,234,0.95)"]}
            locations={[0, 0.45, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0">
            <View className="flex-row justify-between px-5 pt-1">
              <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <Icon icon={ArrowLeft01Icon} size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <View className="absolute bottom-0 left-0 right-0 px-6 pb-4">
            <View className="flex-row items-center gap-1.5">
              <Icon icon={StarIcon} size={13} color="#fff" />
              <Text className="text-white text-[13px] font-inter-bold">{kitchen.rating}</Text>
              <Text className="text-white/60 text-[13px] font-inter">• {kitchen.eta} • {kitchen.tags.join(" · ")}</Text>
            </View>
            <View className="flex-row items-end justify-between mt-1.5">
              <Text className="text-white text-[32px] font-display-bold tracking-tight flex-1">{kitchen.name}</Text>
              <TouchableOpacity
                onPress={toggleFollow}
                className={`px-5 py-2.5 rounded-full ml-3 ${following ? "bg-white/20 border border-white/30" : "bg-white"}`}
              >
                <Text className={`text-[13px] font-inter-bold ${following ? "text-white" : "text-ink"}`}>
                  {following ? "Following" : "Follow"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-6 pt-5">
          <Enter>
            <View className={`rounded-[24px] p-5 border ${dark ? "bg-white/[0.04] border-white/10" : "bg-white border-border"}`}>
              <View className="flex-row items-center gap-4">
                <View className={`flex-row items-center gap-1.5 ${dark ? "" : ""}`}>
                  <Icon icon={MapPinIcon} size={15} color={dark ? "rgba(255,255,255,0.6)" : "rgba(10,10,14,0.55)"} />
                  <Text className={`text-[13px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>Campus Gate</Text>
                </View>
                <View className={`w-px h-4 ${dark ? "bg-white/15" : "bg-ink/10"}`} />
                <View className="flex-row items-center gap-1.5">
                  <Icon icon={Clock01Icon} size={15} color={dark ? "rgba(255,255,255,0.6)" : "rgba(10,10,14,0.55)"} />
                  <Text className={`text-[13px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>Open till late</Text>
                </View>
              </View>
              <Text className={`text-[14px] font-inter leading-[21px] mt-3 ${dark ? "text-white/60" : "text-ink/60"}`}>
                {kitchen.about}
              </Text>
            </View>
          </Enter>

          <View className="mt-7 mb-3">
            <Text className={`text-[21px] font-display-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
              Their works · {kitchen.items.length}
            </Text>
          </View>
          <View className="gap-2.5">
            {kitchen.items.map((item: any, i: number) => (
              <Enter key={item.id} delay={Math.min(i * 40, 120)}>
                <View className="flex-row items-center py-2">
                  <Image source={{ uri: item.image }} style={{ width: 76, height: 76, borderRadius: 20, backgroundColor: dark ? "rgba(255,255,255,0.06)" : "rgba(10,10,14,0.05)" }} contentFit="cover" transition={200} cachePolicy="memory-disk" />
                  <View className="flex-1 ml-3.5">
                    <Text className={`font-inter-bold text-[15px] tracking-tight ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>{item.name}</Text>
                    <View className="flex-row items-center gap-1 mt-1">
                      <Icon icon={StarIcon} size={12} color={dark ? "rgba(255,255,255,0.55)" : "rgba(10,10,14,0.5)"} />
                      <Text className={`text-[12px] font-inter ${dark ? "text-white/45" : "text-ink/50"}`}>{item.rating}</Text>
                    </View>
                    <Text className={`font-inter-bold text-[14px] mt-1 ${dark ? "text-white" : "text-ink"}`}>₦{item.price.toLocaleString()}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={(e) => handleAdd(item, e)}
                    className={`w-10 h-10 rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}
                  >
                    <Icon icon={PlusSignIcon} size={18} color={dark ? "#0A0A0E" : "#fff"} />
                  </TouchableOpacity>
                </View>
              </Enter>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
