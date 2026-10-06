import { ReactNode, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "../../contexts/ThemeContext";
import { buzz } from "../../lib/haptics";

// Shared bottom sheet: snap points, blurred backdrop, haptic on snap.
// Use for size pickers, payment pick, filters, withdraw, live-map panel.
export function AppSheet({ snap = ["45%", "85%"], title, children, onClose }: { snap?: string[]; title: string; children: ReactNode; onClose?: () => void }) {
  const { dark } = useTheme();
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.45} />,
    []
  );
  return (
    <BottomSheet
      snapPoints={snap}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: dark ? "rgba(255,255,255,0.3)" : "rgba(10,10,14,0.2)", width: 48, height: 6 }}
      backgroundStyle={{ backgroundColor: dark ? "#131318" : "#FFFFFF", borderRadius: 32 }}
      onChange={() => buzz()}
    >
      <BottomSheetView style={{ padding: 24, gap: 12 }}>
        <View className="flex-row items-center justify-between">
          <Text className={`text-[17px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>{title}</Text>
          {onClose ? (
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close sheet" className="w-11 h-11 items-center justify-center">
              <Text className={`text-[15px] font-inter-bold ${dark ? "text-white/60" : "text-ink/60"}`}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
}
