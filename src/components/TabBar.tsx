import { View, Text, Pressable, Platform } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

export interface BarItem {
  icon: (props: { color: string; size: number; strokeWidth?: number }) => React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

function glass(dark: boolean) {
  return {
    // Translucent enough to mirror content scrolling beneath.
    backgroundColor: dark ? "rgba(19,19,24,0.55)" : "rgba(255,255,255,0.60)",
    borderColor: dark ? "rgba(255,255,255,0.22)" : "rgba(10,10,14,0.10)",
  };
}

function press() {
  if (Platform.OS !== "web") {
    Haptics.selectionAsync().catch(() => {});
  }
}

// Gloss: sheen wash + crisp top-edge highlight, painted above the blur,
// below the glyphs. pointerEvents off so touch passes through.
function Sheen() {
  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
      <LinearGradient
        colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.03)", "rgba(255,255,255,0)"]}
        locations={[0, 0.45, 0.75]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View
        style={{
          position: "absolute",
          top: 1,
          left: 30,
          right: 30,
          height: 1,
          borderRadius: 1,
          backgroundColor: "rgba(255,255,255,0.38)",
        }}
      />
    </View>
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
      style={{ flex: 1, minHeight: 56, minWidth: 56 }}
    >
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: 46,
          height: 32,
          backgroundColor: active ? (dark ? "#FFFFFF" : "#0A0A0E") : "transparent",
        }}
      >
        <TabIcon
          color={active ? (dark ? "#0A0A0E" : "#FFFFFF") : dark ? "rgba(255,255,255,0.75)" : "#4A4653"}
          size={22}
          strokeWidth={2}
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
          fontWeight: active ? "700" : "500",
          color: active ? (dark ? "#fff" : "#0A0A0E") : dark ? "rgba(255,255,255,0.6)" : "#6E6A75",
          marginTop: 2,
        }}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

// Floating glossy bar. `tabs` are navigation; `action` is a single detached
// control (e.g. Bag) — never mixed, per HIG.
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
  const g = glass(dark);

  const go = (href: string) => {
    press();
    router.push(href as any);
  };

  const ActionIcon = action?.icon;
  const actionActive = action ? pathname === action.href || pathname.startsWith(action.href + "/") : false;

  const shadow = {
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  };

  return (
    <View
      className="absolute left-6 right-6 flex-row items-center"
      style={{ bottom: Math.max(insets.bottom, 14), gap: 12 }}
    >
      <View
        className="flex-row items-center px-3 rounded-full"
        style={{
          flex: 1,
          height: 76,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: g.borderColor,
          backgroundColor: g.backgroundColor,
          ...shadow,
        }}
      >
        <BlurView
          intensity={50}
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
        <Pressable
          onPress={() => go(action.href)}
          className="items-center justify-center rounded-full"
          style={{
            width: 76,
            height: 76,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: g.borderColor,
            backgroundColor: actionActive ? (dark ? "#FFFFFF" : "#0A0A0E") : g.backgroundColor,
            ...shadow,
          }}
        >
          {!actionActive ? (
            <>
              <BlurView
                intensity={50}
                tint={dark ? "dark" : "light"}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <Sheen />
            </>
          ) : null}
          <ActionIcon
            color={actionActive ? (dark ? "#0A0A0E" : "#FFFFFF") : dark ? "#FFFFFF" : "#0A0A0E"}
            size={26}
            strokeWidth={2.2}
          />
          {action.badge != null && action.badge > 0 && (
            <View className="absolute top-3 right-3 min-w-[20px] h-[20px] px-1 bg-ember rounded-full items-center justify-center">
              <Text className="text-white text-[10px] font-inter-bold">
                {action.badge > 99 ? "99+" : action.badge}
              </Text>
            </View>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}
