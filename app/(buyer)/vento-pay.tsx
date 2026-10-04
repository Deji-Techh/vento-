import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { Icon } from "../../src/components/ui/Icon";
import { SectionHeader } from "../../src/components/ui/SectionHeader";
import { Enter } from "../../src/components/motion";
import {
  ArrowLeft01Icon,
  PlusSignIcon,
  SentIcon,
  BankIcon,
  EyeIcon,
  EyeOffIcon,
  ReceiptIcon,
} from "../../src/components/icons";

const cards = [
  { id: "main", label: "Main", last4: "4021" },
  { id: "food", label: "Food fund", last4: "8814" },
  { id: "night", label: "Night owl", last4: "2093" },
];

const groups = [
  {
    day: "Today",
    items: [
      { id: "t1", icon: PlusSignIcon, title: "Top up", sub: "Paystack · 09:42", amount: "+₦10,000", credit: true },
      { id: "t2", icon: ReceiptIcon, title: "Grill House", sub: "Grilled Chicken Bowl · 12:15", amount: "−₦2,200", credit: false },
    ],
  },
  {
    day: "Yesterday",
    items: [
      { id: "t3", icon: ReceiptIcon, title: "Refund · Mama Cass", sub: "Jollof Rice Special · 18:03", amount: "+₦1,500", credit: true },
      { id: "t4", icon: ReceiptIcon, title: "Suya Spot", sub: "Suya Platter · 20:47", amount: "−₦3,000", credit: false },
    ],
  },
];

function PayCard({
  depth,
  label,
  last4,
  holder,
  dark,
}: {
  depth: number;
  label: string;
  last4: string;
  holder: string;
  dark: boolean;
}) {
  const d = useSharedValue(depth);
  useEffect(() => {
    d.value = withTiming(depth, { duration: 380 });
  }, [depth, d]);
  const frame = useAnimatedStyle(() => ({
    top: d.value * 16,
    left: d.value * 12,
    right: d.value * 12,
    opacity: 1 - d.value * 0.1,
    zIndex: 10 - Math.round(d.value),
  }));
  const dim = useAnimatedStyle(() => ({ opacity: d.value * 0.22 }));
  const line = dark ? "border-ink/25" : "border-white/25";

  return (
    <Animated.View style={[frame, { position: "absolute", height: 200, left: 0, right: 0 }]}>
      <View className={`flex-1 rounded-[24px] p-5 justify-between overflow-hidden ${dark ? "bg-white" : "bg-ink"}`}>
        <View className="flex-row items-start justify-between">
          <Text className={`text-[17px] font-display-bold tracking-[3px] ${dark ? "text-ink" : "text-white"}`}>VENTO</Text>
          <Text className={`text-[12px] font-inter-medium ${dark ? "text-ink/50" : "text-white/50"}`}>{label}</Text>
        </View>
        <View>
          <View className={`w-11 h-8 rounded-lg border ${line} items-center justify-center overflow-hidden`}>
            <View className={`w-full h-px ${dark ? "bg-ink/25" : "bg-white/25"}`} />
            <View className={`absolute h-full w-px ${dark ? "bg-ink/25" : "bg-white/25"}`} />
          </View>
          <Text className={`text-[19px] font-inter-semibold tracking-[4px] mt-2.5 ${dark ? "text-ink" : "text-white"}`}>
            •••• {last4}
          </Text>
        </View>
        <Text className={`text-[12px] font-inter-medium tracking-[1.5px] uppercase ${dark ? "text-ink/55" : "text-white/55"}`}>
          {holder}
        </Text>
        <Animated.View style={[dim, { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }]} className="bg-black rounded-[24px]" />
      </View>
    </Animated.View>
  );
}

export default function VentoPay() {
  const router = useRouter();
  const { dark } = useTheme();
  const { profile } = useAuth();
  const [front, setFront] = useState(0);
  const [show, setShow] = useState(true);
  const holder = (profile?.name || "Vento user").toUpperCase();

  const cycle = () => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    setFront((f) => (f + 1) % cards.length);
  };

  const soon = (label: string) => toast(`${label} coming soon`);

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <View className="px-5 pt-1 pb-2 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 items-center justify-center -ml-2">
          <Icon icon={ArrowLeft01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
        </TouchableOpacity>
        <Text className={`text-[20px] font-inter-bold tracking-tight ml-2 ${dark ? "text-white" : "text-ink"}`}>Vento Pay</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Card stack — tap to bring the next card forward */}
        <Enter>
          <Pressable onPress={cycle} className="px-5 mt-3">
            <View style={{ height: 232 }}>
              {cards.map((c, i) => (
                <PayCard
                  key={c.id}
                  depth={(i - front + cards.length) % cards.length}
                  label={c.label}
                  last4={c.last4}
                  holder={holder}
                  dark={dark}
                />
              ))}
            </View>
            <Text className={`text-center text-[12px] font-inter mt-2 ${dark ? "text-white/40" : "text-ink/40"}`}>
              Tap stack to switch card
            </Text>
          </Pressable>
        </Enter>

        {/* Balance */}
        <Enter delay={60}>
          <View className="px-5 mt-6 flex-row items-end justify-between">
            <View>
              <Text className={`text-[13px] font-inter ${dark ? "text-white/50" : "text-ink/50"}`}>Total balance</Text>
              <Text className={`text-[34px] font-display-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>
                {show ? "₦24,500" : "••••••"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShow((s) => !s)}
              className={`w-11 h-11 rounded-full items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}
            >
              <Icon icon={show ? EyeIcon : EyeOffIcon} size={19} color={dark ? "#fff" : "#0A0A0E"} />
            </TouchableOpacity>
          </View>
        </Enter>

        {/* Actions */}
        <Enter delay={100}>
          <View className="px-5 mt-6 flex-row justify-between">
            {[
              { id: "topup", label: "Top up", icon: PlusSignIcon },
              { id: "send", label: "Send", icon: SentIcon },
              { id: "withdraw", label: "Withdraw", icon: BankIcon },
            ].map((a) => (
              <TouchableOpacity
                key={a.id}
                onPress={() => soon(a.label)}
                activeOpacity={0.85}
                className="flex-1 items-center gap-2"
              >
                <View className={`w-14 h-14 rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}>
                  <Icon icon={a.icon} size={22} color={dark ? "#0A0A0E" : "#fff"} />
                </View>
                <Text className={`text-[13px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Enter>

        {/* Transactions */}
        <View className="px-5 mt-7">
          <SectionHeader title="Transactions" />
          {groups.map((g) => (
            <View key={g.day}>
              <Text className={`text-[13px] font-inter-semibold mt-3 mb-1 ${dark ? "text-white/45" : "text-ink/45"}`}>
                {g.day}
              </Text>
              {g.items.map((t) => (
                <View key={t.id} className="flex-row items-center py-3">
                  <View className={`w-12 h-12 rounded-2xl items-center justify-center ${dark ? "bg-white/[0.07]" : "bg-ink/[0.05]"}`}>
                    <Icon icon={t.icon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
                  </View>
                  <View className="flex-1 ml-3.5">
                    <Text className={`text-[15px] font-inter-bold ${dark ? "text-white" : "text-ink"}`} numberOfLines={1}>
                      {t.title}
                    </Text>
                    <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-white/45" : "text-ink/50"}`} numberOfLines={1}>
                      {t.sub}
                    </Text>
                  </View>
                  <Text className={`text-[15px] font-inter-bold ${t.credit ? (dark ? "text-white" : "text-ink") : dark ? "text-white/55" : "text-ink/55"}`}>
                    {t.amount}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
