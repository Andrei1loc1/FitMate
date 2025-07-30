import React from 'react';
import { View, Text, Image } from 'react-native';
import { solidCard } from '@/styles/cardStyles';
import { BlurView } from 'expo-blur';
import { useProgress } from '@/helpers/progress.hook';

interface DashCardProps {
  icon: any;
  titlu: string;
  valoare: number;
  unitate: string;
  obiectiv: number;
  button?: React.ReactNode;
}

const DashCard: React.FC<DashCardProps> = ({ icon, titlu, valoare, unitate, obiectiv, button }) => {
  const progress = useProgress();
  
  const getProgressPercentage = () => {
    return Math.min((valoare / obiectiv) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return '#10B981'; // Green
    if (percentage >= 75) return '#3B82F6'; // Blue
    if (percentage >= 50) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  return (
    <View style={[solidCard.card_transparent, { width: '90%'}]} className="mx-4 mb-5 p-10">
      <View className="flex-row justify-between items-center ">
        {/* Left side - Icon and Title */}
        <View className="flex-row items-center flex-1">
          <Image source={icon} className="w-8 h-8 mr-3" />
          <View>
            <Text className="text-white font-semibold text-lg">{titlu}</Text>
            <Text className="text-gray-400 text-sm">Obiectiv: {obiectiv.toLocaleString()} {unitate}</Text>
          </View>
        </View>

        {/* Right side - Value and Progress */}
        <View className="items-end">
          <Text className="text-white font-bold text-2xl">
            {valoare.toLocaleString()} {unitate}
          </Text>
        </View>
      </View>
      <View className='w-full justify-end items-end'>
        <View style={{ 
            width: 100, 
            height: 8, 
            backgroundColor: '#374151', 
            borderRadius: 4, 
            marginTop: 8,
            overflow: 'hidden'
          }}>
            <View style={{
              width: `${Math.min((valoare / obiectiv) * 100, 100)}%`,
              height: '100%',
              backgroundColor: getProgressColor(getProgressPercentage()),
              borderRadius: 4
            }} />
        </View>
      </View>
      {button && (
        <View className="items-end mt-2">{button}</View>
      )}
    </View>
  );
};

export default DashCard;