import "expo-sqlite/localStorage/install";
import { AppState } from "react-native";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const SUPABASE_CONFIGURED = Boolean(supabaseUrl && supabasePublishableKey);

if (!SUPABASE_CONFIGURED) {
  console.warn("[supabase] Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

// Placeholder keeps module init crash-free when env is missing (e.g. a
// build without EAS env wired); every call then fails with a catchable
// error instead of a red screen at startup.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabasePublishableKey || "placeholder-key",
  {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Supabase runs its refresh loop continuously; tie it to app state.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
