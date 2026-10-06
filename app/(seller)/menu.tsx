import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, Switch, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import {
  PlusSignIcon,
  Edit02Icon,
  Delete02Icon,
  Camera01Icon,
  Package01Icon,
  ArrowLeft01Icon,
} from "../../src/components/icons";

const categories = [
  { key: "lunch", label: "Meals" },
  { key: "snacks", label: "Snacks" },
  { key: "drinks", label: "Drinks" },
  { key: "desserts", label: "Desserts" },
  { key: "breakfast", label: "Breakfast" },
  { key: "dinner", label: "Dinner" },
];

const mockFoodItems = [
  {
    id: "food-001",
    name: "Jollof Rice Special",
    description: "Aromatic Nigerian jollof rice with premium tomato sauce",
    price: 1500,
    category: "lunch",
    prep_time: 15,
    available: true,
    image_url: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400",
  },
  {
    id: "food-002",
    name: "Fried Rice & Chicken",
    description: "Nigerian-style fried rice with grilled chicken",
    price: 1800,
    category: "lunch",
    prep_time: 20,
    available: true,
    image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
  },
  {
    id: "food-003",
    name: "Puff Puff (6 pieces)",
    description: "Sweet Nigerian puff puff",
    price: 400,
    category: "snacks",
    prep_time: 10,
    available: false,
    image_url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400",
  },
];

