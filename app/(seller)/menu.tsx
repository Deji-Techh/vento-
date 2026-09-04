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
import { Plus, Edit, Trash2, X, Camera, ArrowRight } from "lucide-react-native";

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
      <View className="flex-1 items-center justify-center bg-[#f8f6f5]">
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f8f6f5]">
      {/* Header */}
      <View className="px-4 pt-6 pb-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-gray-900">My Menu</Text>
        <TouchableOpacity
          onPress={openAddDialog}
          className="flex-row items-center gap-2 px-4 py-2 bg-blue-900 rounded-full"
        >
          <Plus color="#FFFFFF" size={16} />
          <Text className="text-white font-semibold text-sm">Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items Grid */}
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {foodItems.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center">
            <View className="w-16 h-16 mb-4 rounded-full bg-blue-50 items-center justify-center">
              <Text className="text-2xl">🍽️</Text>
            </View>
            <Text className="font-bold text-gray-900 mb-2">
              No menu items yet
            </Text>
            <Text className="text-gray-500 mb-4">
              Add your first item to start selling
            </Text>
            <TouchableOpacity
              onPress={openAddDialog}
              className="px-6 py-3 bg-blue-900 rounded-2xl"
            >
              <Text className="text-white font-semibold">Add First Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {foodItems.map((item) => (
              <View
                key={item.id}
                className="w-[48%] bg-white rounded-2xl overflow-hidden"
              >
                <View className="aspect-square bg-gray-100 relative">
                  {item.image_url ? (
                    <Image
                      source={{ uri: item.image_url }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center">
                      <Text className="text-3xl">🍽️</Text>
                    </View>
                  )}
                  <View className="absolute top-2 right-2 flex-row gap-1">
                    <TouchableOpacity
                      onPress={() => openEditDialog(item)}
                      className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
                    >
                      <Edit color="#1C1B1B" size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
                    >
                      <Trash2 color="#EF4444" size={16} />
                    </TouchableOpacity>
                  </View>
                  {!item.available && (
                    <View className="absolute inset-0 bg-black/50 items-center justify-center">
                      <Text className="text-white font-semibold">
                        Unavailable
                      </Text>
                    </View>
                  )}
                </View>
                <View className="p-3">
                  <Text className="font-semibold text-gray-900 text-sm truncate">
                    {item.name}
                  </Text>
                  <Text className="text-blue-900 font-bold mt-1">
                    ₦{item.price.toFixed(2)}
                  </Text>
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-xs text-gray-500 capitalize">
                      {item.category}
                    </Text>
                    <Switch
                      value={item.available}
                      onValueChange={() => toggleAvailability(item)}
                      trackColor={{ true: "#000080", false: "#D1D5DB" }}
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
        <View className="flex-1 bg-white">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-bold">
              {editingItem ? "Edit Item" : "Add New Item"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setDialogOpen(false);
                resetForm();
              }}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <X color="#1C1B1B" size={16} />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 40 }}>
            <View className="gap-5">
              {/* Image Upload */}
              <View>
                <TouchableOpacity className="border-2 border-dashed rounded-2xl p-6 items-center border-gray-300">
                  <View className="w-12 h-12 mb-3 rounded-full bg-blue-50 items-center justify-center">
                    <Camera color="#000080" size={24} />
                  </View>
                  <Text className="font-semibold text-gray-900">
                    Upload Photo
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Tap to select from gallery
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Food Name */}
              <View>
                <Text className="text-sm font-semibold text-gray-900">
                  Food Name
                </Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(val) =>
                    setFormData({ ...formData, name: val })
                  }
                  placeholder="e.g. Spicy Ramen Bowl"
                  placeholderTextColor="#9CA3AF"
                  className="mt-2 w-full h-12 px-4 rounded-2xl bg-gray-100 text-gray-900"
                />
              </View>

              {/* Category */}
              <View>
                <Text className="text-sm font-semibold text-gray-900">
                  Category
                </Text>
                <View className="flex-row flex-wrap gap-2 mt-2">
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.key}
                      onPress={() =>
                        setFormData({ ...formData, category: cat.key })
                      }
                      className={`px-4 py-2 rounded-full ${
                        formData.category === cat.key
                          ? "bg-blue-900"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          formData.category === cat.key
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price */}
              <View>
                <Text className="text-sm font-semibold text-gray-900">
                  Price
                </Text>
                <View className="relative mt-2">
                  <Text className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₦
                  </Text>
                  <TextInput
                    value={formData.price}
                    onChangeText={(val) =>
                      setFormData({ ...formData, price: val })
                    }
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    className="w-full h-12 pl-8 pr-4 rounded-2xl bg-gray-100 text-gray-900"
                  />
                </View>
              </View>

              {/* Description */}
              <View>
                <Text className="text-sm font-semibold text-gray-900">
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
                  className="mt-2 w-full p-4 rounded-2xl bg-gray-100 text-gray-900"
                />
              </View>

              {/* Available Now Toggle */}
              <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <View>
                  <Text className="font-semibold text-gray-900">
                    Available Now
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Show on menu immediately
                  </Text>
                </View>
                <Switch
                  value={formData.available}
                  onValueChange={(val) =>
                    setFormData({ ...formData, available: val })
                  }
                  trackColor={{ true: "#000080", false: "#D1D5DB" }}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                className="w-full h-14 bg-blue-900 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg"
              >
                <Text className="text-white font-bold">
                  {editingItem ? "Update Item" : "Add to Menu"}
                </Text>
                <ArrowRight color="#FFFFFF" size={20} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
