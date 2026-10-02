import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { AppButton } from "../../src/components/ui/AppButton";
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
      Alert.alert("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-ink">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 pt-10 pb-8">
            <>
              <View className="w-11 h-11 rounded-full bg-white items-center justify-center mb-8">
                <Text className="text-ink text-lg font-bold">V</Text>
              </View>
            </>
            <>
              <Text className="text-white text-[34px] font-bold tracking-tight leading-[36px]">Welcome back</Text>
              <Text className="text-white/55 text-[16px] mt-2 mb-8">Dinner is 30 minutes away.</Text>
            </>

            <>
              <View>
                <Text className="text-white text-[13px] font-bold mb-2">Email</Text>
                <TextInput
                  className={`w-full h-[56px] rounded-2xl border px-4 text-[16px] bg-white/[0.06] text-white ${emailError ? "border-[#FF8A80]" : "border-white/10"}`}
                  placeholder="you@campus.edu"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={email}
                  onChangeText={(v) => {
                    setEmail(v);
                    if (emailError) validateEmail(v);
                  }}
                  onBlur={() => validateEmail(email)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                {emailError ? <Text className="text-[#FF8A80] text-xs mt-1.5">{emailError}</Text> : null}
              </View>
            </>

            <>
              <View className="mt-4">
                <Text className="text-white text-[13px] font-bold mb-2">Password</Text>
                <View className="relative">
                  <TextInput
                    className="w-full h-[56px] rounded-2xl border border-white/10 px-4 pr-16 text-[16px] bg-white/[0.06] text-white"
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    autoComplete="current-password"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-0 top-0 bottom-0 w-16 items-center justify-center">
                    <Text className="text-white/45 text-[13px] font-bold">{showPassword ? "Hide" : "Show"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>

            <View className="flex-row justify-end mt-3 mb-7">
              <TouchableOpacity className="active:opacity-60">
                <Text className="text-[14px] text-white font-semibold">Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <>
              <AppButton title="Sign in" variant="white" loading={loading} onPress={handleLogin} />
            </>

            <View className="flex-row items-center my-7">
              <View className="flex-1 h-px bg-white/10" />
              <Text className="px-3 text-[11px] text-white/40 font-bold tracking-[1px]">OR</Text>
              <View className="flex-1 h-px bg-white/10" />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 h-[52px] rounded-full bg-white/10 border border-white/15 items-center justify-center active:opacity-70">
                <Text className="text-[14px] font-bold text-white">Google</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 h-[52px] rounded-full bg-white/10 border border-white/15 items-center justify-center active:opacity-70">
                <Text className="text-[14px] font-bold text-white">Apple</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push("/auth/signup")} className="items-center mt-8 active:opacity-60">
              <Text className="text-[14px] text-white/55">
                Need an account? <Text className="font-bold text-white">Create one</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
