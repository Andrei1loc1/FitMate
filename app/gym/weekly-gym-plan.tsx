import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import GymCard from '@/components/GymCard'
import { bicepsWorkouts } from '@/constants/bicepsWorkouts'
import { tricepsWorkouts } from '@/constants/tricepsWorkouts'
import { chestWorkouts } from '@/constants/chestWorkouts'
import { absWorkouts } from '@/constants/absWorkouts'
import { shouldersWorkouts } from '@/constants/shouldersWorkouts'
import { upperBackWorkouts } from '@/constants/upperBackWorkouts'
import { quadsWorkouts } from '@/constants/quadsWorkouts'
import { hamstringsWorkouts } from '@/constants/hamstringsWorkouts'
import { useRouter } from 'expo-router'

const WeeklyGymPlan = () => {
  const router = useRouter();
  
  const weeklyPlan = [
    { 
      day: 'Monday',
      focus: 'Push Day',
      exercises: [
        { title: 'Chest', image: chestWorkouts[0].image },
        { title: 'Shoulders', image: shouldersWorkouts[0].image },
        { title: 'Triceps', image: tricepsWorkouts[0].image }
      ]
    },
    {
      day: 'Tuesday',
      focus: 'Pull Day',
      exercises: [
        { title: 'Upper Back', image: upperBackWorkouts[0].image },
        { title: 'Biceps', image: bicepsWorkouts[0].image }
      ]
    },
    {
      day: 'Wednesday',
      focus: 'Legs & Core',
      exercises: [
        { title: 'Quads', image: quadsWorkouts[0].image },
        { title: 'Hamstrings', image: hamstringsWorkouts[0].image },
        { title: 'Abs', image: absWorkouts[0].image }
      ]
    },
    {
      day: 'Thursday',
      focus: 'Push Day',
      exercises: [
        { title: 'Chest', image: chestWorkouts[1].image },
        { title: 'Shoulders', image: shouldersWorkouts[1].image },
        { title: 'Triceps', image: tricepsWorkouts[1].image }
      ]
    },
    {
      day: 'Friday',
      focus: 'Pull Day',
      exercises: [
        { title: 'Upper Back', image: upperBackWorkouts[1].image },
        { title: 'Biceps', image: bicepsWorkouts[1].image }
      ]
    },
    {
      day: 'Saturday',
      focus: 'Legs & Core',
      exercises: [
        { title: 'Quads', image: quadsWorkouts[1].image },
        { title: 'Hamstrings', image: hamstringsWorkouts[1].image },
        { title: 'Abs', image: absWorkouts[1].image }
      ]
    },
    {
      day: 'Sunday',
      focus: 'Rest Day',
      exercises: []
    }
  ]

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <TouchableOpacity 
          onPress={() => router.dismiss()}
          className="w-8 h-8 bg-gray-700 rounded-full justify-center items-center"
        >
          <Text className="text-white text-lg font-bold">×</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className='bg-[#101827]'>
        <Text className="text-white text-3xl font-bold mt-16 mb-5 text-center">Weekly Gym Plan</Text>
        <View className="h-px bg-white/10 shadow-sm shadow-green-500/20 mx-4 mb-4" />
        
        {weeklyPlan.map((day, dayIdx) => (
          <View key={dayIdx} className=" mb-6">
            <Text className="text-white text-xl font-bold mb-2 mx-2">{day.day} - {day.focus}</Text>
            {day.exercises.length > 0 ? (
              <View className="flex flex-row flex-wrap">
                {day.exercises.map((exercise, idx) => (
                  <View key={idx} className="m-2 min-w-[110px] w-32 h-32">
                    <TouchableOpacity onPress={() => router.push({ pathname: '/gym/[category]', params: { category: exercise.title } })}>
                      <GymCard title={exercise.title} image={exercise.image} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View className="bg-white/5 rounded-lg p-4 mx-4 mb-10">
                <Text className="text-white/60 text-center">Recovery day - Take it easy!</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default WeeklyGymPlan
