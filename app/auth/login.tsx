import { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Enter } from "../../src/components/motion";
import { toast } from "sonner-native";
// DEV-BYPASS: remove this import with the bypass (see src/lib/devAuthBypass.ts)
import { DEV_AUTH_BYPASS, inferDevRole } from "../../src/lib/devAuthBypass";

const mockUsers: Record<string, { id: string; role: string }> = {
  "admin@campus.edu": { id: "mock-admin-001", role: "admin" },
  "ada@campus.edu": { id: "mock-seller-001", role: "seller" },
  "chidi@campus.edu": { id: "mock-buyer-001", role: "buyer" },
  "emeka@campus.edu": { id: "mock-agent-001", role: "delivery_agent" },
};

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { dark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) return;
    if (!password) {
      toast.error("Enter your password");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      // DEV-BYPASS: any email works — delete line to remove (falls back to map)
      const role = DEV_AUTH_BYPASS ? inferDevRole(email) : mockUsers[email.toLowerCase()]?.role || "buyer";
      if (role === "admin") router.replace("/(admin)" as any);
      else if (role === "seller") router.replace("/(seller)/dashboard" as any);
      else if (role === "delivery_agent") router.replace("/(delivery)/dashboard" as any);
      else router.replace("/(buyer)/browse" as any);
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`}>
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 pt-10 pb-8">
            <Enter>
              <View className={`w-11 h-11 rounded-full items-center justify-center mb-8 ${dark ? "bg-white" : "bg-ink"}`}>
                <Text className={`text-lg font-inter-bold ${dark ? "text-ink" : "text-white"}`}>V</Text>
              </View>
            </Enter>
            <Enter delay={60}>
              <Text className={`text-[32px] font-display-bold tracking-tight leading-[34px] ${dark ? "text-white" : "text-ink"}`}>
                Welcome back
              </Text>
              <Text className={`text-[15px] font-inter mt-2 mb-8 ${dark ? "text-white/55" : "text-ink/55"}`}>
                Dinner is 30 minutes away.
              </Text>
            </Enter>

            <Enter delay={100}>
              <TextField
                label="Email"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (emailError) validateEmail(v);
                }}
                onBlur={() => validateEmail(email)}
                placeholder="you@campus.edu"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={emailError}
              />
            </Enter>

            <Enter delay={140}>
              <View className="mt-4">
                <TextField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secure
                  showSecure={showPassword}
                  onToggleSecure={() => setShowPassword(!showPassword)}
                  autoComplete="current-password"
                />
              </View>
            </Enter>

            <View className="flex-row justify-end mt-3 mb-7">
              <TouchableOpacity className="active:opacity-60">
                <Text className={`text-[14px] font-inter-semibold ${dark ? "text-white" : "text-ink"}`}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <AppButton title="Sign in" variant={dark ? "white" : "ink"} loading={loading} onPress={handleLogin} />

            <TouchableOpacity onPress={() => router.replace("/(buyer)/browse" as any)} className="items-center mt-5 active:opacity-60">
              <Text className={`text-[14px] font-inter-semibold ${dark ? "text-white/70" : "text-ink/60"}`}>
                Continue as guest →
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-7">
              <View className={`flex-1 h-px ${dark ? "bg-white/10" : "bg-ink/10"}`} />
              <Text className={`px-3 text-[11px] font-inter-bold tracking-[1px] ${dark ? "text-white/40" : "text-ink/40"}`}>OR</Text>
              <View className={`flex-1 h-px ${dark ? "bg-white/10" : "bg-ink/10"}`} />
            </View>

            <View className="flex-row gap-3">
              {["Google", "Apple"].map((p) => (
                <TouchableOpacity
                  key={p}
                  className={`flex-1 h-[52px] rounded-full border items-center justify-center active:opacity-70 ${dark ? "bg-white/10 border-white/15" : "bg-ink/[0.04] border-ink/10"}`}
                >
                  <Text className={`text-[14px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={() => router.push("/auth/signup")} className="items-center mt-8 active:opacity-60">
              <Text className={`text-[14px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
                Need an account? <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Create one</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
