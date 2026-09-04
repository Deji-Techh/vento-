import { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const roles = [
  {
    id: "buyer",
    label: "Buyer",
    description: "Shop and get groceries delivered.",
    icon: "🛒",
  },
  {
    id: "seller",
    label: "Seller",
    description: "List your store and reach more customers.",
    icon: "🏪",
  },
  {
    id: "rider",
    label: "Rider",
    description: "Deliver orders and earn on your schedule.",
    icon: "🚴",
  },
];

export default function ChooseRole() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selectedRole) return;

    const existingUser = await AsyncStorage.getItem("mock_user");
    const parsed = existingUser ? JSON.parse(existingUser) : {};
    const updatedUser = { ...parsed, role: selectedRole };
    await AsyncStorage.setItem("mock_user", JSON.stringify(updatedUser));

    if (selectedRole === "buyer") {
      router.replace("/(buyer)");
    } else if (selectedRole === "seller") {
      router.replace("/(seller)");
    } else if (selectedRole === "rider") {
      router.replace("/(delivery)");
    }
  };

  return (
    <View className="flex-1 bg-white pt-8 pb-5">
      <View className="items-center mb-8 px-5">
        <Image
          source={require("../../assets/vento-logo.png")}
          className="h-12 w-40 mb-12"
          resizeMode="contain"
        />
        <Text className="text-[28px] font-bold text-blue-900 text-center mb-2">
          How would you like to join Vento?
        </Text>
        <Text className="text-base text-gray-500 text-center">
          Select a role to get started.
        </Text>
      </View>

      <View className="flex-1 px-5 space-y-4">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <TouchableOpacity
              key={role.id}
              onPress={() => setSelectedRole(role.id)}
              className={`flex-row items-center p-4 rounded-xl border ${
                isSelected
                  ? "border-blue-900 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                  isSelected ? "bg-blue-900" : "bg-gray-100"
                }`}
              >
                <Text className="text-2xl">{role.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  {role.label}
                </Text>
                <Text className="text-sm text-gray-500">{role.description}</Text>
              </View>
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ml-2 ${
                  isSelected ? "border-blue-900" : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <View className="w-3 h-3 rounded-full bg-blue-900" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="px-5 pb-5">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedRole}
          className={`w-full h-14 rounded-full items-center justify-center ${
            selectedRole
              ? "bg-blue-900 shadow-md"
              : "bg-gray-200"
          }`}
        >
          <Text
            className={`text-base font-semibold ${
              selectedRole ? "text-white" : "text-gray-500"
            }`}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
