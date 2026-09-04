import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";

export default function Signup() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain letters and numbers";
    }
    if (!formData.terms) newErrors.terms = "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      Alert.alert("Account created!", "Welcome to Vento.", [
        { text: "OK", onPress: () => router.replace("/auth/choose-role") },
      ]);
    } catch (error: any) {
      Alert.alert("Signup failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-5 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-lg mt-4"
          >
            <Text className="text-2xl text-gray-900">←</Text>
          </TouchableOpacity>

          <View className="mt-4 mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Join Vento
            </Text>
            <Text className="text-base text-gray-500">
              Sign up to start your smooth shopping journey.
            </Text>
          </View>

          <View className="space-y-4">
            <View className="flex-row gap-4">
              <View className="flex-1">
                <TextInput
                  className={`w-full h-10 rounded-lg border px-4 text-base bg-white text-gray-900 ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="First Name"
                  placeholderTextColor="#9CA3AF"
                  value={formData.firstName}
                  onChangeText={(val) => handleChange("firstName", val)}
                />
                {errors.firstName ? (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </Text>
                ) : null}
              </View>
              <View className="flex-1">
                <TextInput
                  className={`w-full h-10 rounded-lg border px-4 text-base bg-white text-gray-900 ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Last Name"
                  placeholderTextColor="#9CA3AF"
                  value={formData.lastName}
                  onChangeText={(val) => handleChange("lastName", val)}
                />
                {errors.lastName ? (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.lastName}
                  </Text>
                ) : null}
              </View>
            </View>

            <View>
              <TextInput
                className={`w-full h-10 rounded-lg border px-4 text-base bg-white text-gray-900 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Email Address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={formData.email}
                onChangeText={(val) => handleChange("email", val)}
              />
              {errors.email ? (
                <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
              ) : null}
            </View>

            <View>
              <View className="relative">
                <TextInput
                  className={`w-full h-10 rounded-lg border px-4 pr-12 text-base bg-white text-gray-900 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  value={formData.password}
                  onChangeText={(val) => handleChange("password", val)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Text className="text-gray-500 text-sm">
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.password}
                </Text>
              ) : null}
              <Text className="text-xs text-gray-500 mt-2">
                Must be at least 8 characters with a mix of letters, numbers, and
                symbols.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => handleChange("terms", !formData.terms)}
              className="flex-row items-start mt-4"
            >
              <View
                className={`w-5 h-5 rounded border mr-3 items-center justify-center mt-0.5 ${
                  errors.terms ? "border-red-500" : "border-gray-300"
                } ${formData.terms ? "bg-blue-900 border-blue-900" : ""}`}
              >
                {formData.terms && <Text className="text-white text-xs">✓</Text>}
              </View>
              <Text className="text-sm text-gray-500 flex-1">
                I agree to the{" "}
                <Text className="text-blue-900 font-semibold">Terms of Service</Text>{" "}
                and{" "}
                <Text className="text-blue-900 font-semibold">Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms ? (
              <Text className="text-red-500 text-xs">{errors.terms}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            className="w-full h-10 rounded-lg bg-blue-900 items-center justify-center mt-6"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-white text-base font-semibold">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="px-4 text-xs text-gray-500 uppercase">
              or sign up with
            </Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          <View className="space-y-3 mb-8">
            <TouchableOpacity className="w-full h-10 rounded-lg bg-white border border-gray-300 items-center justify-center flex-row">
              <Text className="text-base font-medium text-gray-700">
                Continue with Google
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-full h-10 rounded-lg bg-white border border-gray-300 items-center justify-center flex-row">
              <Text className="text-base font-medium text-gray-700">
                Continue with Apple
              </Text>
            </TouchableOpacity>
          </View>

          <View className="items-center pb-8">
            <Text className="text-base text-gray-500">
              Already have an account?{" "}
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text className="text-blue-900 font-semibold">Log in</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
