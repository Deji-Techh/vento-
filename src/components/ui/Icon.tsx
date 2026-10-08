// App-wide icon wrapper. Glyphs come from src/components/icons (Phosphor).
// Size, color and stroke stay consistent everywhere.
export function Icon({
  icon: Glyph,
  size = 22,
  color = "#FFFFFF",
  strokeWidth = 1.8,
}: {
  icon: any;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return <Glyph size={size} color={color} weight={strokeWidth >= 2 ? "bold" : "regular"} />;
}
