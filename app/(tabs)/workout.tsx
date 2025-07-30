import { View, Text, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CardioCard from '@/components/CardioCard'
import GymCard from '@/components/GymCard'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { gymWorkouts } from '@/constants/gymWorkouts'
import { calistehnics } from '@/constants/calistehnics'
import { useRouter } from 'expo-router'
import { button2Styles, buttonStyles, solidCard } from '@/styles/cardStyles'
import { LinearGradient } from 'expo-linear-gradient'

function GradientHeaderWorkout() {
  return (
    <View style={{ position: 'relative', width: '100%', height: 140 }}>
      <LinearGradient
        colors={['#0f2027', '#203a43', '#2c5364']}
        locations={[0, 0.7, 1]} // griurile ocupă 70%, verdele doar ultimul 30%
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
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 40 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Workout</Text>
          <Text style={{ color: 'white', fontSize: 14, opacity: 0.8 }}>Concentrează-te pe ce vrei azi</Text>
        </View>
      </View>
    </View>
  );
}

const workout = () => {
  const router = useRouter()

  return (
    <View className='flex-1 bg-gray-900'>
      <ScrollView>
        <GradientHeaderWorkout />
        <View className='mt-10 mx-10'>
          <Text className="text-white text-2xl font-bold">Cardio / Outdoor options</Text>
        </View>
        <View className='flex-row justify-between mx-16 mt-8 h-22'>
          <CardioCard title="Walking" icon={icons.walking} onPress={() => router.push({ pathname: '/cardio/[type]', params: { type: 'walking' } })} />
          <CardioCard title="Running" icon={icons.running} onPress={() => router.push({ pathname: '/cardio/[type]', params: { type: 'running' } })} />
          <CardioCard title="Cycling" icon={icons.cycling} onPress={() => router.push({ pathname: '/cardio/[type]', params: { type: 'cycling' } })} />
        </View>
        <View className='w-[90%] h-40 justify-center mt-10 self-center'>
          <ImageBackground source={images.gymBg} style={{ flex: 1, width: '100%', height: '100%', borderRadius: 14, overflow: 'hidden', justifyContent: 'flex-start' }} imageStyle={{ borderRadius: 14, resizeMode: 'cover', opacity: 0.7 }}>
            <View style={[solidCard.card_transparent, { backgroundColor: 'rgba(31, 41, 55, 0.54)', flex: 1, width: '100%', height: '100%', justifyContent: 'flex-start' }]}>
              <Text className="text-white text-2xl font-bold self-start m-5">Gym Workouts</Text>
              <TouchableOpacity style={button2Styles.button} className="w-[50%] py-2 self-end mt-5 mr-3"
                onPress={() => router.push('/gym/all-gym-workouts')}>
                <Text className="text-white text-center text-base font-semibold">See all workouts</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        <View className='w-[90%] h-40 justify-center mt-10 self-center'>
          <ImageBackground source={images.gymBg2} style={{ flex: 1, width: '100%', height: '100%', borderRadius: 14, overflow: 'hidden', justifyContent: 'flex-start' }} imageStyle={{ borderRadius: 14, resizeMode: 'cover', opacity: 0.7 }}>
            <View style={[solidCard.card_transparent, { backgroundColor: 'rgba(31, 41, 55, 0.54)', flex: 1, width: '100%', height: '100%', justifyContent: 'flex-start' }]}>
              <Text className="text-white text-2xl font-bold self-start m-5">Weekly Gym Plan</Text>
              <TouchableOpacity style={button2Styles.button} className="w-[50%] py-2 self-end mt-5 mr-3"
                onPress={() => router.push('/gym/weekly-gym-plan')}>
                <Text className="text-white text-center text-base font-semibold">See the plan</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>
    </View>
  )
}

export default workout