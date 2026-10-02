import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn } from "react-native-reanimated";
import { Icon } from "../../src/components/ui/Icon";
import {
  ArrowLeft01Icon,
  Video01Icon,
  PhoneIcon,
  PlusSignIcon,
  LockIcon,
  CheckCheckIcon,
  SentIcon,
} from "../../src/components/icons";

const seed = [
  { id: "msg-1", type: "date", text: "Yesterday" },
  { id: "msg-2", type: "sender", text: "Hi! Is my order ready yet?", time: "4:37 PM", read: true },
  { id: "msg-3", type: "receiver", text: "Hello! Your order is being prepared now.", time: "4:38 PM" },
  { id: "msg-4", type: "receiver", text: "It will be ready in about 15 minutes.", time: "4:38 PM" },
  { id: "msg-5", type: "date", text: "Today" },
  { id: "msg-6", type: "sender", text: "Hey, I placed a new order. Can I add one more item?", time: "9:03 AM", read: true },
  { id: "msg-7", type: "receiver", text: "Sure! What would you like to add?", time: "9:14 AM" },
  { id: "msg-8", type: "receiver", text: "We have fresh suya just off the grill.", time: "9:15 AM" },
  { id: "msg-9", type: "sender", text: "Perfect! Add a Suya Platter to my order please.", time: "9:20 AM", read: true },
];

const quickReplies = ["Where's my order?", "Add an item", "Thank you!"];

const autoReply = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes("where") || t.includes("order")) return "Your rider picked it up — 3 minutes away.";
  if (t.includes("add")) return "Done — I added it to your order, no extra delivery fee.";
  if (t.includes("thank")) return "Anytime! Enjoy your meal.";
  return "On it — the kitchen has your message.";
};

