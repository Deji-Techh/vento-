import { View, Text, Pressable, TouchableOpacity, Platform, StyleSheet } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, SlideInDown, ZoomIn, useReducedMotion } from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
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
      style={StyleSheet.absoluteFill}
    />
  );
}

const webShadow = { boxShadow: "0 10px 22px rgba(0,0,0,0.28)" } as const;
const nativeShadow = {
  shadowColor: "#000",
  shadowOpacity: 0.28,
  shadowRadius: 22,
  shadowOffset: { width: 0, height: 10 },
  elevation: 12,
} as const;

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
  const reduced = useReducedMotion();
  return (
    <Pressable onPress={onPress} style={styles.pillTouch}>
      <View
        style={[
          styles.pillIcon,
          { backgroundColor: active ? (dark ? "#FFFFFF" : "#0A0A0E") : "transparent" },
        ]}
      >
        <TabIcon
          color={active ? (dark ? "#0A0A0E" : "#FFFFFF") : dark ? "rgba(255,255,255,0.7)" : "#4A4653"}
          size={20}
          strokeWidth={1.9}
        />
        {tab.badge != null && tab.badge > 0 && (
          <Animated.View
            key={tab.badge}
            entering={reduced ? FadeIn.duration(150) : ZoomIn.springify().damping(16).stiffness(320)}
            style={[styles.badge, { backgroundColor: dark ? "#FFFFFF" : "#0A0A0E" }]}
          >
            <Text style={[styles.badgeText, { color: dark ? "#0A0A0E" : "#FFFFFF" }]}>{tab.badge > 99 ? "99+" : tab.badge}</Text>
          </Animated.View>
        )}
      </View>
      <Text
        style={[
          styles.pillLabel,
          {
            fontWeight: active ? "700" : "500",
            color: active ? (dark ? "#fff" : "#0A0A0E") : dark ? "rgba(255,255,255,0.55)" : "#6E6A75",
          },
        ]}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

// Floating bar: glass nav pill + solid mono action side by side.
// Layout is explicit StyleSheet (never class-dependent) so the action
// can never wrap below the pill.
export default function TabBar({
  tabs,
  dark: darkProp,
  action,
}: {
  tabs: BarItem[];
  dark?: boolean;
  action?: BarItem;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dark = darkProp ?? useTheme().dark;
  const reduced = useReducedMotion();

  const go = (href: string) => {
    press();
    router.push(href as any);
  };

  const ActionIcon = action?.icon;
  const   glassBg = dark ? "rgba(8,8,8,0.62)" : "rgba(255,255,255,0.68)";
  const glassBorder = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";

  // Full-screen flows own their bottom edge (sticky CTAs, inputs, sheets)
  // so the floating bar gets out of the way entirely.
  const FULLSCREEN = [
    "cart",
    "checkout",
    "food-details",
    "track-delivery",
    "live-map",
    "chat",
    "notifications",
    "settings",
  ];
  if (FULLSCREEN.some((s) => pathname.includes(s))) return null;

  return (
    <Animated.View
      entering={reduced ? FadeIn.duration(200) : SlideInDown.delay(80).duration(500).damping(24)}
      style={[styles.bar, { bottom: Math.max(insets.bottom, 12) }]}
    >
      <View
        style={[
          styles.pill,
          {
            borderColor: glassBorder,
            backgroundColor: glassBg,
            ...(Platform.OS === "web" ? webShadow : nativeShadow),
          },
        ]}
      >
        <BlurView
          intensity={60}
          tint={dark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
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
          style={[
            styles.circle,
            {
              backgroundColor: dark ? "#FFFFFF" : "#0A0A0E",
              ...(Platform.OS === "web" ? webShadow : nativeShadow),
            },
          ]}
        >
          <ActionIcon color={dark ? "#0A0A0E" : "#FFFFFF"} size={24} strokeWidth={2.2} />
          {action.badge != null && action.badge > 0 && (
            <Animated.View
              key={action.badge}
              entering={reduced ? FadeIn.duration(150) : ZoomIn.springify().damping(14).stiffness(320)}
              style={[styles.circleBadge, { backgroundColor: dark ? "#FFFFFF" : "#0A0A0E" }]}
            >
              <Text style={[styles.badgeText, { color: dark ? "#0A0A0E" : "#FFFFFF" }]}>
                {action.badge > 99 ? "99+" : action.badge}
              </Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pill: {
    flex: 1,
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 31,
    overflow: "hidden",
    borderWidth: 1,
  },
  circle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  pillTouch: {
    flex: 1,
    minHeight: 48,
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  pillIcon: {
    width: 42,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  pillLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    marginTop: 1,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  circleBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
});
