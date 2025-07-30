import { View, Text, ScrollView, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import GymDetailsCard from '@/components/GymDetailsCard';
import { bicepsWorkouts } from '@/constants/bicepsWorkouts';
import { tricepsWorkouts } from '@/constants/tricepsWorkouts';
import { chestWorkouts } from '@/constants/chestWorkouts';
import { absWorkouts } from '@/constants/absWorkouts';
import { shouldersWorkouts } from '@/constants/shouldersWorkouts';
import { upperBackWorkouts } from '@/constants/upperBackWorkouts';
import { quadsWorkouts } from '@/constants/quadsWorkouts';
import { hamstringsWorkouts } from '@/constants/hamstringsWorkouts';
import { calvesWorkouts } from '@/constants/calvesWorkouts';
import { glutesWorkouts } from '@/constants/glutesWorkouts';
import { forearmsWorkouts } from '@/constants/forearmsWorkouts';
import { adductorsWorkouts } from '@/constants/adductorsWorkouts';
import { abductorsWorkouts } from '@/constants/abductorsWorkouts';
import { buttonStyles } from '@/styles/cardStyles';

const workoutMap: Record<string, any[]> = {
  Biceps: bicepsWorkouts,
  Triceps: tricepsWorkouts,
  Chest: chestWorkouts,
  Abs: absWorkouts,
  Shoulders: shouldersWorkouts,
  'Upper Back': upperBackWorkouts,
  Quads: quadsWorkouts,
  Hamstrings: hamstringsWorkouts,
  Calves: calvesWorkouts,
  Glutes: glutesWorkouts,
  Forearms: forearmsWorkouts,
  Adductors: adductorsWorkouts,
  Abductors: abductorsWorkouts,
};

const { width } = Dimensions.get('window');

const CategoryPage = () => {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const categoryName = Array.isArray(category) ? category[0] : category;
  const workouts = workoutMap[categoryName] || [];
  // Exclude last workout (the 'aaaaa' image)
  const filteredWorkouts = workouts.slice(0, -1);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  const openModal = (workout: any) => {
    setSelectedWorkout(workout);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedWorkout(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: 'absolute', top: 10, right: 20, zIndex: 10 }}>
        <TouchableOpacity onPress={() => router.dismiss()}>
          <Text style={{ color: 'white', fontSize: 35, fontWeight: 'bold' }}>×</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className='bg-[#101827]'>
        <Text className="text-white text-3xl font-bold mt-16 mb-5 text-center">{categoryName} Workouts</Text>
        <View className="h-px bg-white/10 shadow-sm shadow-green-500/20 mx-4 mb-4" />
        <View className="flex flex-wrap flex-row justify-center">
          {filteredWorkouts.map((workout, idx) => (
            <View key={idx} className="m-4 w-[40%] h-[180px] top-0">
              <TouchableOpacity onPress={() => openModal(workout)}>
                <GymDetailsCard title={workout.title} image={workout.image} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' }}>
          {selectedWorkout && (
            <View style={{ width: width * 0.9, backgroundColor: '#1F2937', borderRadius: 20, padding: 20, alignItems: 'center' }}>
              <Image
                source={selectedWorkout.image}
                style={{ width: '100%', height: 260, borderRadius: 16, marginBottom: 20 }}
                resizeMode="cover"
              />
              <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>{selectedWorkout.title}</Text>
              <Text style={{ color: 'white', fontSize: 16, marginBottom: 30, textAlign: 'center' }}>{selectedWorkout.description}</Text>
              <TouchableOpacity
                onPress={closeModal}
                style={buttonStyles.button}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Inchide</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default CategoryPage; 