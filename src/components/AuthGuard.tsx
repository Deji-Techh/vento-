import { ReactNode } from "react";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth, Role } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

// Central role gate. Admin is NEVER offered in signup/choose-role —
// login-only via dedicated admin email, authority = profiles.role + RLS.
export function RequireRole({ allow, children, redirectTo = "/(buyer)/browse" }: { allow: Role[]; children: ReactNode; redirectTo?: any }) {
  const { user, role, loading } = useAuth();
  const { dark } = useTheme();
  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${dark ? "bg-ink" : "bg-cream"}`}>
        <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
      </View>
    );
  }
  if (!user) return <Redirect href="/auth/login" />;
  if (!role || !allow.includes(role)) return <Redirect href={redirectTo} />;
  return <>{children}</>;
}
