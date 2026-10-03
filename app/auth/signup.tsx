import { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Enter } from "../../src/components/motion";
import { Icon } from "../../src/components/ui/Icon";
import { ArrowLeft01Icon } from "../../src/components/icons";
import { toast } from "sonner-native";

export default function Signup() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { dark } = useTheme();
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
              <Text className={`text-[32px] font-display-bold tracking-tight mt-6 ${dark ? "text-white" : "text-ink"}`}>Join Vento</Text>
              <Text className={`text-[15px] font-inter mt-1 mb-7 ${dark ? "text-white/55" : "text-ink/55"}`}>Two minutes. Then dinner.</Text>
            </Enter>

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
              <View className={`w-6 h-6 rounded-full items-center justify-center ${formData.terms ? (dark ? "bg-white" : "bg-ink") : dark ? "border-2 border-white/25" : "border-2 border-ink/20"}`}>
                {formData.terms && <Text className={`text-xs font-inter-bold ${dark ? "text-ink" : "text-white"}`}>✓</Text>}
              </View>
              <Text className={`text-[13px] font-inter ml-3 flex-1 ${dark ? "text-white/60" : "text-ink/60"}`}>
                I agree to the <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Terms</Text> and <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms ? <Text className="text-[#FF8A80] text-xs font-inter-medium mt-1.5">{errors.terms}</Text> : null}

            <View className="mt-7">
              <AppButton title="Create account" variant={dark ? "white" : "ink"} loading={loading} onPress={handleSignup} />
            </View>

            <View className="flex-row items-center my-6">
              <View className={`flex-1 h-px ${dark ? "bg-white/10" : "bg-ink/10"}`} />
              <Text className={`px-3 text-[11px] font-inter-bold tracking-[1px] ${dark ? "text-white/40" : "text-ink/40"}`}>OR</Text>
              <View className={`flex-1 h-px ${dark ? "bg-white/10" : "bg-ink/10"}`} />
            </View>

            <View className="flex-row gap-3">
              {["Google", "Apple"].map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => toast(`${p} sign-up comes with the full app build`)}
                  className={`flex-1 h-[52px] rounded-full border items-center justify-center active:opacity-70 ${dark ? "bg-white/10 border-white/15" : "bg-ink/[0.04] border-ink/10"}`}
                >
                  <Text className={`text-[14px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={() => router.push("/auth/login")} className="items-center mt-6 active:opacity-60">
              <Text className={`text-[14px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
                Have an account? <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
