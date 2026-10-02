import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useCart } from "../../src/stores/cartStore";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { EmptyState } from "../../src/components/ui/Cards";
import { Enter } from "../../src/components/motion";
import { Icon } from "../../src/components/ui/Icon";
import { ArrowLeft01Icon, MinusSignIcon, PlusSignIcon, Delete02Icon } from "../../src/components/icons";

const FREE_DELIVERY_AT = 10000;
const FEE = 1500;

export default function Cart() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal } = useCart();
  const { user } = useAuth();
  const { dark } = useTheme();
  const subtotal = getTotal();
  const freeDelivery = subtotal >= FREE_DELIVERY_AT;
  const total = subtotal + (freeDelivery ? 0 : FEE);
  const progress = Math.min(1, subtotal / FREE_DELIVERY_AT);

  const step = (id: string, qty: number, d: number) => {
    if (qty === 1 && d < 0) removeItem(id);
    else updateQuantity(id, qty + d);
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
  };

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <View className="px-5 pt-1 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.push("/(buyer)/browse" as any)} className={`w-11 h-11 rounded-full items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}>
          <Icon icon={ArrowLeft01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
        </TouchableOpacity>
        <Text className={`text-[20px] font-inter-bold tracking-tight ml-3 ${dark ? "text-white" : "text-ink"}`}>Your bag</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View>
            <EmptyState title="Bag's empty" subtitle="Something hot is waiting for you." />
            <View className="mt-4">
              <AppButton title="Find food" variant={dark ? "white" : "ink"} onPress={() => router.push("/(buyer)/browse" as any)} />
            </View>
          </View>
        ) : (
          <>
            <Text className={`text-[12px] font-inter-medium mb-3 ${dark ? "text-white/50" : "text-ink/55"}`}>
              {items.length} item{items.length > 1 ? "s" : ""} • 26–43 min
            </Text>

            {!freeDelivery ? (
              <View className={`rounded-[20px] p-4 mb-4 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                <Text className={`text-[13px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>
                  ₦{(FREE_DELIVERY_AT - subtotal).toLocaleString()} away from free delivery
                </Text>
                <View className={`h-1.5 rounded-full overflow-hidden mt-2.5 ${dark ? "bg-white/10" : "bg-ink/10"}`}>
                  <View className="h-full bg-ember rounded-full" style={{ width: `${progress * 100}%` }} />
                </View>
              </View>
            ) : (
              <View className="bg-success/15 border border-success/25 rounded-[20px] p-4 mb-4">
                <Text className="text-[#0E9F6E] text-[13px] font-inter-bold">Free delivery unlocked</Text>
              </View>
            )}

            <View className="gap-1">
              {items.map((item, i) => (
                <Enter key={item.id} delay={Math.min(i * 40, 120)}>
                  <View className="flex-row items-center py-3">
                    <Image source={{ uri: item.image_url || "" }} style={{ width: 68, height: 68, borderRadius: 18 }} contentFit="cover" transition={200} />
                    <View className="flex-1 ml-3.5">
                      <Text className={`font-inter-bold text-[15px] ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>{item.name}</Text>
                      <Text className={`text-[13px] font-inter mt-0.5 ${dark ? "text-white/45" : "text-ink/50"}`}>₦{item.price.toLocaleString()}</Text>
                    </View>
                    <View className={`flex-row items-center rounded-full p-1 ${dark ? "bg-white/[0.07]" : "bg-ink/[0.05]"}`}>
                      <TouchableOpacity onPress={() => step(item.id, item.quantity, -1)} className="w-8 h-8 items-center justify-center">
                        {item.quantity === 1
                          ? <Icon icon={Delete02Icon} size={15} color={dark ? "rgba(255,255,255,0.7)" : "rgba(10,10,14,0.6)"} />
                          : <Icon icon={MinusSignIcon} size={15} color={dark ? "#fff" : "#0A0A0E"} />}
                      </TouchableOpacity>
                      <Text className={`w-6 text-center font-inter-bold text-[14px] ${dark ? "text-white" : "text-ink"}`}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => step(item.id, item.quantity, 1)} className={`w-8 h-8 rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}>
                        <Icon icon={PlusSignIcon} size={15} color={dark ? "#0A0A0E" : "#fff"} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Enter>
              ))}
            </View>

            <View className={`h-px my-5 ${dark ? "bg-white/10" : "bg-ink/10"}`} />
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className={`text-[14px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Subtotal</Text>
                <Text className={`text-[14px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>₦{subtotal.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className={`text-[14px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Delivery</Text>
                <Text className={`text-[14px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>
                  {freeDelivery ? "Free" : `₦${FEE.toLocaleString()}`}
                </Text>
              </View>
              <View className="flex-row justify-between mt-1.5">
                <Text className={`text-[18px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Total</Text>
                <Text className={`text-[18px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>₦{total.toLocaleString()}</Text>
              </View>
            </View>

            <View className="mt-6">
              <AppButton
                title={`Checkout • ₦${total.toLocaleString()}`}
                variant={dark ? "white" : "ink"}
                onPress={() => {
                  if (!user) {
                    toast("Sign in to finish checkout");
                    router.push("/auth/login");
                    return;
                  }
                  router.push("/(buyer)/checkout" as any);
                }}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
