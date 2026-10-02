import { ReactNode } from "react";
import Animated, { FadeIn, FadeInUp, useReducedMotion } from "react-native-reanimated";

// Single entrance primitive. Subtle rise-and-fade; dissolves when
// Reduced Motion is on. Keep delays small (0–150ms) — felt, not noticed.
export function Enter({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <Animated.View
      entering={reduced ? FadeIn.duration(150) : FadeInUp.delay(delay).duration(450).damping(22)}
      className={className}
    >
      {children}
    </Animated.View>
  );
}
