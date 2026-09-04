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
import { CheckCircle, Upload } from "lucide-react-native";

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
    <ScrollView className="flex-1 bg-white px-5 pt-8 pb-6">
      <Text className="text-2xl font-bold mb-2">Verify Your Account</Text>
      <Text className="text-gray-500 mb-8">
        Complete verification to start receiving orders.
      </Text>

      {/* Steps */}
      <View className="gap-4 mb-8">
        {steps.map((step) => (
          <View key={step.id} className="flex-row items-center gap-3">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                step.completed
                  ? "bg-green-500"
                  : currentStep === step.id
                  ? "bg-blue-900"
                  : "bg-gray-200"
              }`}
            >
              {step.completed ? (
                <CheckCircle color="#FFFFFF" size={18} />
              ) : (
                <Text
                  className={`text-sm font-bold ${
                    currentStep === step.id ? "text-white" : "text-gray-500"
                  }`}
                >
                  {step.id}
                </Text>
              )}
            </View>
            <Text
              className={`text-sm font-medium ${
                step.completed ? "text-green-600" : "text-gray-900"
              }`}
            >
              {step.title}
            </Text>
          </View>
        ))}
      </View>

      {/* Step 3: ID Verification */}
      {currentStep === 3 && (
        <View className="gap-4">
          <Text className="text-lg font-bold">ID Verification</Text>
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              ID Type
            </Text>
            <View className="flex-row gap-2">
              {["nin", "passport", "drivers_license"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFormData({ ...formData, idType: type })}
                  className={`flex-1 py-3 rounded-xl items-center ${
                    formData.idType === type
                      ? "bg-blue-900"
                      : "bg-gray-100 border border-gray-200"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium capitalize ${
                      formData.idType === type ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {type.replace("_", " ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              ID Number
            </Text>
            <TextInput
              value={formData.idNumber}
              onChangeText={(val) =>
                setFormData({ ...formData, idNumber: val })
              }
              placeholder="Enter your ID number"
              placeholderTextColor="#9CA3AF"
              className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white"
            />
          </View>
          <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-2xl p-8 items-center">
            <Upload color="#000080" size={32} />
            <Text className="font-semibold text-gray-900 mt-2">
              Upload ID Document
            </Text>
            <Text className="text-sm text-gray-500">JPG, PNG or PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentStep(4)}
            className="w-full h-12 bg-blue-900 rounded-xl items-center justify-center mt-4"
          >
            <Text className="text-white font-semibold">Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 4: Bank Account */}
      {currentStep === 4 && (
        <View className="gap-4">
          <Text className="text-lg font-bold">Bank Account</Text>
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Bank Name
            </Text>
            <TextInput
              value={formData.bankName}
              onChangeText={(val) =>
                setFormData({ ...formData, bankName: val })
              }
              placeholder="e.g. GTBank, Access Bank"
              placeholderTextColor="#9CA3AF"
              className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white"
            />
          </View>
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
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
              className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white"
            />
          </View>
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Account Name
            </Text>
            <TextInput
              value={formData.accountName}
              onChangeText={(val) =>
                setFormData({ ...formData, accountName: val })
              }
              placeholder="Name on bank account"
              placeholderTextColor="#9CA3AF"
              className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white"
            />
          </View>
          <TouchableOpacity
            onPress={handleSubmit}
            className="w-full h-12 bg-blue-900 rounded-xl items-center justify-center mt-4"
          >
            <Text className="text-white font-semibold">
              Submit for Verification
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
