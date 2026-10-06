import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { buzz } from "../../src/lib/haptics";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { EmptyState } from "../../src/components/ui/Cards";
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

const quickReplies = ["Where's my order?", "Thank you!"];

export default function Chat() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { user } = useAuth();
  const { dark } = useTheme();
  const [messages, setMessages] = useState<any[]>([]);
  const [threadId, setThreadId] = useState<string | null>(orderId || null);
  const [threadLabel, setThreadLabel] = useState("Order chat");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const loadThread = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      let oid = orderId || threadId;
      if (!oid) {
        const { data: latest } = await supabase.from("orders").select("id, sellers(store_name)").eq("buyer_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (!latest) { setLoading(false); return; }
        oid = (latest as any).id;
        setThreadLabel((latest as any).sellers?.store_name || "Order chat");
      } else if (!threadId) {
        const { data: o } = await supabase.from("orders").select("id, sellers(store_name)").eq("id", oid).maybeSingle();
        if (o) setThreadLabel((o as any).sellers?.store_name || "Order chat");
      }
      setThreadId(oid);
      const { data, error } = await supabase.from("messages").select("id, sender_id, body, created_at").eq("order_id", oid).order("created_at", { ascending: true }).limit(100);
      if (error) throw error;
      setMessages(
        (data || []).map((m: any) => ({
          id: m.id,
          type: m.sender_id === user.id ? "sender" : ("receiver" as const),
          text: m.body,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }))
      );
    } catch (e: any) {
      toast.error(e.message || "Couldn't load messages");
    } finally {
      setLoading(false);
    }
  }, [user, orderId]);

  useEffect(() => { loadThread(); }, [loadThread]);

  useEffect(() => {
    if (!threadId) return;
    const ch = supabase.channel(`messages:${threadId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `order_id=eq.${threadId}` }, () => loadThread()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [threadId, loadThread]);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    return () => clearTimeout(t);
  }, [messages]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || !user || !threadId || sending) return;
    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert({ order_id: threadId, sender_id: user.id, body: text.slice(0, 500) });
      if (error) throw error;
      setDraft("");
      buzz();
      loadThread();
    } catch (e: any) {
      toast.error(e.message || "Couldn't send");
    } finally {
      setSending(false);
    }
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
                <Text className={`text-[13px] font-inter-bold ${dark ? "text-ink" : "text-white"}`}>{threadLabel.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View>
                <Text className={`text-[16px] font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>{threadLabel}</Text>
                <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
                  {threadId ? `Order #${threadId.slice(0, 8)}` : "No orders yet"}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={() => toast("Video calls ship with live support")} accessibilityLabel="Video call" activeOpacity={0.85} className={`w-10 h-10 rounded-full items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}>
              <Icon icon={Video01Icon} size={18} color={dark ? "#fff" : "#0A0A0E"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toast("Voice calls ship with live support")} accessibilityLabel="Voice call" activeOpacity={0.85} className={`w-10 h-10 rounded-full items-center justify-center ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}>
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

          {loading ? (
            <View className="py-10 items-center"><Text className={`text-[13px] font-inter ${dark ? "text-white/50" : "text-ink/50"}`}>Loading thread…</Text></View>
          ) : !threadId ? (
            <EmptyState title="No conversations yet" subtitle="Messages with your kitchen and rider live here once you order." actionLabel="Browse kitchens" onAction={() => router.push("/(buyer)/browse" as any)} />
          ) : messages.length === 0 ? (
            <EmptyState title="Say hello" subtitle="Messages to your kitchen and rider start here." />
          ) : null}
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
            if (msg.type === "sender") {
              return (
                <View key={msg.id} className="flex-row justify-end" style={{ marginBottom: groupedNext ? 3 : 16 }}>
                  <Animated.View entering={FadeIn.duration(200)} style={{ maxWidth: "78%" }}>
                  <View
                    className={`px-4 pt-2.5 pb-1.5 ${dark ? "bg-white" : "bg-ink"} ${
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
                </View>
              );
            }
            return (
              <View key={msg.id} className="flex-row justify-start" style={{ marginBottom: groupedNext ? 3 : 16 }}>
                <Animated.View entering={FadeIn.duration(200)} style={{ maxWidth: "78%" }}>
                <View
                  className={`px-4 pt-2.5 pb-1.5 ${dark ? "bg-white/[0.09]" : "bg-white border border-border"} ${
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
              </View>
            );
          })}

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
            <TouchableOpacity onPress={() => toast("Photo sharing ships with live support")} accessibilityLabel="Attach photo" activeOpacity={0.85} className={`w-10 h-10 rounded-full items-center justify-center border ${dark ? "bg-white/10 border-white/10" : "bg-ink/[0.05] border-ink/10"}`}>
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
