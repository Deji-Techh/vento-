import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform, Linking } from "react-native";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { Eyebrow, StatusChip } from "../../src/components/ui/SectionHeader";
import { EmptyState } from "../../src/components/ui/Cards";
import { Icon } from "../../src/components/ui/Icon";
import { useTheme } from "../../src/contexts/ThemeContext";
import { LiveMapView } from "../../src/components/LiveMapView";
import { buzz } from "../../src/lib/haptics";
import {
  MapPinIcon,
  Navigation01Icon,
  RefreshIcon,
} from "../../src/components/icons";

export default function DeliveryMap() {
  const { dark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [perm, setPerm] = useState<Location.PermissionStatus | null>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const sub = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "web") { setLoading(false); return; }
      const { status } = await Location.getForegroundPermissionsAsync();
      setPerm(status);
      if (status === "granted") {
        try {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        } catch {}
      }
      setLoading(false);
    })();
    return () => { sub.current?.remove(); };
  }, []);

  const requestPerm = async () => {
    if (Platform.OS === "web") { toast("Location is native-only — use the device build"); return; }
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPerm(status);
    if (status !== "granted") {
      toast.error("Location denied — tracking paused");
      return;
    }
    refreshLocation();
  };

  const refreshLocation = async () => {
    buzz();
    if (Platform.OS === "web") return;
    if (perm !== "granted") { requestPerm(); return; }
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      toast.success("Location refreshed");
    } catch {
      toast.error("Couldn't get location");
    }
  };

  const toggleTracking = async () => {
    if (Platform.OS === "web") { toast("Tracking is native-only — use the device build"); return; }
    if (perm !== "granted") { requestPerm(); return; }
    const next = !isTracking;
    setIsTracking(next);
    buzz("medium");
    if (next) {
      try {
        sub.current = await Location.watchPositionAsync({ accuracy: Location.Accuracy.Balanced, distanceInterval: 20 }, (pos) => {
          setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        });
        toast.success("Location tracking started");
      } catch {
        setIsTracking(false);
        toast.error("Couldn't start tracking");
      }
    } else {
      sub.current?.remove();
      sub.current = null;
      toast.success("Location tracking stopped");
    }
  };

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${dark ? "bg-ink" : "bg-cream"}`}>
        <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
      </View>
    );
  }

  return (
    <ScrollView className={`flex-1 px-5 pt-14 ${dark ? "bg-ink" : "bg-cream"}`} contentContainerStyle={{ paddingBottom: 120, gap: 16 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Eyebrow>Route</Eyebrow>
          <Text className={`text-[28px] font-inter-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>Live Map</Text>
          <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
            {perm === "granted" ? "Real GPS — demo route overlay" : "Grant location to start live tracking"}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <StatusChip label={isTracking ? "Tracking" : "Paused"} tone={isTracking ? "success" : "neutral"} />
          <TouchableOpacity
            onPress={refreshLocation}
            accessibilityLabel="Refresh location"
            accessibilityRole="button"
            activeOpacity={0.85}
            className={`w-11 h-11 rounded-full border items-center justify-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
          >
            <Icon icon={RefreshIcon} size={16} color={dark ? "#FFFFFF" : "#0A0A0E"} />
          </TouchableOpacity>
        </View>
      </View>

      <LiveMapView height={380} />

      <View className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
        <View className="flex-row items-center gap-2 mb-4">
          <View className={`w-9 h-9 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
            <Icon icon={Navigation01Icon} size={16} color={dark ? "#FFFFFF" : "#0A0A0E"} />
          </View>
          <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Location tracking</Text>
        </View>
        <View className="mb-4">
          <Text className={`text-[13px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Your location</Text>
          <Text className={`text-[12px] font-inter mt-0.5 ${dark ? "text-white/55" : "text-ink/55"}`}>
            {coords ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : perm === "granted" ? "Locating…" : "Permission needed"}
          </Text>
        </View>
        {perm !== "granted" ? (
          <AppButton title="Enable location" variant="ink" onPress={requestPerm} />
        ) : (
          <AppButton
            title={isTracking ? "Stop Tracking" : "Start Tracking"}
            variant={isTracking ? (dark ? "ghost-dark" : "ghost-light") : dark ? "white" : "ink"}
           
            onPress={toggleTracking}
          />
        )}
        {perm !== null && perm !== "granted" ? (
          <TouchableOpacity onPress={() => Linking.openSettings()} className="items-center mt-3">
            <Text className={`text-[13px] font-inter-bold ${dark ? "text-white/60" : "text-ink/60"}`}>Open Settings →</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <EmptyState title="No active delivery" subtitle="Assignments appear here once the order flow is wired. Map above is live GPS." />
      <View className="flex-row items-center gap-2 opacity-60 px-1">
        <Icon icon={MapPinIcon} size={14} color={dark ? "rgba(255,255,255,0.6)" : "#55505E"} />
        <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Demo key — route line is illustrative, not Directions API.</Text>
      </View>
    </ScrollView>
  );
}
