import AsyncStorage from "@react-native-async-storage/async-storage";

export const ONBOARDING_SEEN_KEY = "vento-onboarding-seen";

export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_SEEN_KEY)) === "1";
  } catch {
    return false;
  }
}

export function markOnboardingSeen() {
  AsyncStorage.setItem(ONBOARDING_SEEN_KEY, "1").catch(() => {});
}
