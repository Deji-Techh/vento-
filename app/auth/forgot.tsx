import { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Enter } from "../../src/components/motion";
import { Icon } from "../../src/components/ui/Icon";
import { ArrowLeft01Icon } from "../../src/components/icons";
import { toast } from "sonner-native";

export default function Forgot() {
  const router = useRouter();
  const { dark } = useTheme();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: "vento-rn://auth/callback",
      });
      if (error) throw error;
      setSent(true);
    } catch (e: any) {
      toast.error(e.message || "Couldn't send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`}>
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 pt-6 pb-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className={`w-11 h-11 rounded-full items-center justify-center active:opacity-70 ${dark ? "bg-white/10" : "bg-ink/[0.05]"}`}
            >
              <Icon icon={ArrowLeft01Icon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
            </TouchableOpacity>
            <Enter delay={40}>
              <Text className={`text-[32px] font-display-bold tracking-tight mt-6 ${dark ? "text-white" : "text-ink"}`}>
                Reset password
              </Text>
              <Text className={`text-[15px] font-inter mt-1 mb-7 ${dark ? "text-white/55" : "text-ink/55"}`}>
                {sent ? "Check your inbox for the reset link." : "Enter your email and we'll send a reset link."}
              </Text>
            </Enter>

            {!sent ? (
              <>
                <TextField
                  label="Email"
                  value={email}
                  onChangeText={(v) => {
                    setEmail(v);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="you@campus.edu"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={emailError}
                />
                <View className="mt-6">
                  <AppButton title="Send reset link" variant={dark ? "white" : "ink"} loading={loading} onPress={send} />
                </View>
              </>
            ) : (
              <View className="mt-2">
                <AppButton title="Back to login" variant={dark ? "white" : "ink"} onPress={() => router.replace("/auth/login")} />
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
