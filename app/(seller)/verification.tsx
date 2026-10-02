import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import {
  CheckmarkCircle01Icon,
  IdentificationIcon,
  BankIcon,
  ShieldCheckIcon,
  Camera01Icon,
} from "../../src/components/icons";

const steps = [
  { id: 1, title: "Personal information", completed: true },
  { id: 2, title: "Business details", completed: true },
  { id: 3, title: "ID verification", completed: false },
  { id: 4, title: "Bank account", completed: false },
];

export default function SellerVerification() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    idType: "nin",
    idNumber: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const handleSubmit = () => {
    if (!formData.bankName || !formData.accountNumber || !formData.accountName) {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      toast.error("Fill in all bank details");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      toast.success("Documents under review");
      router.back();
    }, 800);
  };

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Eyebrow>Compliance</Eyebrow>
        <Text className="text-[28px] font-inter-bold text-ink mt-1 tracking-tight">Verify account</Text>
        <Text className="text-[13px] font-inter text-ink/55 mt-1 mb-6">
          Complete verification to start receiving orders.
        </Text>

        <View className="bg-white rounded-[24px] border border-border p-6 mb-4 gap-4">
          {steps.map((step) => (
            <View key={step.id} className="flex-row items-center gap-3">
              <View
                className={`w-9 h-9 rounded-full items-center justify-center border ${
                  step.completed ? "bg-success border-success" : currentStep === step.id ? "bg-ink border-ink" : "bg-cream border-border"
                }`}
              >
                {step.completed ? (
                  <Icon icon={CheckmarkCircle01Icon} size={18} color="#fff" />
                ) : (
                  <Text className={`text-[13px] font-inter-bold ${currentStep === step.id ? "text-white" : "text-ink/55"}`}>
                    {step.id}
                  </Text>
                )}
              </View>
              <Text className="text-[13px] font-inter-bold" style={{ color: step.completed ? "#12805C" : "#0A0A0E" }}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>

        {currentStep === 3 && (
          <View className="gap-4">
            <View className="bg-white rounded-[24px] border border-border p-6">
              <View className="flex-row items-center gap-2 mb-3">
                <Icon icon={IdentificationIcon} size={20} color="#1B1B8F" />
                <Text className="text-lg font-inter-bold text-ink tracking-tight">ID verification</Text>
              </View>
              <Text className="text-ink text-[13px] font-inter-bold mb-2">ID type</Text>
              <View className="flex-row gap-2">
                {["nin", "passport", "drivers_license"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setFormData({ ...formData, idType: type })}
                    activeOpacity={0.85}
                    className={`flex-1 h-14 rounded-full items-center justify-center px-1 border ${
                      formData.idType === type ? "bg-ink border-ink" : "bg-white border-border"
                    }`}
                  >
                    <Text
                      className={`text-xs font-inter-bold capitalize ${formData.idType === type ? "text-white" : "text-ink"}`}
                      numberOfLines={1}
                    >
                      {type.replace("_", " ")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View className="mt-4">
                <TextField label="ID number" value={formData.idNumber} onChangeText={(v) => setFormData({ ...formData, idNumber: v })} placeholder="Enter your ID number" dark={false} />
              </View>
            </View>
            <View className="bg-white rounded-[24px] border border-border p-6">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => toast.success("Document picker coming soon")}
                className="border-2 border-dashed border-border rounded-[20px] p-8 items-center bg-cream"
              >
                <View className="w-12 h-12 rounded-full bg-white border border-border items-center justify-center">
                  <Icon icon={Camera01Icon} size={22} color="#1B1B8F" />
                </View>
                <Text className="font-inter-bold text-ink mt-3">Upload ID document</Text>
                <Text className="text-[13px] font-inter text-ink/55">JPG, PNG or PDF</Text>
              </TouchableOpacity>
            </View>
            <AppButton title="Continue" variant="ink" onPress={() => setCurrentStep(4)} />
          </View>
        )}

        {currentStep === 4 && (
          <View className="gap-4">
            <View className="bg-white rounded-[24px] border border-border p-6 gap-4">
              <View className="flex-row items-center gap-2">
                <Icon icon={BankIcon} size={20} color="#1B1B8F" />
                <Text className="text-lg font-inter-bold text-ink tracking-tight">Bank account</Text>
              </View>
              <TextField label="Bank name" value={formData.bankName} onChangeText={(v) => setFormData({ ...formData, bankName: v })} placeholder="e.g. GTBank, Access Bank" dark={false} />
              <TextField label="Account number" value={formData.accountNumber} onChangeText={(v) => setFormData({ ...formData, accountNumber: v })} placeholder="10-digit account number" keyboardType="numeric" dark={false} />
              <TextField label="Account name" value={formData.accountName} onChangeText={(v) => setFormData({ ...formData, accountName: v })} placeholder="Name on bank account" dark={false} />
            </View>
            <AppButton title="Submit for Verification" variant="ink" loading={submitting} onPress={handleSubmit} />
            <View className="flex-row items-center justify-center gap-2">
              <Icon icon={ShieldCheckIcon} size={15} color="rgba(10,10,14,0.4)" />
              <Text className="text-xs font-inter text-ink/55">Details are encrypted and reviewed within 24h</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
