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
      setEmailError("Please enter a valid email address");
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
      const mockUser = mockUsers[email.toLowerCase()];
      const role = mockUser?.role || "buyer";
      if (role === "admin") {
        router.replace("/(admin)");
      } else if (role === "seller") {
        router.replace("/(seller)");
      } else if (role === "delivery_agent") {
        router.replace("/(delivery)");
      } else {
        router.replace("/(buyer)");
      }
    } catch (error: any) {
      Alert.alert("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    router.push("/auth/signup");
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
        <View className="flex-1 items-center justify-center px-5 py-12">
          <View className="w-full max-w-md">
            <Text className="text-2xl font-bold mb-2 text-gray-900">
              Welcome Back
            </Text>
            <Text className="text-sm text-gray-500 mb-8">
              Sign in to your account to continue.
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium mb-2 text-gray-700">
                  Email
                </Text>
                <TextInput
                  className={`w-full h-10 rounded-lg border px-3 py-2 text-sm bg-white text-gray-900 ${
                    emailError ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (emailError) validateEmail(val);
                  }}
                  onBlur={() => validateEmail(email)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                {emailError ? (
                  <Text className="text-red-500 text-xs mt-1">{emailError}</Text>
                ) : null}
              </View>

              <View>
                <Text className="text-sm font-medium mb-2 text-gray-700">
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm bg-white text-gray-900"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    autoComplete="current-password"
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
              </View>

              <View className="flex-row justify-end">
                <TouchableOpacity>
                  <Text className="text-sm text-blue-700">
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className="w-full h-10 rounded-lg bg-blue-900 items-center justify-center flex-row"
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text className="text-white text-sm font-semibold">
                    Sign in
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="px-3 text-xs text-gray-500 uppercase">
                Or continue with
              </Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            <View className="space-y-3">
              <TouchableOpacity className="w-full h-10 rounded-lg border border-gray-300 bg-white items-center justify-center flex-row">
                <Text className="text-sm font-medium text-gray-700">
                  Google
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-full h-10 rounded-lg border border-gray-300 bg-white items-center justify-center flex-row">
                <Text className="text-sm font-medium text-gray-700">
                  Apple
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={navigateToSignup}
              className="w-full items-center mt-6"
            >
              <Text className="text-sm text-gray-500">
                Need an account?{" "}
                <Text className="font-semibold underline">Create one</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
