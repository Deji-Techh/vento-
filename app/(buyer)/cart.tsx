import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../src/stores/cartStore";
import { ChevronLeft, Minus, Plus, Trash2 } from "lucide-react-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { EmptyState } from "../../src/components/ui/Cards";

export default function Cart() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal } = useCart();
  const subtotal = getTotal();
  const fee = 1500;

  return (
    <SafeAreaView className="flex-1 bg-ink" edges={["top"]}>
      <View className="px-5 pt-1 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.push("/(buyer)/browse" as any)} className="w-11 h-11 rounded-full bg-white/10 items-center justify-center">
          <ChevronLeft color="#fff" size={22} />
        </TouchableOpacity>
        <Text className="text-white text-[20px] font-bold tracking-tight ml-3">Your bag</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View>
            <EmptyState dark title="Bag's empty" subtitle="Something hot is waiting for you." />
            <View className="mt-4">
              <AppButton title="Find food" variant="white" onPress={() => router.push("/(buyer)/browse" as any)} />
            </View>
          </View>
        ) : (
          <>
            <Text className="text-white/50 text-[12px] font-semibold mb-3">{items.length} item{items.length > 1 ? "s" : ""} • 26–43 min</Text>
            <View className="gap-1">
              {items.map((item) => (
                <View key={item.id} className="flex-row items-center py-3">
                  <Image source={{ uri: item.image_url || "" }} className="w-[68px] h-[68px] rounded-2xl" resizeMode="cover" />
                  <View className="flex-1 ml-3.5">
                    <Text className="text-white font-bold text-[15px]" numberOfLines={1}>{item.name}</Text>
                    <Text className="text-white/45 text-[13px] mt-0.5">₦{item.price.toLocaleString()}</Text>
                  </View>
                  <View className="flex-row items-center bg-white/[0.07] rounded-full p-1">
                    <TouchableOpacity
                      onPress={() => (item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1))}
                      className="w-8 h-8 items-center justify-center"
                    >
                      {item.quantity === 1 ? <Trash2 color="rgba(255,255,255,0.7)" size={15} /> : <Minus color="#fff" size={15} />}
                    </TouchableOpacity>
                    <Text className="w-6 text-center font-bold text-white text-[14px]">{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-white items-center justify-center">
                      <Plus color="#0A0A0E" size={15} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View className="h-px bg-white/10 my-5" />
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-white/55 text-[14px]">Subtotal</Text>
                <Text className="text-white text-[14px] font-semibold">₦{subtotal.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/55 text-[14px]">Delivery</Text>
                <Text className="text-white text-[14px] font-semibold">₦{fee.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between mt-1.5">
                <Text className="text-white text-[18px] font-bold">Total</Text>
                <Text className="text-white text-[18px] font-bold">₦{(subtotal + fee).toLocaleString()}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {items.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 px-5 bg-ink pt-3" style={{ paddingBottom: 34 }}>
          <AppButton title={`Checkout • ₦${(subtotal + fee).toLocaleString()}`} variant="white" onPress={() => router.push("/(buyer)/checkout" as any)} />
        </View>
      )}
    </SafeAreaView>
  );
}
