import { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Icon } from "../../src/components/ui/Icon";
import { ArrowLeft01Icon } from "../../src/components/icons";
import { toast } from "sonner-native";

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
      toast.success("Welcome to Vento");
      router.replace("/auth/choose-role");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-ink">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 pt-6 pb-8">
            <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full bg-white/10 items-center justify-center active:opacity-70">
              <Icon icon={ArrowLeft01Icon} size={20} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white text-[32px] font-inter-bold tracking-tight mt-6">Join Vento</Text>
            <Text className="text-white/55 text-[15px] font-inter mt-1 mb-7">Two minutes. Then dinner.</Text>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <TextField placeholder="First name" value={formData.firstName} onChangeText={(v) => handleChange("firstName", v)} error={errors.firstName} />
              </View>
              <View className="flex-1">
                <TextField placeholder="Last name" value={formData.lastName} onChangeText={(v) => handleChange("lastName", v)} error={errors.lastName} />
              </View>
            </View>
            <View className="mt-3">
              <TextField placeholder="Email address" keyboardType="email-address" autoCapitalize="none" value={formData.email} onChangeText={(v) => handleChange("email", v)} error={errors.email} />
            </View>
            <View className="mt-3">
              <TextField
                placeholder="Password (8+ characters)"
                secure
                showSecure={showPassword}
                onToggleSecure={() => setShowPassword(!showPassword)}
                value={formData.password}
                onChangeText={(v) => handleChange("password", v)}
                error={errors.password}
              />
            </View>

            <TouchableOpacity onPress={() => handleChange("terms", !formData.terms)} className="flex-row items-center mt-5 active:opacity-70">
              <View className={`w-6 h-6 rounded-full items-center justify-center ${formData.terms ? "bg-white" : "border-2 border-white/25"}`}>
                {formData.terms && <Text className="text-ink text-xs font-inter-bold">✓</Text>}
              </View>
              <Text className="text-[13px] font-inter text-white/60 ml-3 flex-1">
                I agree to the <Text className="font-inter-bold text-white">Terms</Text> and <Text className="font-inter-bold text-white">Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms ? <Text className="text-[#FF8A80] text-xs font-inter-medium mt-1.5">{errors.terms}</Text> : null}

            <View className="mt-7">
              <AppButton title="Create account" variant="white" loading={loading} onPress={handleSignup} />
            </View>

            <TouchableOpacity onPress={() => router.push("/auth/login")} className="items-center mt-6 active:opacity-60">
              <Text className="text-[14px] font-inter text-white/55">
                Have an account? <Text className="font-inter-bold text-white">Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
