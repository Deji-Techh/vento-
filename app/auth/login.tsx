import { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
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
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-ink">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 pt-10 pb-8">
            <View className="w-11 h-11 rounded-full bg-white items-center justify-center mb-8">
              <Text className="text-ink text-lg font-inter-bold">V</Text>
            </View>
            <Text className="text-white text-[32px] font-inter-bold tracking-tight leading-[34px]">
              Welcome back
            </Text>
            <Text className="text-white/55 text-[15px] font-inter mt-2 mb-8">
              Dinner is 30 minutes away.
            </Text>

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

            <View className="flex-row justify-end mt-3 mb-7">
              <TouchableOpacity className="active:opacity-60">
                <Text className="text-[14px] text-white font-inter-semibold">Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <AppButton title="Sign in" variant="white" loading={loading} onPress={handleLogin} />

            <View className="flex-row items-center my-7">
              <View className="flex-1 h-px bg-white/10" />
              <Text className="px-3 text-[11px] text-white/40 font-inter-bold tracking-[1px]">OR</Text>
              <View className="flex-1 h-px bg-white/10" />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 h-[52px] rounded-full bg-white/10 border border-white/15 items-center justify-center active:opacity-70">
                <Text className="text-[14px] font-inter-bold text-white">Google</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 h-[52px] rounded-full bg-white/10 border border-white/15 items-center justify-center active:opacity-70">
                <Text className="text-[14px] font-inter-bold text-white">Apple</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push("/auth/signup")} className="items-center mt-8 active:opacity-60">
              <Text className="text-[14px] font-inter text-white/55">
                Need an account? <Text className="font-inter-bold text-white">Create one</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
