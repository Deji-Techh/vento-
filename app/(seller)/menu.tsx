import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { Plus, Edit, Trash2, X, Camera, UtensilsCrossed } from "lucide-react-native";
import { AppButton } from "../../src/components/ui/AppButton";

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
    setTimeout(() => {
      setFoodItems(mockFoodItems);
      setLoading(false);
    }, 800);
  }, [profile]);

  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (editingItem) {
      setFoodItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                prep_time: parseInt(formData.prep_time),
                available: formData.available,
                image_url: imagePreview || item.image_url,
              }
            : item
        )
      );
      Alert.alert("Success", "Food item updated successfully!");
    } else {
      const newItem = {
        id: `food-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        prep_time: parseInt(formData.prep_time),
        available: formData.available,
        image_url: imagePreview,
        created_at: new Date().toISOString(),
      };
      setFoodItems((prev) => [newItem, ...prev]);
      Alert.alert("Success", "Food item added successfully!");
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setFoodItems((prev) => prev.filter((item) => item.id !== id));
          Alert.alert("Success", "Food item deleted successfully!");
        },
      },
    ]);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "lunch",
      prep_time: "15",
      available: true,
    });
    setImagePreview(null);
    setEditingItem(null);
  };

  const toggleAvailability = (item: any) => {
    setFoodItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, available: !i.available } : i
      )
    );
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      category: item.category,
      prep_time: item.prep_time?.toString() || "15",
      available: item.available,
    });
    setImagePreview(item.image_url);
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (loading && foodItems.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FAF5EA]">
        <ActivityIndicator size="large" color="#1B1B8F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FAF5EA]">
      {/* Header */}
      <View className="px-5 pt-14 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">
            Catalogue
          </Text>
          <Text className="text-[28px] font-bold text-ink mt-1">My Menu</Text>
          <Text className="text-sm text-ink/55">{foodItems.length} items</Text>
        </View>
        <TouchableOpacity
          onPress={openAddDialog}
          activeOpacity={0.85}
          className="flex-row items-center gap-2 px-5 h-14 rounded-full bg-ink"
        >
          <Plus color="#FFFFFF" size={18} />
          <Text className="text-white font-bold text-sm">Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items Grid */}
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 120 }}>
        {foodItems.length === 0 ? (
          <View className="bg-white rounded-[28px] p-8 items-center border border-[#E7E0D2]">
            <View className="w-16 h-16 mb-4 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
              <UtensilsCrossed color="#1B1B8F" size={22} />
            </View>
            <Text className="font-bold text-ink mb-2">
              No menu items yet
            </Text>
            <Text className="text-ink/55 mb-4">
              Add your first item to start selling
            </Text>
            <AppButton title="Add First Item" variant="ink" onPress={openAddDialog} />
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {foodItems.map((item) => (
              <View
                key={item.id}
                className="w-[48%] bg-white rounded-[26px] overflow-hidden border border-[#E7E0D2]"
              >
                <View className="aspect-square bg-[#FAF5EA] relative">
                  {item.image_url ? (
                    <Image
                      source={{ uri: item.image_url }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center">
                      <UtensilsCrossed color="#1B1B8F" size={22} />
                    </View>
                  )}
                  <View className="absolute top-2 right-2 flex-row gap-1.5">
                    <TouchableOpacity
                      onPress={() => openEditDialog(item)}
                      className="w-9 h-9 bg-white rounded-full items-center justify-center border border-[#E7E0D2]"
                    >
                      <Edit color="#0A0A0E" size={15} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      className="w-9 h-9 bg-white rounded-full items-center justify-center border border-[#E7E0D2]"
                    >
                      <Trash2 color="#C0361F" size={15} />
                    </TouchableOpacity>
                  </View>
                  {!item.available && (
                    <View className="absolute inset-0 bg-black/40 items-center justify-center">
                      <View className="px-3 py-1.5 rounded-full bg-white">
                        <Text className="text-ink text-xs font-bold">
                          Unavailable
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
                <View className="p-3.5">
                  <Text className="font-bold text-ink text-sm" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-[#1B1B8F] font-bold mt-1">
                    ₦{item.price.toFixed(2)}
                  </Text>
                  <View className="flex-row items-center justify-between mt-2">
                    <View className="px-2.5 py-1 rounded-full bg-[#FAF5EA] border border-[#E7E0D2]">
                      <Text className="text-[11px] font-bold text-ink capitalize">
                        {item.category}
                      </Text>
                    </View>
                    <Switch
                      value={item.available}
                      onValueChange={() => toggleAvailability(item)}
                      trackColor={{ true: "#1B1B8F", false: "#D8D2C4" }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={dialogOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setDialogOpen(false);
          resetForm();
        }}
      >
        <View className="flex-1 bg-[#FAF5EA]">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between px-5 pt-6 pb-4">
            <Text className="text-xl font-bold text-ink">
              {editingItem ? "Edit Item" : "Add New Item"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setDialogOpen(false);
                resetForm();
              }}
              className="w-10 h-10 rounded-full bg-white border border-[#E7E0D2] items-center justify-center"
            >
              <X color="#0A0A0E" size={16} />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
            <View className="gap-4">
              {/* Image Upload */}
              <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-4">
                <TouchableOpacity className="border-2 border-dashed rounded-[20px] p-6 items-center border-[#E7E0D2] bg-[#FAF5EA]">
                  <View className="w-12 h-12 mb-3 rounded-full bg-white items-center justify-center border border-[#E7E0D2]">
                    <Camera color="#1B1B8F" size={22} />
                  </View>
                  <Text className="font-bold text-ink">
                    Upload Photo
                  </Text>
                  <Text className="text-sm text-ink/55">
                    Tap to select from gallery
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Food Name */}
              <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-5">
                <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55">
                  Food Name
                </Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(val) =>
                    setFormData({ ...formData, name: val })
                  }
                  placeholder="e.g. Spicy Ramen Bowl"
                  placeholderTextColor="#9CA3AF"
                  className="mt-2 w-full h-14 px-4 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] text-ink"
                />
              </View>

              {/* Category */}
              <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-5">
                <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55">
                  Category
                </Text>
                <View className="flex-row flex-wrap gap-2 mt-3">
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.key}
                      onPress={() =>
                        setFormData({ ...formData, category: cat.key })
                      }
                      className={`px-4 h-11 justify-center rounded-full border ${
                        formData.category === cat.key
                          ? "bg-ink border-ink"
                          : "bg-white border-[#E7E0D2]"
                      }`}
                    >
                      <Text
                        className={`text-sm font-bold ${
                          formData.category === cat.key
                            ? "text-white"
                            : "text-ink"
                        }`}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price */}
              <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-5">
                <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55">
                  Price
                </Text>
                <View className="mt-2 flex-row items-center bg-[#FAF5EA] border border-[#E7E0D2] rounded-full h-14 px-4 gap-1">
                  <Text className="text-ink/55 font-bold">₦</Text>
                  <TextInput
                    value={formData.price}
                    onChangeText={(val) =>
                      setFormData({ ...formData, price: val })
                    }
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    className="flex-1 text-ink"
                  />
                </View>
              </View>

              {/* Description */}
              <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-5">
                <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55">
                  Description
                </Text>
                <TextInput
                  value={formData.description}
                  onChangeText={(val) =>
                    setFormData({ ...formData, description: val })
                  }
                  placeholder="Describe ingredients, portion size, and any allergens..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="mt-2 w-full p-4 rounded-[20px] bg-[#FAF5EA] border border-[#E7E0D2] text-ink min-h-[96px]"
                />
              </View>

              {/* Available Now Toggle */}
              <View className="flex-row items-center justify-between p-5 bg-white rounded-[26px] border border-[#E7E0D2]">
                <View>
                  <Text className="font-bold text-ink">
                    Available Now
                  </Text>
                  <Text className="text-sm text-ink/55">
                    Show on menu immediately
                  </Text>
                </View>
                <Switch
                  value={formData.available}
                  onValueChange={(val) =>
                    setFormData({ ...formData, available: val })
                  }
                  trackColor={{ true: "#1B1B8F", false: "#D8D2C4" }}
                />
              </View>

              {/* Submit Button */}
              <AppButton
                title={editingItem ? "Update Item" : "Add to Menu"}
                variant="ink"
                onPress={handleSubmit}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
