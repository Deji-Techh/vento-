import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "../../src/stores/cartStore";
import {
  Search,
  Camera,
  ChevronRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Zap,
  Tag,
  Clock,
  Star,
} from "lucide-react-native";

const categories = [
  { id: "all", label: "All" },
  { id: "grocery", label: "Grocery" },
  { id: "restaurants", label: "Restaurants" },
  { id: "convenience", label: "Convenience" },
  { id: "alcohol", label: "Alcohol" },
  { id: "pharmacy", label: "Pharmacy" },
];

const flashDeals = [
  {
    id: "flash-1",
    name: "Chicken & Chips",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400",
    price: 2500,
    seller_id: "seller-1",
    seller_name: "Tasty Bites",
  },
  {
    id: "flash-2",
    name: "Jollof Rice Combo",
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400",
    price: 1800,
    seller_id: "seller-2",
    seller_name: "Mama Cass",
  },
];

const clearanceDeals = [
  {
    id: "clear-1",
    name: "Fresh Fruit Bowl",
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400",
    price: 1200,
    seller_id: "seller-3",
    seller_name: "Fresh Mart",
  },
  {
    id: "clear-2",
    name: "Smoothie Pack",
    image: "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=400",
    price: 800,
    seller_id: "seller-3",
    seller_name: "Fresh Mart",
  },
];

const popularItems = [
  {
    id: "pop-1",
    name: "Pepperoni Pizza Slice",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    price: 1500,
    rating: 4.5,
    delivery: "25 min",
    seller_id: "seller-4",
    seller_name: "Pizzeria Delfina",
  },
  {
    id: "pop-2",
    name: "Grilled Chicken Bowl",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400",
    price: 2200,
    rating: 4.7,
    delivery: "30 min",
    seller_id: "seller-5",
    seller_name: "Grill House",
  },
  {
    id: "pop-3",
    name: "Suya Platter",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
    price: 3000,
    rating: 4.8,
    delivery: "20 min",
    seller_id: "seller-6",
    seller_name: "Suya Spot",
  },
  {
    id: "pop-4",
    name: "Fish & Chips",
    image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400",
    price: 2800,
    rating: 4.4,
    delivery: "35 min",
    seller_id: "seller-7",
    seller_name: "Ocean Basket",
  },
  {
    id: "pop-5",
    name: "Burger Meal",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    price: 1800,
    rating: 4.6,
    delivery: "22 min",
    seller_id: "seller-8",
    seller_name: "Burger King",
  },
  {
    id: "pop-6",
    name: "Shawarma Wrap",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400",
    price: 1200,
    rating: 4.3,
    delivery: "18 min",
    seller_id: "seller-9",
    seller_name: "Shawarma Express",
  },
];

const expressDelivery = [
  {
    id: "exp-1",
    name: "Instant Noodles Pack",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    price: 500,
    badge: "Under 15 min",
    seller_id: "seller-10",
    seller_name: "Quick Mart",
  },
  {
    id: "exp-2",
    name: "Cold Drink Combo",
    image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400",
    price: 800,
    badge: "Under 15 min",
    seller_id: "seller-10",
    seller_name: "Quick Mart",
  },
];

