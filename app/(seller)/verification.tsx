import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Check, Upload } from "lucide-react-native";
import { AppButton } from "../../src/components/ui/AppButton";

const steps = [
  { id: 1, title: "Personal Information", completed: true },
  { id: 2, title: "Business Details", completed: true },
  { id: 3, title: "ID Verification", completed: false },
  { id: 4, title: "Bank Account", completed: false },
];

export default function SellerVerification() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(3);
  const [formData, setFormData] = useState({
    idType: "nin",
    idNumber: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const handleSubmit = () => {
    Alert.alert("Verification Submitted", "Your documents are under review.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-[#FAF5EA] px-5 pt-14 pb-10">
      <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">
        Compliance
      </Text>
      <Text className="text-[28px] font-bold text-ink mt-1 mb-1">Verify Account</Text>
      <Text className="text-ink/55 mb-7">
        Complete verification to start receiving orders.
      </Text>

      {/* Steps */}
      <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-6 mb-4 gap-4">
        {steps.map((step) => (
          <View key={step.id} className="flex-row items-center gap-3">
            <View
              className={`w-9 h-9 rounded-full items-center justify-center border ${
                step.completed
                  ? "bg-[#12805C] border-[#12805C]"
                  : currentStep === step.id
                  ? "bg-ink border-ink"
                  : "bg-[#FAF5EA] border-[#E7E0D2]"
              }`}
            >
              {step.completed ? (
                <Check color="#FFFFFF" size={18} />
              ) : (
                <Text
                  className={`text-sm font-bold ${
                    currentStep === step.id ? "text-white" : "text-ink/55"
                  }`}
                >
                  {step.id}
                </Text>
              )}
            </View>
            <Text
              className="text-sm font-bold"
              style={{ color: step.completed ? "#12805C" : "#0A0A0E" }}
            >
              {step.title}
            </Text>
          </View>
        ))}
      </View>

      {/* Step 3: ID Verification */}
      {currentStep === 3 && (
        <View className="gap-4">
          <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-6">
            <Text className="text-lg font-bold text-ink mb-3">ID Verification</Text>
            <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55 mb-2">
              ID Type
            </Text>
            <View className="flex-row gap-2">
              {["nin", "passport", "drivers_license"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFormData({ ...formData, idType: type })}
                  className={`flex-1 h-14 rounded-full items-center justify-center px-1 border ${
                    formData.idType === type
                      ? "bg-ink border-ink"
                      : "bg-white border-[#E7E0D2]"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold capitalize ${
                      formData.idType === type ? "text-white" : "text-ink"
                    }`}
                    numberOfLines={1}
                  >
                    {type.replace("_", " ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55 mt-4 mb-2">
              ID Number
            </Text>
            <TextInput
              value={formData.idNumber}
              onChangeText={(val) =>
                setFormData({ ...formData, idNumber: val })
              }
              placeholder="Enter your ID number"
              placeholderTextColor="#9CA3AF"
              className="w-full h-14 px-4 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] text-ink"
            />
          </View>
          <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-6">
            <TouchableOpacity className="border-2 border-dashed border-[#E7E0D2] rounded-[20px] p-8 items-center bg-[#FAF5EA]">
              <View className="w-12 h-12 rounded-full bg-white border border-[#E7E0D2] items-center justify-center">
                <Upload color="#1B1B8F" size={22} />
              </View>
              <Text className="font-bold text-ink mt-3">
                Upload ID Document
              </Text>
              <Text className="text-sm text-ink/55">JPG, PNG or PDF</Text>
            </TouchableOpacity>
          </View>
          <AppButton title="Continue" variant="ink" onPress={() => setCurrentStep(4)} />
        </View>
      )}

      {/* Step 4: Bank Account */}
      {currentStep === 4 && (
        <View className="gap-4">
          <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-6 gap-4">
            <Text className="text-lg font-bold text-ink">Bank Account</Text>
            <View>
              <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55 mb-2">
                Bank Name
              </Text>
              <TextInput
                value={formData.bankName}
                onChangeText={(val) =>
                  setFormData({ ...formData, bankName: val })
                }
                placeholder="e.g. GTBank, Access Bank"
                placeholderTextColor="#9CA3AF"
                className="w-full h-14 px-4 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] text-ink"
              />
            </View>
            <View>
              <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55 mb-2">
                Account Number
              </Text>
              <TextInput
                value={formData.accountNumber}
                onChangeText={(val) =>
                  setFormData({ ...formData, accountNumber: val })
                }
                placeholder="10-digit account number"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={10}
                className="w-full h-14 px-4 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] text-ink"
              />
            </View>
            <View>
              <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55 mb-2">
                Account Name
              </Text>
              <TextInput
                value={formData.accountName}
                onChangeText={(val) =>
                  setFormData({ ...formData, accountName: val })
                }
                placeholder="Name on bank account"
                placeholderTextColor="#9CA3AF"
                className="w-full h-14 px-4 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] text-ink"
              />
            </View>
          </View>
          <AppButton title="Submit for Verification" variant="ink" onPress={handleSubmit} />
        </View>
      )}
    </ScrollView>
  );
}
