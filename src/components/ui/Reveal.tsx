import { ReactNode } from "react";
import Animated, { FadeInUp } from "react-native-reanimated";

// Subtle staggered entrance. Keep delays small (0–350ms) and durations
// short — premium motion is felt, not noticed.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(550).damping(22)} className={className}>
      {children}
    </Animated.View>
  );
}