export default function Browse() {
  const router = useRouter();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddToCart = (item: { id: string; name: string; price: number; image: string; seller_id: string; seller_name: string }) => {
    addItem(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image,
        seller_id: item.seller_id,
        seller_name: item.seller_name,
      },
      1
    );
    Alert.alert("Added to cart", `${item.name} added to your cart`);
  };

  return (
    <ScrollView className="flex-1 bg-white pb-4">
      {/* Search Bar */}
      <View className="px-4 pt-10 pb-3">
        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-full border border-gray-200 px-4 py-2.5">
            <Search color="#9CA3AF" size={20} />
            <TextInput
              placeholder="What are you craving?"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 bg-transparent text-sm ml-2"
            />
            <TouchableOpacity className="ml-2 p-1">
              <Camera color="#9CA3AF" size={20} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="w-11 h-11 bg-blue-900 rounded-full items-center justify-center">
            <Search color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Tabs */}
      <View className="border-b border-gray-200">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-3"
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              className="mr-6"
            >
              <Text
                className={`text-sm font-semibold pb-1 ${
                  activeCategory === cat.id
                    ? "text-gray-900 border-b-2 border-blue-900"
                    : "text-gray-500"
                }`}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="gap-4">
        {/* Free Shipping / Returns Banner */}
        <View className="mx-4 mt-4 bg-gray-50 rounded-lg border border-gray-200 p-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Truck color="#000080" size={20} />
            <View>
              <Text className="text-sm font-semibold">Free delivery</Text>
              <Text className="text-xs text-gray-500">
                on orders above ₦3,000
              </Text>
            </View>
          </View>
          <View className="w-px h-8 bg-gray-200" />
          <View className="flex-row items-center gap-2">
            <RotateCcw color="#000080" size={20} />
            <View>
              <Text className="text-sm font-semibold">Easy returns</Text>
              <Text className="text-xs text-gray-500">for EVERY order</Text>
            </View>
          </View>
        </View>

        {/* Price Match Banner */}
        <TouchableOpacity className="mx-4 bg-blue-900 rounded-lg p-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <ShieldCheck color="#FFFFFF" size={20} />
            <Text className="text-sm font-bold text-white">
              Vento Price Guarantee — Never overpay
            </Text>
          </View>
          <ChevronRight color="#FFFFFF" size={20} />
        </TouchableOpacity>

        {/* Flash & Clearance Deals */}
        <View className="px-4 flex-row gap-3">
          {/* Flash Deals */}
          <View className="flex-1 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <View className="p-3 flex-row items-center gap-1">
              <Zap color="#000080" size={16} />
              <Text className="text-sm font-bold">Flash Deals</Text>
              <ChevronRight color="#9CA3AF" size={16} style={{ marginLeft: "auto" }} />
            </View>
            <View className="px-3 pb-3 flex-row flex-wrap gap-2">
              {flashDeals.map((item) => (
                <View key={item.id} className="w-[48%]">
                  <Image
                    source={{ uri: item.image }}
                    className="w-full aspect-square rounded-lg mb-1"
                    resizeMode="cover"
                  />
                  <Text className="text-xs font-semibold truncate">
                    {item.name}
                  </Text>
                  <View className="flex-row items-center justify-between mt-1">
                    <Text className="text-xs font-bold text-blue-900">
                      ₦{item.price.toLocaleString()}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleAddToCart(item)}
                      className="w-7 h-7 bg-blue-900 rounded-full items-center justify-center"
                    >
                      <Text className="text-white text-sm font-bold">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Clearance */}
          <View className="flex-1 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <View className="p-3 flex-row items-center gap-1">
              <Tag color="#000080" size={16} />
              <Text className="text-sm font-bold">Clearance</Text>
              <ChevronRight color="#9CA3AF" size={16} style={{ marginLeft: "auto" }} />
            </View>
            <View className="px-3 pb-3 flex-row flex-wrap gap-2">
              {clearanceDeals.map((item) => (
                <View key={item.id} className="w-[48%]">
                  <Image
                    source={{ uri: item.image }}
                    className="w-full aspect-square rounded-lg mb-1"
                    resizeMode="cover"
                  />
                  <Text className="text-xs font-semibold truncate">
                    {item.name}
                  </Text>
                  <View className="flex-row items-center justify-between mt-1">
                    <Text className="text-xs font-bold text-blue-900">
                      ₦{item.price.toLocaleString()}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleAddToCart(item)}
                      className="w-7 h-7 bg-blue-900 rounded-full items-center justify-center"
                    >
                      <Text className="text-white text-sm font-bold">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Popular Items Grid */}
        <View className="px-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold">Popular Near You</Text>
            <TouchableOpacity className="flex-row items-center gap-1">
              <Text className="text-sm text-blue-900 font-medium">See all</Text>
              <ChevronRight color="#000080" size={16} />
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap gap-3">
            {popularItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  router.push(`/(buyer)/food-details?id=${item.id}`)
                }
                className="w-[48%] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
              >
                <View className="relative">
                  <Image
                    source={{ uri: item.image }}
                    className="w-full aspect-square"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation?.();
                      handleAddToCart(item);
                    }}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-md items-center justify-center border border-gray-200"
                  >
                    <Text className="text-lg text-gray-900 leading-none">+</Text>
                  </TouchableOpacity>
                </View>
                <View className="p-2.5">
                  <Text className="text-sm font-semibold truncate">
                    {item.name}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <Clock color="#9CA3AF" size={12} />
                    <Text className="text-xs text-gray-500">{item.delivery}</Text>
                    <Text className="text-xs text-gray-500">•</Text>
                    <Star color="#000080" size={12} />
                    <Text className="text-xs text-gray-500">{item.rating}</Text>
                  </View>
                  <Text className="text-sm font-bold text-gray-900 mt-1">
                    ₦{item.price.toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Express Delivery */}
        <View className="px-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold">Express Delivery</Text>
            <TouchableOpacity className="flex-row items-center gap-1">
              <Text className="text-sm text-blue-900 font-medium">See all</Text>
              <ChevronRight color="#000080" size={16} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
            {expressDelivery.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="w-[160px] mr-3 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
              >
                <View className="relative">
                  <Image
                    source={{ uri: item.image }}
                    className="w-full aspect-square"
                    resizeMode="cover"
                  />
                  <View className="absolute top-2 left-2 bg-blue-900 px-2 py-0.5 rounded-full">
                    <Text className="text-white text-[10px] font-bold">
                      {item.badge}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleAddToCart(item)}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-md items-center justify-center border border-gray-200"
                  >
                    <Text className="text-lg text-gray-900 leading-none">+</Text>
                  </TouchableOpacity>
                </View>
                <View className="p-2">
                  <Text className="text-xs font-semibold truncate">
                    {item.name}
                  </Text>
                  <Text className="text-xs font-bold text-gray-900 mt-0.5">
                    ₦{item.price.toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}
