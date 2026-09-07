import { useState } from "react";
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../src/stores/cartStore";
import { Search, Bell } from "lucide-react-native";
import { SectionHeader, Eyebrow } from "../../src/components/ui/SectionHeader";
import { StoryRow, FoodSnapCard, PromoBanner } from "../../src/components/ui/Cards";
import { Reveal } from "../../src/components/ui/Reveal";

const categories = ["All", "Grocery", "Restaurants", "Convenience", "Alcohol", "Pharmacy"];

const stories = [
  { id: "s1", label: "Tasty Bites", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200" },
  { id: "s2", label: "Mama Cass", image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200" },
  { id: "s3", label: "Fresh Mart", image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=200" },
  { id: "s4", label: "Grill House", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200" },
  { id: "s5", label: "Suya Spot", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
];

const popularItems = [
  { id: "pop-1", name: "Pepperoni Pizza Slice", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600", price: 1500, rating: 4.5, delivery: "25 min", seller_id: "seller-4", seller_name: "Pizzeria Delfina" },
  { id: "pop-2", name: "Grilled Chicken Bowl", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600", price: 2200, rating: 4.7, delivery: "30 min", seller_id: "seller-5", seller_name: "Grill House" },
  { id: "pop-3", name: "Suya Platter", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600", price: 3000, rating: 4.8, delivery: "20 min", seller_id: "seller-6", seller_name: "Suya Spot" },
  { id: "pop-4", name: "Fish & Chips", image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600", price: 2800, rating: 4.4, delivery: "35 min", seller_id: "seller-7", seller_name: "Ocean Basket" },
  { id: "pop-5", name: "Burger Meal", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600", price: 1800, rating: 4.6, delivery: "22 min", seller_id: "seller-8", seller_name: "Burger King" },
  { id: "pop-6", name: "Shawarma Wrap", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600", price: 1200, rating: 4.3, delivery: "18 min", seller_id: "seller-9", seller_name: "Shawarma Express" },
];

export default function Browse() {
  const router = useRouter();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAdd = (item: any) => {
    addItem({ id: item.id, name: item.name, price: item.price, image_url: item.image, seller_id: item.seller_id, seller_name: item.seller_name }, 1);
    Alert.alert("Added to bag", item.name);
  };

  return (
    <SafeAreaView className="flex-1 bg-ink" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-2 flex-row items-center justify-between">
          <Text className="text-white text-[22px] font-bold tracking-tight">Vento</Text>
          <View className="flex-row items-center gap-2.5">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
              <Search color="#fff" size={18} />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
              <Bell color="#fff" size={18} />
            </TouchableOpacity>
            <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
              <Text className="text-ink font-bold">C</Text>
            </View>
          </View>
        </View>

        {/* Greeting + search */}
        <Reveal delay={60}>
          <View className="px-5 mt-5">
          <Text className="text-white text-[28px] font-bold tracking-tight leading-[30px]">What are we{"\n"}eating today?</Text>
          <View className="flex-row items-center bg-white/[0.07] border border-white/10 rounded-full pl-4 pr-1.5 py-1.5 mt-4">
            <Search color="rgba(255,255,255,0.45)" size={17} />
            <TextInput
              placeholder="Jollof, suya, shawarma…"
              placeholderTextColor="rgba(255,255,255,0.38)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-white text-[15px] ml-2"
            />
            <View className="bg-white px-4 py-2.5 rounded-full">
              <Text className="text-ink text-[13px] font-bold">Search</Text>
            </View>
          </View>
        </View>
        </Reveal>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-5 pl-5" contentContainerStyle={{ paddingRight: 20 }}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setActiveCategory(c)}
              className={`mr-2 px-5 py-2.5 rounded-full ${activeCategory === c ? "bg-white" : "bg-white/[0.07]"}`}
            >
              <Text className={`text-[13px] font-bold ${activeCategory === c ? "text-ink" : "text-white/60"}`}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured hero */}
        <Reveal delay={140}>
          <View className="px-5 mt-5">
          <TouchableOpacity
            activeOpacity={0.94}
            onPress={() => router.push(`/(buyer)/food-details?id=pop-3` as any)}
            className="rounded-[28px] overflow-hidden"
          >
            <Image source={{ uri: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900" }} className="w-full h-[320px]" resizeMode="cover" />
            <View className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.28)" }} />
            <View className="absolute top-4 left-4">
              <Eyebrow dark>Featured</Eyebrow>
            </View>
            <View className="absolute bottom-0 left-0 right-0 p-5">
              <Text className="text-white text-[26px] font-bold tracking-tight">Suya Platter</Text>
              <Text className="text-white/70 text-[13px] mt-1">Fire-grilled. Yaji-dusted. Unmissable.</Text>
              <View className="flex-row items-center justify-between mt-3.5">
                <Text className="text-white/70 text-[12px] font-semibold">Suya Spot • 20 min</Text>
                <View className="bg-white px-5 py-2.5 rounded-full">
                  <Text className="text-ink text-[13px] font-bold">Order</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <View className="items-center mt-2.5 flex-row justify-center gap-1.5">
            <View className="w-6 h-1.5 rounded-full bg-white" />
            <View className="w-1.5 h-1.5 rounded-full bg-white/25" />
            <View className="w-1.5 h-1.5 rounded-full bg-white/25" />
          </View>
        </View>
        </Reveal>

        {/* Single ember moment */}
        <Reveal delay={200}>
          <View className="px-5 mt-4">
            <PromoBanner title="Midnight craving?" subtitle="Hot food from kitchens still open near you." cta="Order" />
          </View>
        </Reveal>

        {/* Stories */}
        <Reveal delay={260}>
          <View className="mt-7 pl-5">
            <View className="pr-5">
              <SectionHeader title="Kitchens you follow" action="See all" dark />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
              <StoryRow items={stories} />
            </ScrollView>
          </View>
        </Reveal>

        {/* For you */}
        <Reveal delay={320}>
          <View className="mt-7">
            <View className="px-5">
              <SectionHeader title="For you" action="See all" dark />
            </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }} snapToInterval={220} decelerationRate="fast">
            {popularItems.map((item) => (
              <FoodSnapCard
                key={item.id}
                name={item.name}
                price={item.price}
                image={item.image}
                rating={item.rating}
                meta={`${item.seller_name} • ${item.delivery}`}
                onPress={() => router.push(`/(buyer)/food-details?id=${item.id}` as any)}
                onAdd={() => handleAdd(item)}
              />
            ))}
          </ScrollView>
        </View>
        </Reveal>

        {/* Nearby list */}
        <Reveal delay={380}>
          <View className="px-5 mt-7">
          <SectionHeader title="Nearby" action="See all" dark />
          <View className="gap-2.5">
            {popularItems.slice(0, 4).map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/(buyer)/food-details?id=${item.id}` as any)}
                activeOpacity={0.9}
                className="flex-row items-center py-2"
              >
                <Image source={{ uri: item.image }} className="w-[76px] h-[76px] rounded-2xl" resizeMode="cover" />
                <View className="flex-1 ml-3.5">
                  <Text className="text-white font-bold text-[15px] tracking-tight" numberOfLines={1}>{item.name}</Text>
                  <Text className="text-white/45 text-[12px] mt-1">{item.seller_name} • {item.delivery} • ★ {item.rating}</Text>
                  <Text className="text-white font-bold text-[14px] mt-1">₦{item.price.toLocaleString()}</Text>
                </View>
                <TouchableOpacity onPress={() => handleAdd(item)} className="w-10 h-10 rounded-full bg-white items-center justify-center">
                  <Text className="text-ink text-[20px] font-bold -mt-0.5">+</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        </Reveal>
      </ScrollView>
    </SafeAreaView>
  );
}
