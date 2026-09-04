import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCart } from "../../src/stores/cartStore";
import { X, Heart, Minus, Plus } from "lucide-react-native";

const products: Record<string, any> = {
  "pop-1": {
    id: "pop-1",
    name: "Pepperoni Pizza Slice",
    description:
      "Classic pepperoni pizza with melted mozzarella cheese, rich tomato sauce, and crispy crust. Baked to perfection in our stone oven.",
    price: 1500,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    seller_id: "seller-4",
    seller_name: "Pizzeria Delfina",
    sizes: [
      { label: "Regular", price: 0 },
      { label: "Large", price: 800 },
    ],
  },
  "pop-2": {
    id: "pop-2",
    name: "Grilled Chicken Bowl",
    description:
      "Tender grilled chicken breast served over a bed of fluffy rice with sautéed vegetables, fresh salad, and our signature pepper sauce.",
    price: 2200,
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800",
    seller_id: "seller-5",
    seller_name: "Grill House",
    sizes: [
      { label: "Regular", price: 0 },
      { label: "Large", price: 1000 },
    ],
  },
  "pop-3": {
    id: "pop-3",
    name: "Suya Platter",
    description:
      "Authentic Nigerian suya skewers spiced with our special yaji seasoning, served with sliced onions, tomatoes, and fresh pepper.",
    price: 3000,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    seller_id: "seller-6",
    seller_name: "Suya Spot",
    sizes: [
      { label: "Small (6 sticks)", price: 0 },
      { label: "Large (12 sticks)", price: 1500 },
    ],
  },
  "pop-4": {
    id: "pop-4",
    name: "Fish & Chips",
    description:
      "Golden battered haddock fillet served with thick-cut chips, mushy peas, and tartar sauce. Fresh from the fryer to your table.",
    price: 2800,
    image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=800",
    seller_id: "seller-7",
    seller_name: "Ocean Basket",
    sizes: [
      { label: "Regular", price: 0 },
      { label: "Large", price: 1200 },
    ],
  },
  "pop-5": {
    id: "pop-5",
    name: "Burger Meal",
    description:
      "Juicy beef patty with fresh lettuce, tomatoes, pickles, and our special sauce in a toasted brioche bun. Served with golden fries.",
    price: 1800,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    seller_id: "seller-8",
    seller_name: "Burger King",
    sizes: [
      { label: "Single", price: 0 },
      { label: "Double", price: 800 },
    ],
  },
  "pop-6": {
    id: "pop-6",
    name: "Shawarma Wrap",
    description:
      "Tender spiced chicken shawarma wrapped in warm pita bread with garlic sauce, pickled vegetables, and fresh herbs.",
    price: 1200,
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800",
    seller_id: "seller-9",
    seller_name: "Shawarma Express",
    sizes: [
      { label: "Regular", price: 0 },
      { label: "Large", price: 500 },
    ],
  },
  "flash-1": {
    id: "flash-1",
    name: "Chicken & Chips",
    description:
      "Crispy fried chicken pieces with seasoned golden chips, coleslaw, and our signature dipping sauce.",
    price: 2500,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800",
    seller_id: "seller-1",
    seller_name: "Tasty Bites",
    sizes: [
      { label: "Regular", price: 0 },
      { label: "Large", price: 1000 },
    ],
  },
  "flash-2": {
    id: "flash-2",
    name: "Jollof Rice Combo",
    description:
      "Smoky party jollof rice served with fried chicken, fried plantain, and coleslaw. A true Nigerian classic.",
    price: 1800,
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800",
    seller_id: "seller-2",
    seller_name: "Mama Cass",
    sizes: [
      { label: "Regular", price: 0 },
      { label: "Family", price: 2000 },
    ],
  },
};

const defaultProduct = {
  id: "default",
  name: "Product",
  description: "A delicious item from our menu.",
  price: 1000,
  image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
  seller_id: "seller-default",
  seller_name: "Vento Kitchen",
  sizes: [{ label: "Regular", price: 0 }],
};

export default function FoodDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = products[id || ""] || {
    ...defaultProduct,
    id: id || "default",
  };
  const sizePrice = product.sizes[selectedSize]?.price || 0;
  const unitPrice = product.price + sizePrice;
  const totalPrice = (unitPrice * quantity).toLocaleString();

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: unitPrice,
        image_url: product.image,
        seller_id: product.seller_id,
        seller_name: product.seller_name,
      },
      quantity
    );
    Alert.alert(
      "Added to cart",
      `${quantity}x ${product.name} added to your cart`
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Image Section */}
      <View className="relative w-full h-[240px] bg-white overflow-hidden">
        <Image
          source={{ uri: product.image }}
          className="w-full h-full rounded-b-[2rem]"
          resizeMode="cover"
        />
        {/* Floating Actions */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-4 left-4 bg-white w-10 h-10 rounded-full items-center justify-center shadow-md"
        >
          <X color="#1C1B1B" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 bg-white w-10 h-10 rounded-full items-center justify-center shadow-md"
        >
          <Heart
            color={isFavorite ? "#000080" : "#000080"}
            size={20}
            fill={isFavorite ? "#000080" : "none"}
          />
        </TouchableOpacity>
      </View>

      {/* Product Details */}
      <ScrollView
        className="flex-1 px-5 pt-8"
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        {/* Title & Description */}
        <View className="mb-12">
          <Text className="text-2xl font-bold mb-3">{product.name}</Text>
          <Text className="text-gray-500 leading-relaxed">
            {product.description}
          </Text>
        </View>

        <View className="border-t border-gray-200 mb-8" />

        {/* Size Selection */}
        <View className="mb-12">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-bold">Please Choose Size</Text>
            <Text className="text-sm text-gray-500">Required</Text>
          </View>
          <View className="gap-3">
            {product.sizes.map((size: any, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedSize(index)}
                className={`flex-row items-center justify-between p-4 border rounded-xl ${
                  selectedSize === index
                    ? "border-blue-900 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Text className="text-base">{size.label}</Text>
                <View className="flex-row items-center gap-3">
                  {size.price > 0 && (
                    <Text className="text-base text-gray-500">
                      +₦{size.price.toLocaleString()}
                    </Text>
                  )}
                  <View
                    className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                      selectedSize === index
                        ? "border-blue-900"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedSize === index && (
                      <View className="w-2.5 h-2.5 rounded-full bg-blue-900" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 w-full bg-white border-t border-gray-200 px-5 py-4">
        {/* Quantity Selector */}
        <View className="flex-row items-center justify-center gap-6 mb-2">
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-full border border-gray-300 items-center justify-center"
          >
            <Minus color="#9CA3AF" size={16} />
          </TouchableOpacity>
          <Text className="text-base font-bold min-w-[24px] text-center">
            {quantity}
          </Text>
          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-full border border-blue-900 items-center justify-center"
          >
            <Plus color="#000080" size={16} />
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          onPress={handleAddToCart}
          className="w-full bg-blue-900 h-14 rounded-full items-center justify-center shadow-md"
        >
          <Text className="text-white font-bold text-base">
            Add for ₦{totalPrice}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
