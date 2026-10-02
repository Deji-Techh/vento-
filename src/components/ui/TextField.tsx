import { View, Text, TextInput, TouchableOpacity } from "react-native";

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
  dark = true,
}: TextFieldProps) {
  const shell = dark ? "bg-white/[0.06] border-white/10" : "bg-ink/[0.04] border-ink/10";
  const text = dark ? "text-white" : "text-ink";
  const holder = dark ? "rgba(255,255,255,0.35)" : "rgba(10,10,14,0.35)";
  const labelColor = dark ? "text-white" : "text-ink";

  return (
    <View>
      {label ? <Text className={`${labelColor} text-[13px] font-inter-bold mb-2`}>{label}</Text> : null}
      <View className="relative">
        <TextInput
          className={`w-full h-[56px] rounded-[20px] border px-4 text-[16px] font-inter ${shell} ${text} ${
            error ? "border-[#FF8A80]" : ""
          } ${secure ? "pr-16" : ""}`}
          placeholder={placeholder}
          placeholderTextColor={holder}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={secure && !showSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete as any}
        />
        {secure ? (
          <TouchableOpacity
            onPress={onToggleSecure}
            className="absolute right-0 top-0 bottom-0 w-16 items-center justify-center"
          >
            <Text className={`text-[13px] font-inter-bold ${dark ? "text-white/45" : "text-ink/45"}`}>
              {showSecure ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text className="text-[#FF8A80] text-xs font-inter-medium mt-1.5">{error}</Text> : null}
    </View>
  );
}
