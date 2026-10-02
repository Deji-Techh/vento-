import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { AppButton } from "../../src/components/ui/AppButton";

export default function Signup() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", terms: false });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = "Required";
    if (!formData.lastName.trim()) e.lastName = "Required";
    if (!formData.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email";
    if (!formData.password) e.password = "Required";
    else if (formData.password.length < 8) e.password = "Min 8 characters";
    if (!formData.terms) e.terms = "Please accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp({ email: formData.email, password: formData.password, firstName: formData.firstName, lastName: formData.lastName });
      Alert.alert("Welcome to Vento", "Your account is ready.", [{ text: "OK", onPress: () => router.replace("/auth/choose-role") }]);
    } catch (error: any) {
      Alert.alert("Signup failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const input = (bad: boolean) =>
    `w-full h-[56px] rounded-2xl border px-4 text-[16px] bg-white/[0.06] text-white ${bad ? "border-[#FF8A80]" : "border-white/10"}`;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-ink">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 pt-6 pb-8">
            <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full bg-white/10 items-center justify-center active:opacity-70">
              <Text className="text-lg text-white">←</Text>
            </TouchableOpacity>
            <>
              <Text className="text-white text-[34px] font-bold tracking-tight mt-6">Join Vento</Text>
              <Text className="text-white/55 text-[16px] mt-1 mb-7">Two minutes. Then dinner.</Text>
            </>

            <>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <TextInput className={input(!!errors.firstName)} placeholder="First name" placeholderTextColor="rgba(255,255,255,0.35)" value={formData.firstName} onChangeText={(v) => handleChange("firstName", v)} />
                </View>
                <View className="flex-1">
                  <TextInput className={input(!!errors.lastName)} placeholder="Last name" placeholderTextColor="rgba(255,255,255,0.35)" value={formData.lastName} onChangeText={(v) => handleChange("lastName", v)} />
                </View>
              </View>
              <View className="mt-3">
                <TextInput className={input(!!errors.email)} placeholder="Email address" placeholderTextColor="rgba(255,255,255,0.35)" keyboardType="email-address" autoCapitalize="none" value={formData.email} onChangeText={(v) => handleChange("email", v)} />
              </View>
              <View className="mt-3 relative">
                <TextInput className={`${input(!!errors.password)} pr-16`} placeholder="Password (8+ characters)" placeholderTextColor="rgba(255,255,255,0.35)" secureTextEntry={!showPassword} value={formData.password} onChangeText={(v) => handleChange("password", v)} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-0 top-0 bottom-0 w-16 items-center justify-center">
                  <Text className="text-white/45 text-[13px] font-bold">{showPassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
              </View>
            </>

            <TouchableOpacity onPress={() => handleChange("terms", !formData.terms)} className="flex-row items-center mt-5 active:opacity-70">
              <View className={`w-6 h-6 rounded-full items-center justify-center ${formData.terms ? "bg-white" : "border-2 border-white/25"}`}>
                {formData.terms && <Text className="text-ink text-xs font-bold">✓</Text>}
              </View>
              <Text className="text-[13px] text-white/60 ml-3 flex-1">
                I agree to the <Text className="font-bold text-white">Terms</Text> and <Text className="font-bold text-white">Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            <View className="mt-7">
              <AppButton title="Create account" variant="white" loading={loading} onPress={handleSignup} />
            </View>

            <TouchableOpacity onPress={() => router.push("/auth/login")} className="items-center mt-6 active:opacity-60">
              <Text className="text-[14px] text-white/55">
                Have an account? <Text className="font-bold text-white">Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
