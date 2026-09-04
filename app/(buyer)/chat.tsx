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
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  ArrowLeft,
  Video,
  Phone,
  Plus,
  Camera,
  Mic,
  Lock,
  CheckCheck,
} from "lucide-react-native";

const mockMessages = [
  { id: "msg-1", type: "date", text: "Yesterday" },
  { id: "msg-2", type: "sender", text: "Hi! Is my order ready yet?", time: "4:37 PM", read: true },
  { id: "msg-3", type: "receiver", text: "Hello! Your order is being prepared now.", time: "4:38 PM" },
  { id: "msg-4", type: "receiver", text: "It will be ready in about 15 minutes!", time: "4:38 PM" },
  { id: "msg-5", type: "date", text: "Today" },
  { id: "msg-6", type: "sender", text: "Hey, I placed a new order. Can I add one more item?", time: "9:03 AM", read: true },
  { id: "msg-7", type: "receiver", text: "Sure! What would you like to add?", time: "9:14 AM" },
  { id: "msg-8", type: "receiver", text: "We have fresh suya just off the grill 🔥", time: "9:15 AM" },
  { id: "msg-9", type: "sender", text: "Perfect! Add a Suya Platter to my order please 🙏", time: "9:20 AM", read: true },
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 h-14 bg-white border-b border-gray-200 pt-4">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full"
          >
            <ArrowLeft color="#1C1B1B" size={20} />
          </TouchableOpacity>
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center border border-gray-200">
              <Text className="text-sm font-bold text-blue-900">
                {chatUser.initials}
              </Text>
            </View>
            <Text className="text-base font-bold">{chatUser.name}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity className="p-2 rounded-full">
            <Video color="#000080" size={20} />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 rounded-full">
            <Phone color="#000080" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Canvas */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-5 pt-4 pb-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Encryption Notice */}
        <View className="items-center mb-6">
          <View className="bg-gray-100 rounded-xl px-4 py-3 items-center max-w-[90%] border border-gray-200">
            <Text className="text-xs text-gray-500 leading-relaxed text-center">
              <Lock color="#9CA3AF" size={14} /> Messages and calls are
              end-to-end encrypted. Only people in this chat can read them.
            </Text>
          </View>
        </View>

        {/* Messages */}
        {messages.map((msg) => {
          if (msg.type === "date") {
            return (
              <View key={msg.id} className="items-center mb-4">
                <View className="bg-gray-100 rounded-full px-3 py-1 border border-gray-200">
                  <Text className="text-xs text-gray-500">{msg.text}</Text>
                </View>
              </View>
            );
          }

          if (msg.type === "sender") {
            return (
              <View key={msg.id} className="flex-row justify-end mb-2">
                <View className="bg-blue-900 rounded-2xl rounded-br-sm px-4 py-3 max-w-[85%] shadow-sm">
                  <Text className="text-sm text-white mb-1">{msg.text}</Text>
                  <View className="flex-row items-center justify-end gap-1">
                    <Text className="text-[11px] text-white/70">{msg.time}</Text>
                    <CheckCheck color="rgba(255,255,255,0.8)" size={16} />
                  </View>
                </View>
              </View>
            );
          }

          return (
            <View key={msg.id} className="flex-row justify-start mb-2">
              <View className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-sm border border-gray-200">
                <Text className="text-sm mb-1">{msg.text}</Text>
                <View className="flex-row items-center justify-end">
                  <Text className="text-[11px] text-gray-500">{msg.time}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Bar */}
      <View className="bg-white px-5 py-3 border-t border-gray-200">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="p-1 rounded-full">
            <Plus color="#9CA3AF" size={20} />
          </TouchableOpacity>
          <View className="flex-1 bg-gray-100 border border-gray-200 rounded-full flex-row items-center px-4 py-2">
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Message"
              placeholderTextColor="#9CA3AF"
              className="flex-1 bg-transparent text-sm"
            />
          </View>
          <TouchableOpacity className="p-1 rounded-full">
            <Camera color="#9CA3AF" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSend}
            className="w-10 h-10 bg-blue-900 rounded-full items-center justify-center shadow-sm"
          >
            <Mic color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
