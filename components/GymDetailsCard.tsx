import { View, Text, Image } from 'react-native'
import React from 'react'
import { solidCard } from '../styles/cardStyles'

// Accept both icon and image, prefer image if both are provided
const GymDetailsCard = ({title, icon, image}: {title: string, icon?: any, image?: any}) => {
  return (
    <View style={solidCard.gym_card} className='h-full rounded-3xl items-start justify-start'>
        <Image source={image || icon} style={{ width: '100%', height: 120, borderTopLeftRadius: 14, borderTopRightRadius: 14 }} resizeMode='cover'/>
        <Text className="text-white text-xs font-bold mt-3 mb-2 text-center">{title}</Text>
    </View>
  )
}

export default GymDetailsCard