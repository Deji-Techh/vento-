import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

export function StoryRow({ items }: { items: { id: string; label: string; image: string }[] }) {
  return (
    <View className="flex-row gap-4">
      {items.map((s, i) => (
        <View key={s.id} className="items-center w-[64px]">
          <View
            className={`w-[64px] h-[64px] rounded-full items-center justify-center ${
              i === 0 ? "bg-ember" : "bg-white/15"
            }`}
            style={{ padding: 2.5 }}
          >
            <Image source={{ uri: s.image }} style={{ width: "100%", height: "100%", borderRadius: 999 }} contentFit="cover" />
          </View>
          <Text className="text-white/60 text-[11px] font-inter-medium mt-1.5" numberOfLines={1}>
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function FoodSnapCard({
  name,
  price,
  image,
  meta,
  rating = "4.5",
  onPress,
  onAdd,
}: {
  name: string;
  price: number;
  image: string;
  meta?: string;
  rating?: string | number;
  onPress?: () => void;
  onAdd?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.92}
      className="w-[208px] mr-3 rounded-[24px] overflow-hidden bg-card-dark"
    >
      <View>
        <Image source={{ uri: image }} style={{ width: "100%", height: 228, borderRadius: 24 }} contentFit="cover" />
        <View className="absolute top-3 left-3">
          <View className="px-2.5 py-1.5 rounded-full bg-black/55">
            <Text className="text-white text-[11px] font-inter-bold">★ {rating}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onAdd}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white items-center justify-center"
        >
          <Text className="text-ink text-[20px] font-inter-bold leading-none -mt-0.5">+</Text>
        </TouchableOpacity>
      </View>
      <View className="px-1.5 pt-2.5 pb-1">
        <Text className="text-white text-[15px] font-inter-bold tracking-tight" numberOfLines={1}>
          {name}
        </Text>
        {meta ? (
          <Text className="text-white/45 text-[12px] font-inter mt-0.5" numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
        <Text className="text-white text-[14px] font-inter-bold mt-1">₦{price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Ember used here ONLY — the single allowed color moment on dark.
export function PromoBanner({ title, subtitle, cta, onPress }: { title: string; subtitle: string; cta: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.94} className="rounded-[24px] p-[18px] flex-row items-center bg-ember">
      <View className="flex-1 pr-3">
        <Text className="text-white font-inter-bold text-[16px] tracking-tight">{title}</Text>
        <Text className="text-white/85 text-[13px] font-inter mt-1 leading-snug">{subtitle}</Text>
      </View>
      <View className="bg-white pl-4 pr-3 py-2.5 rounded-full flex-row items-center">
        <Text className="text-ink text-[13px] font-inter-bold">{cta}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function EmptyState({ title, subtitle, dark }: { title: string; subtitle: string; dark?: boolean }) {
  return (
    <View className={`rounded-[28px] p-8 items-center ${dark ? "bg-surface-dark-2" : "bg-white border border-border"}`}>
      <Text className={`font-inter-bold text-[17px] tracking-tight ${dark ? "text-white" : "text-ink"}`}>{title}</Text>
      <Text className={`text-[14px] font-inter mt-1 text-center ${dark ? "text-white/55" : "text-ink/55"}`}>{subtitle}</Text>
    </View>
  );
}
