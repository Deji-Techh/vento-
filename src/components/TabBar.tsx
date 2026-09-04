import { View, Text, Pressable } from "react-native";
import { usePathname, useRouter } from "expo-router";

interface TabItem {
  icon: (props: { color: string; size: number }) => React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

export default function TabBar({ tabs }: { tabs: TabItem[] }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View className="flex-row justify-around items-center py-2 pb-4 bg-white/95 backdrop-blur-md border-t border-gray-200">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
        const Icon = tab.icon;
        return (
          <Pressable
            key={tab.label}
            onPress={() => router.push(tab.href)}
            className="items-center relative"
          >
            {isActive ? (
              <View className="bg-blue-50 px-4 py-1 rounded-full items-center justify-center">
                <Icon color="#000080" size={24} />
              </View>
            ) : (
              <View className="px-4 py-1 items-center justify-center">
                <Icon color="#9CA3AF" size={24} />
              </View>
            )}
            <Text
              className={`text-[10px] mt-0.5 ${
                isActive ? "text-blue-900 font-bold" : "text-gray-500 font-semibold"
              }`}
            >
              {tab.label}
            </Text>
            {tab.badge != null && tab.badge > 0 && (
              <View className="absolute -top-0.5 right-0 w-5 h-5 bg-blue-900 rounded-full items-center justify-center">
                <Text className="text-white text-[10px] font-bold">
                  {tab.badge > 99 ? "99+" : tab.badge}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
