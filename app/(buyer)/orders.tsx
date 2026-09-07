import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  HelpCircle,
  Download,
  ChevronRight,
  CheckCircle2,
  Wallet,
} from "lucide-react-native";
import { EmptyState } from "../../src/components/ui/Cards";
import { Eyebrow } from "../../src/components/ui/SectionHeader";

const tabs = ["History", "Ongoing", "Scheduled", "Draft"];
const filters = ["All", "Food", "Grocery", "Status"];

const orders = [
  {
    id: 1,
    time: "Yesterday, 17:00",
    name: "Tasty Bites",
    item: "Chicken & Chips Combo",
    status: "Trip completed",
    price: 4500,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200",
    action: "Chat",
  },
  {
    id: 2,
    time: "Yesterday, 10:30",
    name: "Mama Cass",
    item: "Jollof Rice Special",
    status: "Trip completed",
    price: 3200,
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200",
    action: "Reorder",
  },
  {
    id: 3,
    time: "3 Jul, 14:52",
    name: "Fresh Mart",
    item: "Fresh Fruit Bowl, Smoothie Pack",
    status: "Delivery completed",
    price: 5800,
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=200",
    action: "Reorder",
  },
  {
    id: 4,
    time: "3 Jul, 13:16",
    name: "Pizzeria Delfina",
    item: "Pepperoni Pizza Slice, Coke",
    status: "Food delivered",
    price: 2500,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200",
    action: "Reorder",
  },
];

const ongoingOrders = [
  {
    id: 5,
    time: "Today, 12:15",
    name: "Grill House",
    item: "Grilled Chicken Bowl",
    status: "On the way",
    price: 2200,
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200",
    action: "Track",
  },
];

export default function Orders() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("History");
  const [activeFilter, setActiveFilter] = useState("All");

  const displayOrders = activeTab === "Ongoing" ? ongoingOrders : orders;

  return (
    <SafeAreaView className="flex-1 bg-ink" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="px-6 pt-2 pb-2">
        <View className="flex-row items-center justify-between min-h-[56px]">
          <View>
            <Eyebrow dark>Order history</Eyebrow>
            <Text className="text-[28px] font-bold text-white tracking-tight mt-1">
              Orders
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              accessibilityRole="button"
              className="w-11 h-11 rounded-full bg-white/10 border border-white/10 items-center justify-center"
            >
              <HelpCircle color="rgba(255,255,255,0.7)" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              className="w-11 h-11 rounded-full bg-white/10 border border-white/10 items-center justify-center"
            >
              <Download color="rgba(255,255,255,0.7)" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs — white active pill / white/10 inactive */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 12 }}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.85}
                className={`px-5 py-2.5 rounded-full border ${
                  active
                    ? "bg-white border-white"
                    : "bg-white/10 border-white/10"
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    active ? "text-ink" : "text-white/60"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Filters row */}
        <View className="flex-row items-center gap-2 mt-1 mb-2">
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.85}
                className={`px-4 py-2 rounded-full border ${
                  active
                    ? "bg-white border-white"
                    : "border-white/15 bg-transparent"
                }`}
              >
                <Text
                  className={`text-[13px] font-bold ${
                    active ? "text-ink" : "text-white/55"
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Vento Pay — transparent bordered row */}
        <TouchableOpacity
          activeOpacity={0.9}
          className="border border-white/10 rounded-[24px] px-4 py-4 flex-row items-center justify-between mb-2 mt-3"
        >
          <View className="flex-row items-center gap-3">
            <View className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 items-center justify-center">
              <Wallet color="#FFFFFF" size={20} />
            </View>
            <View>
              <Text className="text-white text-[15px] font-bold">
                Vento Pay transactions
              </Text>
              <Text className="text-white/55 text-xs mt-0.5">
                Receipts, refunds and wallet
              </Text>
            </View>
          </View>
          <ChevronRight color="rgba(255,255,255,0.45)" size={20} />
        </TouchableOpacity>

        {/* Order list — transparent rows */}
        {displayOrders.length === 0 ? (
          <View className="mt-6">
            <EmptyState
              dark
              title="No orders here yet"
              subtitle="Orders in this tab will show up here."
            />
          </View>
        ) : (
          <View>
            {displayOrders.map((order, index) => (
              <View
                key={order.id}
                className={`py-5 ${
                  index < displayOrders.length - 1
                    ? "border-b border-white/10"
                    : ""
                }`}
              >
                <Text className="text-[11px] font-bold uppercase tracking-[2px] text-white/50 mb-3">
                  {order.time}
                </Text>
                <View className="flex-row items-start justify-between">
                  <View className="flex-row items-start gap-4 flex-1">
                    <Image
                      source={{ uri: order.image }}
                      className="w-[76px] h-[76px] rounded-2xl bg-white/10"
                      resizeMode="cover"
                    />
                    <View className="flex-1 pr-2">
                      <Text
                        className="text-white text-[16px] font-bold tracking-tight"
                        numberOfLines={1}
                      >
                        {order.name}
                      </Text>
                      <View className="flex-row items-center gap-1.5 mt-1.5">
                        <CheckCircle2
                          color="rgba(255,255,255,0.45)"
                          size={14}
                        />
                        <Text className="text-white/45 text-[12px] font-medium">
                          {order.status}
                        </Text>
                      </View>
                      <Text
                        className="text-white/55 text-[13px] mt-1"
                        numberOfLines={1}
                      >
                        {order.item}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end gap-2.5 ml-2">
                    <Text className="text-white text-[15px] font-bold">
                      ₦{order.price.toLocaleString()}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => {
                        if (order.action === "Track") {
                          router.push("/(buyer)/track-delivery");
                        }
                      }}
                      className="bg-white px-5 py-2 rounded-full"
                    >
                      <Text className="text-ink text-[13px] font-bold">
                        {order.action}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
