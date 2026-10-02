import { View, Text, Pressable, TouchableOpacity, Platform } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, SlideInDown, useReducedMotion } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

export interface BarItem {
  icon: (props: { color: string; size: number; strokeWidth?: number }) => React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

function press() {
  if (Platform.OS !== "web") {
    Haptics.selectionAsync().catch(() => {});
  }
}

// Sheen wash over glass. No hairlines — the border alone defines the edge.
function Sheen() {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.02)", "rgba(255,255,255,0)"]}
      locations={[0, 0.45, 0.75]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    />
  );
}

function Pill({
  tab,
  dark,
  active,
  onPress,
}: {
  tab: BarItem;
  dark: boolean;
  active: boolean;
  onPress: () => void;
}) {
  const TabIcon = tab.icon;
  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center"
      style={{ flex: 1, minHeight: 52, minWidth: 52 }}
    >
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: 44,
          height: 30,
          backgroundColor: active ? (dark ? "#FFFFFF" : "#0A0A0E") : "transparent",
        }}
      >
        <TabIcon
          color={active ? (dark ? "#0A0A0E" : "#FFFFFF") : dark ? "rgba(255,255,255,0.7)" : "#4A4653"}
          size={21}
          strokeWidth={1.9}
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
          color: active ? (dark ? "#fff" : "#0A0A0E") : dark ? "rgba(255,255,255,0.55)" : "#6E6A75",
          marginTop: 1,
        }}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

// Floating bar: glass nav pill + solid primary action. The action is opaque
// on purpose — a glyph must never depend on what's scrolling behind it.
export default function TabBar({
  tabs,
  dark = true,
  action,
}: {
  tabs: BarItem[];
  dark?: boolean;
  action?: BarItem;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const go = (href: string) => {
    press();
    router.push(href as any);
  };

  const ActionIcon = action?.icon;

  const reduced = useReducedMotion();

  const glassBg = dark ? "rgba(19,19,24,0.62)" : "rgba(255,255,255,0.68)";
  const glassBorder = dark ? "rgba(255,255,255,0.12)" : "rgba(10,10,14,0.10)";

  return (
    <Animated.View
      entering={reduced ? FadeIn.duration(200) : SlideInDown.delay(80).duration(500).damping(24)}
      className="absolute left-6 right-6 flex-row items-center"
      style={{ bottom: Math.max(insets.bottom, 14), gap: 10 }}
    >
      <View
        className="flex-row items-center px-3 rounded-full"
        style={{
          flex: 1,
          height: 70,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: glassBorder,
          backgroundColor: glassBg,
          shadowColor: "#000",
          shadowOpacity: 0.28,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: 10 },
          elevation: 12,
        }}
      >
        <BlurView
          intensity={60}
          tint={dark ? "dark" : "light"}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <Sheen />
        {tabs.map((tab) => (
          <Pill
            key={tab.label}
            tab={tab}
            dark={dark}
            active={pathname === tab.href || pathname.startsWith(tab.href + "/")}
            onPress={() => go(tab.href)}
          />
        ))}
      </View>

      {action && ActionIcon ? (
        <TouchableOpacity
          onPress={() => go(action.href)}
          activeOpacity={0.85}
          className="items-center justify-center rounded-full"
          style={{
            width: 70,
            height: 70,
            backgroundColor: dark ? "#FFFFFF" : "#0A0A0E",
            shadowColor: "#000",
            shadowOpacity: 0.28,
            shadowRadius: 22,
            shadowOffset: { width: 0, height: 10 },
            elevation: 12,
          }}
        >
          <ActionIcon color={dark ? "#0A0A0E" : "#FFFFFF"} size={26} strokeWidth={2.2} />
          {action.badge != null && action.badge > 0 && (
            <View className="absolute top-2 right-2 min-w-[20px] h-[20px] px-1 bg-ember rounded-full items-center justify-center border-2 border-white">
              <Text className="text-white text-[10px] font-inter-bold">
                {action.badge > 99 ? "99+" : action.badge}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
}
