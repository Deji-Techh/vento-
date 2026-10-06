import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";

const ASKED_KEY = "vento-push-asked";

// Foreground behaviour: banner + sound + badge while app open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

// Call once per login. Physical device only; no-ops on simulator/web.
export async function registerPush(userId: string) {
  if (Platform.OS === "web") return;
  try {
    const isDevice = (Device as any).isDevice ?? true;
    if (!isDevice) return;
    const { status: existing } = await Notifications.getPermissionsAsync();
    let status = existing;
    if (status !== "granted") {
      const asked = await AsyncStorage.getItem(ASKED_KEY).catch(() => null);
      if (asked) return; // don't nag every login
      const { status: req } = await Notifications.requestPermissionsAsync();
      status = req;
      await AsyncStorage.setItem(ASKED_KEY, "1").catch(() => {});
    }
    if (status !== "granted") return;
    const projectId = (require("../../app.json") as any)?.expo?.extra?.eas?.projectId;
    const { data: token } = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
    if (token) {
      await supabase.from("device_tokens").upsert(
        { user_id: userId, token, platform: Platform.OS },
        { onConflict: "user_id,token" }
      );
    }
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("orders", {
        name: "Order updates",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
  } catch {
    // push is best-effort; in-app notifications always work
  }
}

// Best-effort Expo push to a user's devices. No secret needed for basic volume.
export async function pushToUser(userId: string, title: string, body: string, data?: Record<string, string>) {
  try {
    const { data: rows } = await supabase.from("device_tokens").select("token").eq("user_id", userId);
    const tokens = ((rows as any) || []).map((r: any) => r.token).filter(Boolean);
    if (tokens.length === 0) return;
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tokens.map((t: string) => ({ to: t, title, body, data: data || {}, channelId: "orders" }))),
    }).catch(() => {});
  } catch {
    // never block order flow on push
  }
}
