import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { Eyebrow } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import { ArrowLeft01Icon } from "../../src/components/icons";
import { Enter } from "../../src/components/motion";

const sections = [
  { title: "1. What Vento is", body: "Vento is a campus marketplace connecting buyers, sellers (kitchens/stores) and delivery agents. All listings are published exclusively by the Vento admin team after verification. Sellers and riders cannot self-publish listings. Prices are in Naira (₦). Delivery fee is ₦1,500 per order, free over ₦10,000. Platform commission is 10%." },
  { title: "2. Accounts & roles", body: "Sign up as buyer, seller or rider. There is no admin signup — admin access is login-only via dedicated Vento accounts (e.g. admin@vento.ng) and routes to the in-app admin section. You are responsible for keeping your password secret. One account per person. Vento may suspend accounts for fraud, abuse or impersonation." },
  { title: "3. Orders & delivery", body: "Placing an order creates a pending order. Sellers confirm within 5 minutes (SLA) or the order auto-cancels. Delivery is fulfilled by assigned riders. Live tracking is indicative; the delivery PIN shown in the app is required to confirm receipt. Confirming delivery marks the order delivered." },
  { title: "4. Payments, payouts & refunds", body: "Pay on delivery (POD) is default; Paystack where offered. Seller/rider payouts settle to bank transfer with a ₦1,000 minimum, typically 1–3 business days after approval. Refunds go to wallet/bank after admin review. Disputes must be raised within 24 hours of delivery with photos/details." },
  { title: "5. Listings & availability", body: "If no items appear, the catalogue is empty — new items appear only after admin publishes them. Prices, prep times and availability can change. An item marked unavailable cannot be ordered. Images are illustrative." },
  { title: "6. Cancellations & disputes", body: "Buyers may cancel free while pending/accepted. Sellers may decline with reason (out of stock, kitchen closed, too busy). Riders may fail a delivery with reason + photo (customer unreachable, address wrong). Admin resolves disputes: refund, redelivery or rejection. Chargeback abuse leads to bans." },
  { title: "7. Conduct & prohibited items", body: "No illegal, unsafe, expired or counterfeit goods. No harassment of riders/sellers/support. No fake orders, PIN sharing or delivery fraud. Violations lead to warnings, suspension or permanent ban plus forfeiture of pending payouts under review." },
  { title: "8. Privacy & data", body: "We store your name, email, phone, addresses, orders and messages to run the marketplace. Delivery PINs, locations and chats are used only for fulfilment and safety. We never sell your data. Contact support to access, correct or delete your data." },
  { title: "9. Liability", body: "Vento provides the platform as-is. Kitchens prepare food; riders deliver. Vento is not liable for food quality/allergens beyond facilitating refunds per policy. Maximum liability per order is the order total. Nothing here limits rights you have by law." },
  { title: "10. Changes & contact", body: "We may update these terms; material changes are notified in-app. Continued use means acceptance. Support: help in-app chat, or email the address shown in Help center. Operated by Vento. Version 1.0 — effective October 2026." },
];

export default function Terms() {
  const router = useRouter();
  const { dark } = useTheme();
  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top", "bottom"]}>
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center pt-1 mb-5">
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" className="w-11 h-11 items-center justify-center active:opacity-60">
            <Icon icon={ArrowLeft01Icon} size={22} color={dark ? "#fff" : "#0A0A0E"} />
          </TouchableOpacity>
          <Text className={`text-[20px] font-inter-bold tracking-tight ml-3 ${dark ? "text-white" : "text-ink"}`}>Terms & Privacy</Text>
        </View>
        <Enter>
          <Eyebrow>Vento v1.0</Eyebrow>
          <Text className={`text-[28px] font-serif-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>The fine print, plainly.</Text>
          <Text className={`text-[14px] font-inter mt-2 mb-5 ${dark ? "text-white/55" : "text-ink/55"}`}>Short version: admin publishes every listing, ₦1,500 delivery (free over ₦10k), POD by default, 24h dispute window, ₦1,000 min payout.</Text>
        </Enter>
        <View className="gap-3">
          {sections.map((s, i) => (
            <Enter key={s.title} delay={Math.min(i * 40, 200)}>
              <View className={`rounded-[24px] p-6 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                <Text className={`text-[16px] font-inter-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>{s.title}</Text>
                <Text className={`text-[14px] font-inter mt-2 leading-[21px] ${dark ? "text-white/65" : "text-ink/65"}`}>{s.body}</Text>
              </View>
            </Enter>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
