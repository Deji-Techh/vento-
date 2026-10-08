import { useState, useEffect } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import { useTheme } from "../../src/contexts/ThemeContext";
import { supabase } from "../../src/lib/supabase";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { toast } from "sonner-native";

export default function Reset() {
  const router = useRouter();
  const { dark } = useTheme();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handle = async (url: string | null) => {
      if (!url || !url.includes("access_token")) return;
      const hash = url.split("#")[1] || "";
      const params = Object.fromEntries(new URLSearchParams(hash)) as Record<string, string>;
      if (params.access_token && params.refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        });
        if (!error) setReady(true);
        else toast.error("Reset link expired — request a new one");
      }
    };
    Linking.getInitialURL().then((url) => handle(url));
    const sub = Linking.addEventListener("url", ({ url }) => handle(url));
    return () => sub.remove();
  }, []);

  const save = async () => {
    if (password.length < 8) {
      setError("Min 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated — log in");
      router.replace("/auth/login");
    } catch (e: any) {
      toast.error(e.message || "Couldn't update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`}>
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 pt-10 pb-8">
            <Text className={`text-[32px] font-display-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
              New password
            </Text>
            <Text className={`text-[15px] font-inter mt-1 mb-7 ${dark ? "text-white/55" : "text-ink/55"}`}>
              {ready ? "Choose something strong." : "Open this page from your reset email link."}
            </Text>
            <View className="gap-3">
              <TextField
                label="New password"
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  if (error) setError("");
                }}
                placeholder="••••••••"
                secure
                error={error}
              />
              <TextField
                label="Confirm password"
                value={confirm}
                onChangeText={(v) => {
                  setConfirm(v);
                  if (error) setError("");
                }}
                placeholder="••••••••"
                secure
              />
            </View>
            <View className="mt-6">
              <AppButton title="Save password" variant={dark ? "white" : "ink"} loading={loading} disabled={!ready} onPress={save} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
