import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { solidCard, buttonStyles } from '@/styles/cardStyles';

const purchases = [
  {
    id: '1',
    title: 'Premium Membership - Monthly',
    date: 'July 1, 2025',
    price: '$9.99',
    status: 'Completed',
  },
  {
    id: '2',
    title: 'Nutrition Plan: Beginner',
    date: 'June 15, 2025',
    price: '$4.99',
    status: 'Completed',
  },
  {
    id: '3',
    title: 'Workout Pack: HIIT Boost',
    date: 'May 30, 2025',
    price: '$6.99',
    status: 'Refunded',
  },
];

const PurchaseHistory = () => {
  const router = useRouter();

  const GradientHeader = () => {
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
          <Text className="text-white font-bold text-3xl mb-6">Purchase History</Text>
        </View>
      </View>
    );
  };

  const renderPurchaseItem = (item: typeof purchases[0]) => (
    <View key={item.id} className="w-full bg-[#23232a] rounded-2xl px-5 py-4 mb-4 shadow-md">
      <Text className="text-white text-lg font-semibold">{item.title}</Text>
      <Text className="text-[#b1c7c4] mt-1">Date: {item.date}</Text>
      <Text className="text-[#b1c7c4]">Price: {item.price}</Text>
      <Text className={`mt-1 font-semibold ${item.status === 'Refunded' ? 'text-red-400' : 'text-green-400'}`}>
        Status: {item.status}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#101827]">
      <ScrollView className="flex-1">
        <GradientHeader />
        <View className="flex-1 items-center justify-center py-6">
          <View style={solidCard.card} className="w-[90%] py-6 px-4">
            <Text className="text-white font-semibold text-xl mb-4 text-center">Your Recent Purchases</Text>
            {purchases.map(renderPurchaseItem)}
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

export default PurchaseHistory;
