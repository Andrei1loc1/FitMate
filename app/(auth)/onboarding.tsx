import { View, Text, TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { images } from '@/constants/images'
import { button2Styles } from '@/styles/cardStyles'
import TextMaskLogo from '@/components/TextMaskLogo'

const onboarding = () => {
  const router = useRouter();

  return (
    <ImageBackground source={images.bgOnboarding} className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-bold text-white">Welcome to <Text className='text-[#58a6ff]'>FitMate</Text></Text>
        <View className="w-full items-center mt-10">
        <TouchableOpacity className="w-[50%]" style={button2Styles.button} onPress={() => { router.replace("/(auth)/login") }}>
          <Text className="text-white font-bold text-xl">Start</Text>
        </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )
}

export default onboarding