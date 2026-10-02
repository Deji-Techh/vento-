import { HugeiconsIcon } from "@hugeicons/react-native";

// App-wide icon wrapper. Import glyphs from @hugeicons/core-free-icons
// (via domain barrels when they land) and render through here so size,
// color and stroke stay consistent. Free set = Stroke Rounded.
export function Icon({
  icon,
  size = 22,
  color = "#FFFFFF",
  strokeWidth = 1.8,
}: {
  icon: any;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return <HugeiconsIcon icon={icon} size={size} color={color} strokeWidth={strokeWidth} />;
}
