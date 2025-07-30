import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { solidCard, inputStyles, buttonStyles } from '@/styles/cardStyles';
import { useRouter } from 'expo-router';

const HelpSupport = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const GradientHeaderHelp = () => {
    return (
      <View style={{ position: 'relative', width: '100%', height: 140 }}>
        <LinearGradient
          colors={['#0f2027', '#203a43', '#2c5364']}
          locations={[0, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            width: '100%',
            height: 140,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        />
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60 }}>
          <Text className="text-white font-bold text-3xl mb-6">Help & Support</Text>
        </View>
      </View>
    );
  };

  const handleSendSupport = () => {
    if (!message.trim()) {
      Alert.alert('Empty Message', 'Please type your question or issue.');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Message Sent', 'Our support team will get back to you shortly.');
      setMessage('');
    }, 1500);
  };

  return (
    <View className="flex-1 bg-[#101827]">
      <ScrollView className="flex-1">
        <GradientHeaderHelp />
        <View className="flex-1 items-center justify-center py-6">
          <View style={solidCard.card} className="w-[90%] py-8 px-4">
            <Text className="text-white font-semibold text-xl mb-4 text-center">Frequently Asked Questions</Text>
            <Text className="text-[#b1c7c4] mb-4">
              - How do I reset my password?{'\n\n'}
              - How do I change my email?{'\n\n'}
              - Where can I see my progress?{'\n\n'}
              - How can I cancel my subscription?
            </Text>
          </View>

          <View style={solidCard.card} className="w-[90%] py-8 px-4 mt-6">
            <Text className="text-white font-semibold text-xl mb-4 text-center">Contact Support</Text>
            <TextInput
              style={[inputStyles.input, { height: 120, textAlignVertical: 'top' }]}
              placeholder="Type your message here..."
              placeholderTextColor="#b1c7c4"
              value={message}
              onChangeText={setMessage}
              multiline
              className="text-white w-full py-2 mb-4"
            />
            <TouchableOpacity
              className="w-[60%] h-12 self-center"
              style={buttonStyles.button}
              onPress={handleSendSupport}
              disabled={loading}
            >
              <Text className="text-white font-bold text-base">
                {loading ? 'Sending...' : 'Send Message'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="w-[60%] h-12 mt-6"
            style={buttonStyles.button}
            onPress={() => router.back()}
          >
            <Text className="text-white font-bold text-base">Back to Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpSupport;