export default function Chat() {
  const router = useRouter();
  const { dark } = useTheme();
  const [messages, setMessages] = useState<any[]>(seed);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const stash = timers.current;
    return () => stash.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    return () => clearTimeout(t);
  }, [messages, typing]);

  const buzz = () => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const mine = {
      id: `msg-${Date.now()}`,
      type: "sender" as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setMessages((prev) => [...prev, mine]);
    setDraft("");
    buzz();
    setTyping(true);
    timers.current.push(
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-r`,
            type: "receiver" as const,
            text: autoReply(text),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 1400)
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        {/* Header */}
        <View className={`flex-row items-center justify-between px-5 h-16 border-b ${dark ? "border-white/10" : "border-ink/10"}`}>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.85}
              className={`w-10 h-10 rounded-full items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}
            >
              <Icon icon={ArrowLeft01Icon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
            </TouchableOpacity>
            <View className="flex-row items-center gap-3">
              <View className={`w-11 h-11 rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}>
                <Text className={`text-[13px] font-inter-bold ${dark ? "text-ink" : "text-white"}`}>TB</Text>
                <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-white" style={{ borderColor: dark ? "#0A0A0E" : "#FAF5EA" }} />
              </View>
              <View>
                <Text className={`text-[16px] font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Tasty Bites</Text>
                <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
                  {typing ? "typing…" : "Online now"}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity activeOpacity={0.85} className={`w-10 h-10 rounded-full items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}>
              <Icon icon={Video01Icon} size={18} color={dark ? "#fff" : "#0A0A0E"} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} className={`w-10 h-10 rounded-full items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}>
              <Icon icon={PhoneIcon} size={18} color={dark ? "#fff" : "#0A0A0E"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Thread */}
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-5 pt-5"
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-6">
            <View className={`rounded-2xl px-4 py-3 items-center max-w-[90%] border flex-row gap-2 ${dark ? "border-white/10 bg-white/[0.06]" : "border-ink/10 bg-white"}`}>
              <Icon icon={LockIcon} size={14} color={dark ? "rgba(255,255,255,0.45)" : "rgba(10,10,14,0.4)"} />
              <Text className={`text-[11px] font-inter leading-relaxed text-center flex-1 ${dark ? "text-white/55" : "text-ink/55"}`}>
                Messages and calls are end-to-end encrypted.
              </Text>
            </View>
          </View>

          {messages.map((msg: any, idx: number) => {
            if (msg.type === "date") {
              return (
                <View key={msg.id} className="items-center mb-5 mt-2">
                  <View className={`rounded-full px-4 py-1.5 border ${dark ? "bg-white/10 border-white/10" : "bg-ink/[0.05] border-ink/10"}`}>
                    <Text className={`text-[11px] font-inter-bold uppercase tracking-[2px] ${dark ? "text-white/50" : "text-ink/50"}`}>
                      {msg.text}
                    </Text>
                  </View>
                </View>
              );
            }
            const prev = messages[idx - 1];
            const next = messages[idx + 1];
            const groupedPrev = prev && prev.type === msg.type;
            const groupedNext = next && next.type === msg.type;
            const gap = groupedNext ? "mb-[3px]" : "mb-4";
            if (msg.type === "sender") {
              return (
                <Animated.View key={msg.id} entering={FadeIn.duration(200)} className={`flex-row justify-end ${gap}`}>
                  <View
                    className={`px-4 pt-2.5 pb-1.5 max-w-[78%] ${dark ? "bg-white" : "bg-ink"} ${
                      groupedPrev && groupedNext
                        ? "rounded-[20px] rounded-br-[20px] rounded-tr-[6px]"
                        : groupedPrev
                          ? "rounded-[20px] rounded-br-[5px]"
                          : groupedNext
                            ? "rounded-[20px] rounded-tr-[6px]"
                            : "rounded-[20px] rounded-br-[5px]"
                    }`}
                  >
                    <Text className={`text-[14px] font-inter leading-[20px] ${dark ? "text-ink" : "text-white"}`}>{msg.text}</Text>
                    <View className="flex-row items-center justify-end gap-1 mt-0.5">
                      <Text className={`text-[10px] font-inter-medium ${dark ? "text-ink/50" : "text-white/50"}`}>{msg.time}</Text>
                      <Icon icon={CheckCheckIcon} size={13} color={dark ? "rgba(10,10,14,0.5)" : "rgba(255,255,255,0.5)"} />
                    </View>
                  </View>
                </Animated.View>
              );
            }
            return (
              <Animated.View key={msg.id} entering={FadeIn.duration(200)} className={`flex-row justify-start ${gap}`}>
                <View
                  className={`px-4 pt-2.5 pb-1.5 max-w-[78%] ${dark ? "bg-white/[0.09]" : "bg-white border border-border"} ${
                    groupedPrev && groupedNext
                      ? "rounded-[20px] rounded-bl-[20px] rounded-tl-[6px]"
                      : groupedPrev
                        ? "rounded-[20px] rounded-bl-[5px]"
                        : groupedNext
                          ? "rounded-[20px] rounded-tl-[6px]"
                          : "rounded-[20px] rounded-bl-[5px]"
                  }`}
                >
                  <Text className={`text-[14px] font-inter leading-[20px] ${dark ? "text-white" : "text-ink"}`}>{msg.text}</Text>
                  <View className="flex-row items-center justify-end mt-0.5">
                    <Text className={`text-[10px] font-inter ${dark ? "text-white/40" : "text-ink/40"}`}>{msg.time}</Text>
                  </View>
                </View>
              </Animated.View>
            );
          })}

          {typing && (
            <View className="flex-row justify-start mb-2">
              <View className={`rounded-[20px] rounded-tl-md px-4 py-3.5 flex-row gap-1.5 ${dark ? "bg-white/10" : "bg-white border border-border"}`}>
                {[0, 1, 2].map((d) => (
                  <View key={d} className={`w-1.5 h-1.5 rounded-full ${dark ? "bg-white/60" : "bg-ink/40"}`} />
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick replies */}
        <View style={{ height: 56, justifyContent: "center" }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-5"
            contentContainerStyle={{ alignItems: "center", paddingRight: 20 }}
          >
            {quickReplies.map((qr) => (
              <TouchableOpacity
                key={qr}
                onPress={() => send(qr)}
                style={{ alignSelf: "center" }}
                className={`mr-2 px-4 py-2.5 rounded-full border ${dark ? "border-white/15 bg-white/[0.06]" : "border-ink/10 bg-white"}`}
              >
                <Text className={`text-[13px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>{qr}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input */}
        <View className={`px-5 py-3 border-t ${dark ? "border-white/10 bg-ink" : "border-ink/10 bg-cream"}`}>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity activeOpacity={0.85} className={`w-10 h-10 rounded-full items-center justify-center border ${dark ? "bg-white/10 border-white/10" : "bg-ink/[0.05] border-ink/10"}`}>
              <Icon icon={PlusSignIcon} size={20} color={dark ? "rgba(255,255,255,0.7)" : "rgba(10,10,14,0.6)"} />
            </TouchableOpacity>
            <View className={`flex-1 border rounded-full flex-row items-center px-4 h-[52px] ${dark ? "bg-white/10 border-white/10" : "bg-white border-ink/10"}`}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Message"
                placeholderTextColor={dark ? "rgba(255,255,255,0.35)" : "rgba(10,10,14,0.35)"}
                className={`flex-1 text-[15px] font-inter ${dark ? "text-white" : "text-ink"}`}
                onSubmitEditing={() => send(draft)}
                returnKeyType="send"
              />
            </View>
            <TouchableOpacity
              onPress={() => send(draft)}
              activeOpacity={0.85}
              className={`w-[52px] h-[52px] rounded-full items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}
            >
              <Icon icon={SentIcon} size={20} color={dark ? "#0A0A0E" : "#fff"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
