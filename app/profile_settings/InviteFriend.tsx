import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Share, Clipboard } from 'react-native';
import React, { useState } from 'react';
import { SettingsStyles, inputStyles, solidCard, buttonStyles } from '@/styles/cardStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const InviteFriend = () => {
  const [friendEmail, setFriendEmail] = useState('');
  const [referralCode] = useState('FIT-2025-XYZ'); // example code
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const GradientHeaderInvite = () => {
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
          <Text className="text-white font-bold text-3xl mb-6">Invite a Friend</Text>
        </View>
      </View>
    );
  };

  const handleInvite = async () => {
    if (!friendEmail.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    // Simulate API send
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Invitation Sent', `An invite has been sent to ${friendEmail}`);
      setFriendEmail('');
    }, 1500);
  };

  const handleShareReferral = async () => {
    try {
      await Share.share({
        message: `Join me on FitApp! Use my referral code ${referralCode} to sign up.`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the referral code.');
    }
  };

  const handleCopyReferral = () => {
    Clipboard.setString(referralCode);
    Alert.alert('Copied!', 'Referral code copied to clipboard.');
  };

  return (
    <View className="flex-1 bg-[#101827]">
      <ScrollView className="flex-1">
        <GradientHeaderInvite />
        <View className="flex-1 items-center justify-center py-6">
          <View style={solidCard.card} className="w-[90%] items-center py-8 px-4">
            <Text className="text-white font-semibold text-xl mb-6">Invite via Email</Text>
            <TextInput
              style={inputStyles.input}
              placeholder="Enter friend's email"
              placeholderTextColor="#b1c7c4"
              value={friendEmail}
              onChangeText={setFriendEmail}
              keyboardType="email-address"
              className="text-white w-full h-12 py-2 mb-4"
            />
            <TouchableOpacity
              className="w-[60%] h-12 mb-4"
              style={buttonStyles.button}
              onPress={handleInvite}
              disabled={loading}
            >
              <Text className="text-white font-bold text-base">
                {loading ? 'Sending...' : 'Send Invite'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={solidCard.card} className="w-[90%] items-center py-8 px-4 mt-6">
            <Text className="text-white font-semibold text-xl mb-4">Or Share Your Code</Text>
            <Text className="text-[#b1c7c4] mb-6 text-center">
              Share your unique referral code with friends and earn rewards!
            </Text>
            <View className="w-full bg-[#23232a] rounded-xl p-4 mb-4">
              <Text className="text-white text-center text-xl font-bold">{referralCode}</Text>
            </View>
            <TouchableOpacity
              className="w-[60%] h-12 mb-3"
              style={buttonStyles.button}
              onPress={handleShareReferral}
            >
              <Text className="text-white font-bold text-base">Share Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-[60%] h-12"
              style={buttonStyles.button}
              onPress={handleCopyReferral}
            >
              <Text className="text-white font-bold text-base">Copy Code</Text>
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

export default InviteFriend;
