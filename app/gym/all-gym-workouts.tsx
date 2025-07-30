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
import { calvesWorkouts } from '@/constants/calvesWorkouts'
import { glutesWorkouts } from '@/constants/glutesWorkouts'
import { forearmsWorkouts } from '@/constants/forearmsWorkouts'
import { adductorsWorkouts } from '@/constants/adductorsWorkouts'
import { abductorsWorkouts } from '@/constants/abductorsWorkouts'
import { useRouter } from 'expo-router'

const AllGymWorkouts = () => {
  const router = useRouter();
  const categories = [
    { title: 'Biceps', image: bicepsWorkouts[bicepsWorkouts.length-1].image },
    { title: 'Triceps', image: tricepsWorkouts[tricepsWorkouts.length-1].image },
    { title: 'Chest', image: chestWorkouts[chestWorkouts.length-1].image },
    { title: 'Abs', image: absWorkouts[absWorkouts.length-1].image },
    { title: 'Shoulders', image: shouldersWorkouts[shouldersWorkouts.length-1].image },
    { title: 'Upper Back', image: upperBackWorkouts[12].image },
    { title: 'Quads', image: quadsWorkouts[quadsWorkouts.length-1].image },
    { title: 'Hamstrings', image: hamstringsWorkouts[hamstringsWorkouts.length-1].image },
    { title: 'Calves', image: calvesWorkouts[calvesWorkouts.length-1].image },
    { title: 'Glutes', image: glutesWorkouts[glutesWorkouts.length-1].image },
    { title: 'Forearms', image: forearmsWorkouts[forearmsWorkouts.length-1].image },
    { title: 'Adductors', image: adductorsWorkouts[adductorsWorkouts.length-1].image },
    { title: 'Abductors', image: abductorsWorkouts[abductorsWorkouts.length-1].image },
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
        <Text className="text-white text-3xl font-bold mt-16 mb-5 text-center">All muscle groups</Text>
        <View className="h-px bg-white/10 shadow-sm shadow-green-500/20 mx-4 mb-4" />
        <View className="flex flex-wrap flex-row justify-center">
          {categories.map((cat, idx) => (
            <View key={idx} className="m-2 min-w-[110px] w-32 h-32">
              <TouchableOpacity onPress={() => router.push({ pathname: '/gym/[category]', params: { category: cat.title } })}>
                <GymCard title={cat.title} image={cat.image} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default AllGymWorkouts 