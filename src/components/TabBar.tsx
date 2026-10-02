import { View, Text, Pressable, Platform } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

interface TabItem {
  icon: (props: { color: string; size: number }) => React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

// Floating glass bar (iOS Regular-material style). Navigation items only —
// actions like Bag live in their own detached control per HIG.
export default function TabBar({ tabs, dark = true }: { tabs: TabItem[]; dark?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute left-6 right-6 rounded-full"
      style={{
        bottom: Math.max(insets.bottom, 14),
        height: 76,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: dark ? "rgba(255,255,255,0.12)" : "rgba(10,10,14,0.08)",
        backgroundColor: dark ? "rgba(19,19,24,0.82)" : "rgba(255,255,255,0.82)",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 12,
      }}
    >
      <BlurView
        intensity={84}
        tint={dark ? "dark" : "light"}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View className="flex-row items-center px-3" style={{ height: 76 }}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          const TabIcon = tab.icon;
          return (
            <Pressable
              key={tab.label}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.selectionAsync().catch(() => {});
                }
                router.push(tab.href as any);
              }}
              className="flex-1 items-center justify-center"
              style={{ minHeight: 56, minWidth: 56 }}
            >
              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 46,
                  height: 32,
                  backgroundColor: isActive ? (dark ? "#FFFFFF" : "#0A0A0E") : "transparent",
                }}
              >
                <TabIcon
                  color={isActive ? (dark ? "#0A0A0E" : "#FFFFFF") : dark ? "rgba(255,255,255,0.5)" : "#6E6A75"}
                  size={21}
                />
                {tab.badge != null && tab.badge > 0 && (
                  <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-ember rounded-full items-center justify-center">
                    <Text className="text-white text-[10px] font-inter-bold">{tab.badge > 99 ? "99+" : tab.badge}</Text>
                  </View>
                )}
              </View>
              <Text
                className="font-inter-medium"
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? "700" : "500",
                  color: isActive ? (dark ? "#fff" : "#0A0A0E") : dark ? "rgba(255,255,255,0.45)" : "#6E6A75",
                  marginTop: 2,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
