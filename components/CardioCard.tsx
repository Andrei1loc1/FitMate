import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent, Image } from 'react-native';
import { cardStyles } from '../styles/cardStyles';

interface CardioCardProps {
  title: string;
  icon: any;
  onPress?: (event: GestureResponderEvent) => void;
}

const CardioCard = ({ title, icon, onPress }: CardioCardProps) => {
  return (
    <TouchableOpacity style={cardStyles.card} onPress={onPress}>
      <Image source={icon} style={{ width: 25, height: 25, marginBottom: 8, tintColor: 'white' }} />
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
});

export default CardioCard;