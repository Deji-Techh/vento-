import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useCart } from "../../src/stores/cartStore";
import { AppButton } from "../../src/components/ui/AppButton";
import { EmptyState } from "../../src/components/ui/Cards";
import { Icon } from "../../src/components/ui/Icon";
import { ArrowLeft01Icon, MinusSignIcon, PlusSignIcon, Delete02Icon } from "../../src/components/icons";

const FREE_DELIVERY_AT = 10000;
const FEE = 1500;

export default function Cart() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal } = useCart();
  const subtotal = getTotal();
  const progress = Math.min(1, subtotal / FREE_DELIVERY_AT);

  return (
    <SafeAreaView className="flex-1 bg-ink" edges={["top"]}>
      <View className="px-5 pt-1 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.push("/(buyer)/browse" as any)} className="w-11 h-11 rounded-full bg-white/10 items-center justify-center">
          <Icon icon={ArrowLeft01Icon} size={22} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-[20px] font-inter-bold tracking-tight ml-3">Your bag</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View>
            <EmptyState dark title="Bag's empty" subtitle="Something hot is waiting for you." />
            <View className="mt-4">
              <AppButton title="Find food" variant="white" onPress={() => router.push("/(buyer)/browse" as any)} />
            </View>
          </View>
        ) : (
          <>
            <Text className="text-white/50 text-[12px] font-inter-medium mb-3">
              {items.length} item{items.length > 1 ? "s" : ""} • 26–43 min
            </Text>

            {subtotal < FREE_DELIVERY_AT ? (
              <View className="bg-white/[0.06] border border-white/10 rounded-[20px] p-4 mb-4">
                <Text className="text-white text-[13px] font-inter-semibold">
                  ₦{(FREE_DELIVERY_AT - subtotal).toLocaleString()} away from free delivery
                </Text>
                <View className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-2.5">
                  <View className="h-full bg-ember rounded-full" style={{ width: `${progress * 100}%` }} />
                </View>
              </View>
            ) : (
              <View className="bg-success/15 border border-success/25 rounded-[20px] p-4 mb-4">
                <Text className="text-[#0E9F6E] text-[13px] font-inter-bold">Free delivery unlocked</Text>
              </View>
            )}

            <View className="gap-1">
              {items.map((item) => (
                <View key={item.id} className="flex-row items-center py-3">
                  <Image source={{ uri: item.image_url || "" }} style={{ width: 68, height: 68, borderRadius: 18 }} contentFit="cover" transition={200} />
                  <View className="flex-1 ml-3.5">
                    <Text className="text-white font-inter-bold text-[15px]" numberOfLines={1}>{item.name}</Text>
                    <Text className="text-white/45 text-[13px] font-inter mt-0.5">₦{item.price.toLocaleString()}</Text>
                  </View>
                  <View className="flex-row items-center bg-white/[0.07] rounded-full p-1">
                    <TouchableOpacity
                      onPress={() => (item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1))}
                      className="w-8 h-8 items-center justify-center"
                    >
                      {item.quantity === 1
                        ? <Icon icon={Delete02Icon} size={15} color="rgba(255,255,255,0.7)" />
                        : <Icon icon={MinusSignIcon} size={15} color="#fff" />}
                    </TouchableOpacity>
                    <Text className="w-6 text-center font-inter-bold text-white text-[14px]">{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-white items-center justify-center">
                      <Icon icon={PlusSignIcon} size={15} color="#0A0A0E" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View className="h-px bg-white/10 my-5" />
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-white/55 text-[14px] font-inter">Subtotal</Text>
                <Text className="text-white text-[14px] font-inter-semibold">₦{subtotal.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/55 text-[14px] font-inter">Delivery</Text>
                <Text className="text-white text-[14px] font-inter-semibold">
                  {subtotal >= FREE_DELIVERY_AT ? "Free" : `₦${FEE.toLocaleString()}`}
                </Text>
              </View>
              <View className="flex-row justify-between mt-1.5">
                <Text className="text-white text-[18px] font-inter-bold">Total</Text>
                <Text className="text-white text-[18px] font-inter-bold">
                  ₦{(subtotal + (subtotal >= FREE_DELIVERY_AT ? 0 : FEE)).toLocaleString()}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {items.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 px-5 bg-ink pt-3" style={{ paddingBottom: 34 }}>
          <AppButton
            title={`Checkout • ₦${(subtotal + (subtotal >= FREE_DELIVERY_AT ? 0 : FEE)).toLocaleString()}`}
            variant="white"
            onPress={() => router.push("/(buyer)/checkout" as any)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
