import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Icon } from "./Icon";
import { EyeIcon, EyeOffIcon } from "../icons";

interface TextFieldProps {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  error?: string;
  secure?: boolean;
  showSecure?: boolean;
  onToggleSecure?: () => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: string;
  onBlur?: () => void;
  dark?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

// Single-line field. 56px, 20px radius, Inter. Error state in soft red.
export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secure,
  showSecure,
  onToggleSecure,
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoComplete,
  onBlur,
  dark: darkProp,
  multiline,
  numberOfLines,
}: TextFieldProps) {
  const dark = darkProp ?? useTheme().dark;
  const [focused, setFocused] = useState(false);
  const shell = dark ? "bg-white/[0.06] border-white/10" : "bg-ink/[0.04] border-ink/10";
  const text = dark ? "text-white" : "text-ink";
  const holder = dark ? "rgba(255,255,255,0.35)" : "rgba(10,10,14,0.35)";
  const labelColor = dark ? "text-white" : "text-ink";
  const errorColor = dark ? "text-[#FF8A80]" : "text-[#D92D20]";
  const focusRing = focused ? (dark ? "border-white" : "border-navy") : error ? (dark ? "border-[#FF8A80]" : "border-[#D92D20]") : "";

  return (
    <View>
      {label ? <Text className={`${labelColor} text-[13px] font-inter-bold mb-2`}>{label}</Text> : null}
      <View className="relative">
        <TextInput
          className={`w-full ${multiline ? "min-h-[120px] py-4" : "h-[56px]"} rounded-[20px] border px-4 text-[16px] font-inter ${shell} ${text} ${focusRing} ${secure ? "pr-16" : ""}`}
          placeholder={placeholder}
          placeholderTextColor={holder}
          value={value}
          onChangeText={onChangeText}
          onBlur={() => { setFocused(false); onBlur?.(); }}
          onFocus={() => setFocused(true)}
          secureTextEntry={secure && !showSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete as any}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? "top" : "auto"}
          accessibilityLabel={label || placeholder}
          aria-invalid={!!error}
        />
        {secure ? (
          <TouchableOpacity
            onPress={onToggleSecure}
            accessibilityLabel={showSecure ? "Hide password" : "Show password"}
            accessibilityRole="button"
            className="absolute right-0 top-0 bottom-0 w-16 items-center justify-center"
          >
            <Icon icon={showSecure ? EyeOffIcon : EyeIcon} size={20} color={dark ? "rgba(255,255,255,0.55)" : "rgba(10,10,14,0.5)"} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text className={`${errorColor} text-xs font-inter-medium mt-1.5`}>{error}</Text> : null}
    </View>
  );
}