export default function MenuManagement() {
  const { profile } = useAuth();
  const { dark } = useTheme();
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "lunch" as string,
    prep_time: "15",
    available: true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Admin-only publishing: sellers read the live catalogue, never write.
        const { data, error } = await supabase
          .from("menu_items")
          .select("id, name, description, price, category, prep_time, available, image_url")
          .eq("available", true)
          .order("created_at", { ascending: false })
          .limit(100);
        if (error) throw error;
        if (alive) setFoodItems(data || []);
      } catch {
        if (alive) setFoodItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [profile]);

  const buzz = (ok: boolean) => {
    if (Platform.OS !== "web") {
      if (ok) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      else Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
  };

  const handleSubmit = () => {
    // Listings are published exclusively via the admin app (admin@vento.ng → Listings).
    buzz(false);
    toast.error("Listings are published by admin only");
    setDialogOpen(false);
    resetForm();
  };
  const handleDelete = (id: string) => {
    buzz(false);
    toast.error("Listings are published by admin only");
  };

  const adminOnly = () => {
    buzz(false);
    toast.error("Listings are published by admin only");
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", category: "lunch", prep_time: "15", available: true });
    setImagePreview(null);
    setEditingItem(null);
  };

  const toggleAvailability = (item: any) => {
    adminOnly();
  };

  const openEditDialog = (item: any) => {
    adminOnly();
  };

  const openAddDialog = () => {
    adminOnly();
  };

  if (loading && foodItems.length === 0) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <View className="px-5 pt-4 pb-4 flex-row items-center justify-between">
        <View>
          <Eyebrow>Catalogue</Eyebrow>
          <Text className={`text-[28px] font-inter-bold mt-1 tracking-tight ${dark ? "text-white" : "text-ink"}`}>My Menu</Text>
          <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>{foodItems.length} live items · published by admin</Text>
        </View>
        <TouchableOpacity
          onPress={openAddDialog}
          activeOpacity={0.85}
          className={`flex-row items-center gap-2 px-5 h-14 rounded-full ${dark ? "bg-white" : "bg-ink"}`}
        >
          <Icon icon={PlusSignIcon} size={18} color={dark ? "#0A0A0E" : "#fff"} />
          <Text className={`font-inter-bold text-[13px] ${dark ? "text-ink" : "text-white"}`}>Add item</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {foodItems.length === 0 ? (
          <View className={`rounded-[28px] p-8 items-center border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className={`w-16 h-16 mb-4 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
              <Icon icon={Package01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
            </View>
            <Text className={`font-inter-bold mb-2 ${dark ? "text-white" : "text-ink"}`}>No live items</Text>
            <Text className={`font-inter mb-4 text-[13px] text-center ${dark ? "text-white/55" : "text-ink/55"}`}>Listings are published by admin only. New items appear here automatically.</Text>
            <AppButton title="Refresh" variant={dark ? "white" : "ink"} onPress={() => setLoading(true)} />
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {foodItems.map((item) => (
              <View key={item.id} className={`w-[48%] rounded-[24px] overflow-hidden border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                <View className={`relative ${dark ? "bg-white/10" : "bg-cream"}`} style={{ aspectRatio: 1 }}>
                  {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={{ width: "100%", height: "100%" }} contentFit="cover" transition={200} />
                  ) : (
                    <View className="w-full h-full items-center justify-center">
                      <Icon icon={Package01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
                    </View>
                  )}
                  <View className="absolute top-2 right-2 flex-row gap-1.5">
                    <TouchableOpacity
                      onPress={() => openEditDialog(item)}
                      activeOpacity={0.85}
                      className="w-9 h-9 bg-white rounded-full items-center justify-center border border-border"
                    >
                      <Icon icon={Edit02Icon} size={15} color="#0A0A0E" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      activeOpacity={0.85}
                      className="w-9 h-9 bg-white rounded-full items-center justify-center border border-border"
                    >
                      <Icon icon={Delete02Icon} size={15} color="#D92D20" />
                    </TouchableOpacity>
                  </View>
                  {!item.available && (
                    <View className="absolute inset-0 bg-black/40 items-center justify-center">
                      <View className="px-3 py-1.5 rounded-full bg-white">
                        <Text className="text-ink text-xs font-inter-bold">Unavailable</Text>
                      </View>
                    </View>
                  )}
                </View>
                <View className="p-3.5">
                  <Text className={`font-inter-bold text-[13px] ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className={`font-inter-bold mt-1 ${dark ? "text-white" : "text-ink"}`}>₦{item.price.toFixed(2)}</Text>
                  <View className="flex-row items-center justify-between mt-2">
                    <StatusChip label={item.category} tone="neutral" />
                    <Switch
                      value={item.available}
                      onValueChange={() => toggleAvailability(item)}
                      trackColor={{ true: dark ? "#FFFFFF" : "#0A0A0E", false: dark ? "rgba(255,255,255,0.2)" : "#D1D1D1" }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={dialogOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setDialogOpen(false);
          resetForm();
        }}
      >
        <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
          <View className="flex-row items-center justify-between px-5 pt-4 pb-4">
            <Text className={`text-xl font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
              {editingItem ? "Edit item" : "Add new item"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setDialogOpen(false);
                resetForm();
              }}
              activeOpacity={0.85}
              className={`w-10 h-10 rounded-full border items-center justify-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
            >
              <Icon icon={ArrowLeft01Icon} size={16} color={dark ? "#fff" : "#0A0A0E"} />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            <View className="gap-4">
              <View className={`rounded-[24px] border p-4 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => toast.success("Photo picker coming soon")}
                  className={`border-2 border-dashed rounded-[20px] p-6 items-center ${dark ? "border-white/10 bg-white/10" : "border-border bg-cream"}`}
                >
                  <View className={`w-12 h-12 mb-3 rounded-full items-center justify-center border ${dark ? "bg-white/10 border-white/10" : "bg-white border-border"}`}>
                    <Icon icon={Camera01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
                  </View>
                  <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Upload photo</Text>
                  <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Tap to select from gallery</Text>
                </TouchableOpacity>
              </View>

              <View className={`rounded-[24px] border p-5 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                <TextField label="Food name" value={formData.name} onChangeText={(v) => setFormData({ ...formData, name: v })} placeholder="e.g. Spicy Ramen Bowl" />
              </View>

              <View className={`rounded-[24px] border p-5 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                <Text className={`text-[13px] font-inter-bold mb-2 ${dark ? "text-white" : "text-ink"}`}>Category</Text>
                <View className="flex-row flex-wrap gap-2 mt-1">
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.key}
                      onPress={() => setFormData({ ...formData, category: cat.key })}
                      activeOpacity={0.85}
                      className={`px-4 h-11 justify-center rounded-full border ${
                        formData.category === cat.key
                          ? dark ? "bg-white border-white" : "bg-ink border-ink"
                          : dark ? "bg-white/10 border-white/10" : "bg-white border-border"
                      }`}
                    >
                      <Text className={`text-[13px] font-inter-bold ${formData.category === cat.key ? (dark ? "text-ink" : "text-white") : (dark ? "text-white" : "text-ink")}`}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className={`rounded-[24px] border p-5 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                <TextField label="Price (₦)" value={formData.price} onChangeText={(v) => setFormData({ ...formData, price: v })} placeholder="0.00" keyboardType="numeric" />
              </View>

              <View className={`rounded-[24px] border p-5 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                <TextField label="Description" value={formData.description} onChangeText={(v) => setFormData({ ...formData, description: v })} placeholder="Ingredients, portion size, allergens..." multiline numberOfLines={3} />
              </View>

              <View className={`flex-row items-center justify-between p-5 rounded-[24px] border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                <View>
                  <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Available now</Text>
                  <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Show on menu immediately</Text>
                </View>
                <Switch
                  value={formData.available}
                  onValueChange={(v) => setFormData({ ...formData, available: v })}
                  trackColor={{ true: dark ? "#FFFFFF" : "#0A0A0E", false: dark ? "rgba(255,255,255,0.2)" : "#D1D1D1" }}
                />
              </View>

              <AppButton title={editingItem ? "Update Item" : "Add to Menu"} variant={dark ? "white" : "ink"} onPress={handleSubmit} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
