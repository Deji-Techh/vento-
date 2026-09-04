import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  HelpCircle,
  Download,
  ChevronRight,
  CheckCircle,
  Wallet,
} from "lucide-react-native";

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
    <View className="flex-1 bg-white">
      {/* TopAppBar */}
      <View className="bg-white px-5 pt-4">
        <View className="flex-row items-center justify-between h-14">
          <Text className="text-2xl font-bold text-blue-900">Orders</Text>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity>
              <HelpCircle color="#9CA3AF" size={24} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Download color="#9CA3AF" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="border-b border-gray-200 mt-2"
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="mr-6 pb-3"
            >
              <Text
                className={`text-sm font-semibold ${
                  activeTab === tab
                    ? "text-blue-900 border-b-2 border-blue-900"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Filters */}
        <View className="flex-row items-center gap-2 mt-4 mb-6">
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full border ${
                activeFilter === filter
                  ? "border-blue-900 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  activeFilter === filter
                    ? "text-blue-900"
                    : "text-gray-900"
                }`}
              >
                {filter}
                {filter === "Status" && " ▾"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Vento Pay Card */}
        <TouchableOpacity className="bg-gray-100 rounded-xl p-4 flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-full bg-blue-900 items-center justify-center">
              <Wallet color="#FFFFFF" size={16} />
            </View>
            <Text className="text-base">Vento Pay transactions</Text>
          </View>
          <ChevronRight color="#9CA3AF" size={20} />
        </TouchableOpacity>

        {/* Order List */}
        {displayOrders.length === 0 ? (
          <View className="py-16 items-center">
            <Text className="text-gray-500">No orders in this tab</Text>
          </View>
        ) : (
          displayOrders.map((order) => (
            <View
              key={order.id}
              className="flex-col gap-4 border-b border-gray-200 pb-6 mb-4"
            >
              <Text className="text-sm text-gray-500">{order.time}</Text>
              <View className="flex-row items-start justify-between">
                <View className="flex-row items-start gap-4">
                  <Image
                    source={{ uri: order.image }}
                    className="w-16 h-16 rounded-lg bg-gray-100"
                    resizeMode="cover"
                  />
                  <View className="gap-1 mt-1">
                    <Text className="text-sm font-bold truncate w-32">
                      {order.name}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <CheckCircle color="#000080" size={16} />
                      <Text className="text-sm text-gray-500">
                        {order.status}
                      </Text>
                    </View>
                    <Text className="text-[13px] leading-tight text-gray-500 truncate mt-1">
                      {order.item}
                    </Text>
                  </View>
                </View>
                <View className="items-end gap-2 mt-1">
                  <Text className="text-sm font-bold">
                    ₦{order.price.toLocaleString()}
                  </Text>
                  <TouchableOpacity className="bg-blue-900 px-4 py-1.5 rounded-full">
                    <Text className="text-white text-sm font-semibold">
                      {order.action}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
