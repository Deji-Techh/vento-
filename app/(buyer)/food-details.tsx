import { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../src/stores/cartStore";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { ChevronLeft, Heart, Minus, Plus } from "lucide-react-native";
import { AppButton } from "../../src/components/ui/AppButton";

const products: Record<string, any> = {
  "pop-1": { id: "pop-1", name: "Pepperoni Pizza Slice", description: "Stone-oven pepperoni, molten mozzarella, crisp crust. Simple and perfect.", price: 1500, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900", seller_id: "seller-4", seller_name: "Pizzeria Delfina", sizes: [{ label: "Regular", price: 0 }, { label: "Large", price: 800 }] },
  "pop-2": { id: "pop-2", name: "Grilled Chicken Bowl", description: "Char-grilled chicken, fluffy rice, sautéed veg, pepper sauce.", price: 2200, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=900", seller_id: "seller-5", seller_name: "Grill House", sizes: [{ label: "Regular", price: 0 }, { label: "Large", price: 1000 }] },
  "pop-3": { id: "pop-3", name: "Suya Platter", description: "Yaji-spiced suya, onions, tomatoes. Best eaten hot, with friends.", price: 3000, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900", seller_id: "seller-6", seller_name: "Suya Spot", sizes: [{ label: "6 sticks", price: 0 }, { label: "12 sticks", price: 1500 }] },
  "pop-4": { id: "pop-4", name: "Fish & Chips", description: "Golden haddock, thick chips, tartar. Crispy all the way home.", price: 2800, image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=900", seller_id: "seller-7", seller_name: "Ocean Basket", sizes: [{ label: "Regular", price: 0 }, { label: "Large", price: 1200 }] },
  "pop-5": { id: "pop-5", name: "Burger Meal", description: "Smashed patty, pickles, special sauce, brioche + fries.", price: 1800, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900", seller_id: "seller-8", seller_name: "Burger King", sizes: [{ label: "Single", price: 0 }, { label: "Double", price: 800 }] },
  "pop-6": { id: "pop-6", name: "Shawarma Wrap", description: "Spiced chicken, garlic sauce, pickles in warm pita.", price: 1200, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=900", seller_id: "seller-9", seller_name: "Shawarma Express", sizes: [{ label: "Regular", price: 0 }, { label: "Large", price: 500 }] },
  "flash-1": { id: "flash-1", name: "Chicken & Chips", description: "Crispy chicken, seasoned chips, house dip.", price: 2500, image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=900", seller_id: "seller-1", seller_name: "Tasty Bites", sizes: [{ label: "Regular", price: 0 }, { label: "Large", price: 1000 }] },
  "flash-2": { id: "flash-2", name: "Jollof Rice Combo", description: "Party jollof, chicken, plantain, coleslaw.", price: 1800, image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=900", seller_id: "seller-2", seller_name: "Mama Cass", sizes: [{ label: "Regular", price: 0 }, { label: "Family", price: 2000 }] },
};

const fallback = { id: "default", name: "Dish", description: "Fresh from the kitchen.", price: 1000, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900", seller_id: "s", seller_name: "Vento Kitchen", sizes: [{ label: "Regular", price: 0 }] };

export default function FoodDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(0);
  const [fav, setFav] = useState(false);

  const product = products[id || ""] || { ...fallback, id: id || "default" };
  const total = ((product.price + (product.sizes[selectedSize]?.price || 0)) * quantity).toLocaleString();

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price + (product.sizes[selectedSize]?.price || 0), image_url: product.image, seller_id: product.seller_id, seller_name: product.seller_name }, quantity);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    toast.success(`${quantity} × ${product.name} added to bag`);
  };

  return (
    <View className="flex-1 bg-ink">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 200 }}>
        <View>
          <Image source={{ uri: product.image }} className="w-full h-[400px]" resizeMode="cover" />
          <View className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.22)" }} />
          <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0">
            <View className="flex-row justify-between px-5 pt-1">
              <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <ChevronLeft color="#fff" size={22} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFav(!fav)} className="w-11 h-11 rounded-full items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <Heart color="#fff" size={20} fill={fav ? "#fff" : "none"} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        <View className="px-6 pt-6">
          <>
            <Text className="text-white/50 text-[11px] font-bold tracking-[2px] uppercase">{product.seller_name} • 20–30 min</Text>
            <Text className="text-white text-[30px] font-bold tracking-tight mt-2">{product.name}</Text>
            <Text className="text-white/55 text-[15px] leading-[23px] mt-3">{product.description}</Text>
          </>

          <>
            <Text className="text-white text-[17px] font-bold mt-8 mb-3">Size</Text>
          <View className="gap-2.5">
            {product.sizes.map((s: any, i: number) => (
              <TouchableOpacity
                key={i}
                onPress={() => setSelectedSize(i)}
                activeOpacity={0.9}
                className={`flex-row items-center justify-between px-5 py-4 rounded-[20px] ${selectedSize === i ? "bg-white" : "bg-white/[0.06]"}`}
              >
                <Text className={`text-[15px] font-bold ${selectedSize === i ? "text-ink" : "text-white"}`}>{s.label}</Text>
                <View className="flex-row items-center gap-3">
                  {s.price > 0 && <Text className={`text-[14px] ${selectedSize === i ? "text-ink/60" : "text-white/50"}`}>+₦{s.price.toLocaleString()}</Text>}
                  <View className={`w-5 h-5 rounded-full items-center justify-center ${selectedSize === i ? "bg-ink" : "border-2 border-white/25"}`}>
                    {selectedSize === i && <Text className="text-white text-[10px] font-bold">✓</Text>}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          </>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full px-5 bg-ink border-t border-white/10 pt-4" style={{ paddingBottom: 34 }}>
        <View className="flex-row items-center justify-between mb-3.5">
          <View className="flex-row items-center bg-white/[0.07] rounded-full p-1">
            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full items-center justify-center">
              <Minus color="#fff" size={17} />
            </TouchableOpacity>
            <Text className="w-9 text-center font-bold text-white text-[16px]">{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full bg-white items-center justify-center">
              <Plus color="#0A0A0E" size={18} />
            </TouchableOpacity>
          </View>
          <Text className="text-white text-[20px] font-bold">₦{total}</Text>
        </View>
        <AppButton title="Add to bag" variant="white" onPress={handleAdd} />
      </View>
    </View>
  );
}
