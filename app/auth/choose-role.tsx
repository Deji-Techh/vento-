import { useState, Fragment } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppButton } from "../../src/components/ui/AppButton";

const roles = [
  { id: "buyer", label: "Order food", description: "Hot meals, delivered fast.", mark: "◆" },
  { id: "seller", label: "Sell food", description: "Your kitchen, more orders.", mark: "●" },
  { id: "rider", label: "Deliver", description: "Earn on your schedule.", mark: "▲" },
];

export default function ChooseRole() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selectedRole) return;
    const existing = await AsyncStorage.getItem("mock_user");
    const parsed = existing ? JSON.parse(existing) : {};
    await AsyncStorage.setItem("mock_user", JSON.stringify({ ...parsed, role: selectedRole }));
    if (selectedRole === "buyer") router.replace("/(buyer)/browse" as any);
    else if (selectedRole === "seller") router.replace("/(seller)/dashboard" as any);
    else router.replace("/(delivery)/dashboard" as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-ink" edges={["top", "bottom"]}>
      <View className="flex-1 px-6 pt-8">
        <>
          <Text className="text-white/50 text-[11px] font-bold tracking-[2px] uppercase text-center">Vento</Text>
          <Text className="text-white text-[32px] font-bold tracking-tight text-center mt-2">What brings you?</Text>
        </>

        <View className="gap-3 mt-9">
          {roles.map((r, i) => {
            const active = selectedRole === r.id;
            return (
              <Fragment key={r.id}>
                <TouchableOpacity
                  onPress={() => setSelectedRole(r.id)}
                  activeOpacity={0.92}
                  className={`flex-row items-center p-5 rounded-[24px] ${active ? "bg-white" : "bg-white/[0.06]"}`}
                >
                  <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${active ? "bg-ink" : "bg-white/10"}`}>
                    <Text className={`text-lg ${active ? "text-white" : "text-white/50"}`}>{r.mark}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className={`text-[17px] font-bold tracking-tight ${active ? "text-ink" : "text-white"}`}>{r.label}</Text>
                    <Text className={`text-[13px] mt-0.5 ${active ? "text-ink/60" : "text-white/50"}`}>{r.description}</Text>
                  </View>
                  <View className={`w-6 h-6 rounded-full items-center justify-center ${active ? "bg-ink" : "border-2 border-white/20"}`}>
                    {active && <Text className="text-white text-[11px] font-bold">✓</Text>}
                  </View>
                </TouchableOpacity>
              </Fragment>
            );
          })}
        </View>
      </View>
      <View className="px-6 pb-2">
        <AppButton title="Continue" variant="white" disabled={!selectedRole} onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}
