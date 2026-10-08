import { Platform, View, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

import { ACTIVE_CAMPUS } from "../lib/campus";

// Shared live map. Demo Google key (limited capabilities): no Directions/Routes
// fetch — straight demo polyline only. Real rider GPS dots appear once the
// order flow writes deliveries + presence. Web renders an honest fallback.
export const CAMPUS = { latitude: ACTIVE_CAMPUS.latitude, longitude: ACTIVE_CAMPUS.longitude };

export function LiveMapView({ height = 380, dark: darkProp }: { height?: number; dark?: boolean }) {
  const dark = darkProp ?? useTheme().dark;
  if (Platform.OS === "web") {
    return (
      <View style={{ height }} className={`rounded-[28px] items-center justify-center px-8 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
        <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>Live map</Text>
        <Text className={`text-[13px] font-inter mt-1 text-center ${dark ? "text-white/55" : "text-ink/55"}`}>Native map preview appears in the Expo Go / device build.</Text>
      </View>
    );
  }
  const Map = require("react-native-maps").default;
  const { Marker, Polyline } = require("react-native-maps");
  const kitchen = { latitude: CAMPUS.latitude + 0.008, longitude: CAMPUS.longitude - 0.006 };
  const home = { latitude: CAMPUS.latitude - 0.009, longitude: CAMPUS.longitude + 0.007 };
  return (
    <View style={{ height }} className={`rounded-[28px] overflow-hidden border ${dark ? "border-white/10" : "border-border"}`}>
      <Map
        style={{ flex: 1 }}
        initialRegion={{ ...CAMPUS, latitudeDelta: 0.035, longitudeDelta: 0.035 }}
        showsUserLocation
        showsMyLocationButton={false}
        toolbarEnabled={false}
        accessibilityLabel="Live delivery map"
      >
        <Marker coordinate={kitchen} title="Kitchen" description="Pickup" />
        <Marker coordinate={home} title="Dropoff" description="Delivery address" />
        <Polyline coordinates={[kitchen, CAMPUS, home]} strokeWidth={3} strokeColor={dark ? "#FFFFFF" : "#000080"} lineDashPattern={[1, 0]} />
      </Map>
    </View>
  );
}
