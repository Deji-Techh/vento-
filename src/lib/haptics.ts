import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

// Single haptic entry — removes ~30 copy-pasted Platform guards.
export function buzz(style: "light" | "success" | "error" | "medium" = "light") {
  if (Platform.OS === "web") return;
  try {
    if (style === "success") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    else if (style === "error") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    else if (style === "medium") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    else Haptics.selectionAsync().catch(() => {});
  } catch {}
}
