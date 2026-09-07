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
import { useAuth } from "../../src/contexts/AuthContext";
import {
  ArrowLeft,
  Video,
  Phone,
  Plus,
  Lock,
  CheckCheck,
  Send,
} from "lucide-react-native";

const mockMessages = [
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

const chatUser = {
  name: "Tasty Bites",
  initials: "TB",
};

export default function Chat() {
  const router = useRouter();
  const { role } = useAuth();
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: `msg-${Date.now()}`,
      type: "sender" as const,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <SafeAreaView className="flex-1 bg-ink" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 h-16 border-b border-white/10">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.85}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center"
            >
              <ArrowLeft color="#FFFFFF" size={20} />
            </TouchableOpacity>
            <View className="flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-full bg-white items-center justify-center">
                <Text className="text-sm font-bold text-ink">
                  {chatUser.initials}
                </Text>
              </View>
              <View>
                <Text className="text-[16px] font-bold text-white tracking-tight">
                  {chatUser.name}
                </Text>
                <View className="flex-row items-center gap-1.5 mt-0.5">
                  <View className="w-2 h-2 rounded-full bg-white" />
                  <Text className="text-xs text-white/55">Online now</Text>
                </View>
              </View>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              activeOpacity={0.85}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center"
            >
              <Video color="#FFFFFF" size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center"
            >
              <Phone color="#FFFFFF" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat thread */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6 pt-5"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Encryption notice */}
          <View className="items-center mb-6">
            <View className="rounded-2xl px-4 py-3 items-center max-w-[90%] border border-white/10 bg-white/[0.06] flex-row gap-2">
              <Lock color="rgba(255,255,255,0.45)" size={14} />
              <Text className="text-[11px] text-white/55 leading-relaxed text-center flex-1">
                Messages and calls are end-to-end encrypted.
              </Text>
            </View>
          </View>

          {/* Messages */}
          {messages.map((msg) => {
            if (msg.type === "date") {
              return (
                <View key={msg.id} className="items-center mb-4 mt-1">
                  <View className="bg-white/10 rounded-full px-4 py-1.5 border border-white/10">
                    <Text className="text-[11px] font-bold uppercase tracking-[2px] text-white/50">
                      {msg.text}
                    </Text>
                  </View>
                </View>
              );
            }

            if (msg.type === "sender") {
              return (
                <View key={msg.id} className="flex-row justify-end mb-2">
                  <View className="bg-white rounded-[20px] rounded-br-md px-4 py-3 max-w-[85%]">
                    <Text className="text-[14px] text-ink font-medium mb-1 leading-snug">
                      {msg.text}
                    </Text>
                    <View className="flex-row items-center justify-end gap-1">
                      <Text className="text-[11px] text-ink/60 font-semibold">
                        {msg.time}
                      </Text>
                      <CheckCheck color="rgba(10,10,14,0.6)" size={15} />
                    </View>
                  </View>
                </View>
              );
            }

            return (
              <View key={msg.id} className="flex-row justify-start mb-2">
                <View className="bg-white/10 rounded-[20px] rounded-tl-md px-4 py-3 max-w-[85%]">
                  <Text className="text-[14px] text-white mb-1 leading-snug">
                    {msg.text}
                  </Text>
                  <View className="flex-row items-center justify-end">
                    <Text className="text-[11px] text-white/45">
                      {msg.time}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input bar */}
        <View className="px-6 py-3 border-t border-white/10 bg-ink">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              activeOpacity={0.85}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/10 items-center justify-center"
            >
              <Plus color="rgba(255,255,255,0.7)" size={20} />
            </TouchableOpacity>
            <View className="flex-1 bg-white/10 border border-white/10 rounded-full flex-row items-center px-4 h-[52px]">
              <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Message"
                placeholderTextColor="rgba(255,255,255,0.35)"
                className="flex-1 text-[15px] text-white"
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
            </View>
            <TouchableOpacity
              onPress={handleSend}
              activeOpacity={0.85}
              className="w-[52px] h-[52px] bg-white rounded-full items-center justify-center"
            >
              <Send color="#0A0A0E" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
