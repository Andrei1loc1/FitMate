import { View, Text, Image } from 'react-native'
import React from 'react'
import { solidCard } from '../styles/cardStyles'

// Accept both icon and image, prefer image if both are provided
const GymCard = ({title, icon, image}: {title: string, icon?: any, image?: any}) => {
  return (
    <View style={solidCard.gym_card} className='h-full rounded-3xl items-center justify-center'>
        <Image source={image || icon} style={{ width: '100%', height: '70%', marginBottom: 8 }} />
        <Text className="text-white text-base font-bold mb-2">{title}</Text>
    </View>
  )
}

export default GymCard