import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getGeminiResponseWithFallback } from '../services/api_gemini';
import { SettingsStyles } from '@/styles/cardStyles';
import { icons } from '@/constants/icons';

export interface CalorieResult {
  food: string;
  calories: number;
  nutrients?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

interface CameraProps {
  onResult?: (result: CalorieResult) => void;
  onClose?: () => void;
}

const Camera = ({ onResult, onClose }: CameraProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [calorieResult, setCalorieResult] = useState<CalorieResult | null>(null);

  // Deschide camera automat la montare
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisiuni necesare', 'Aveți nevoie de permisiuni pentru a accesa camera.');
        if (onClose) onClose();
        return;
      }
      try {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
        if (result.canceled || !result.assets[0]) {
          if (onClose) onClose();
          return;
        }
        setImage(result.assets[0].uri);
      } catch (error) {
        Alert.alert('Eroare', 'Nu s-a putut deschide camera.');
        if (onClose) onClose();
      }
    })();
  }, []);

  // Analizează automat când există imagine
  useEffect(() => {
    if (!image) return;
    (async () => {
      setIsLoading(true);
      setCalorieResult(null);
      try {
        const response = await fetch(image);
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        const prompt = `Analizează această imagine de mâncare și identifică:\n1. Ce mâncare este în imagine\n2. Caloriile aproximative (kcal)\n3. Nutrienții principali (proteine, carbohidrați, grăsimi în grame)\n\nRăspunde în format JSON:\n{\n  "food": "numele mâncării",\n  "calories": numărul_de_calorii,\n  "nutrients": {\n    "protein": proteine_grame,\n    "carbs": carbohidrați_grame,\n    "fat": grăsimi_grame\n  }\n}`;
        const result = await getGeminiResponseWithFallback(base64, prompt);
        let cleanResult = result.trim();
        const jsonStart = cleanResult.indexOf('{');
        const jsonEnd = cleanResult.lastIndexOf('}') + 1;
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          cleanResult = cleanResult.substring(jsonStart, jsonEnd);
        }
        const parsedResult = JSON.parse(cleanResult);
        if (parsedResult.food && typeof parsedResult.calories === 'number') {
          setCalorieResult(parsedResult);
          if (onResult) onResult(parsedResult);
        } else {
          throw new Error('Invalid result structure');
        }
      } catch (error) {
        let msg = '';
        if (error instanceof Error) msg = error.message;
        else if (typeof error === 'string') msg = error;
        else msg = JSON.stringify(error);
        Alert.alert('Eroare', 'Nu s-a putut analiza imaginea.\n' + msg);
        if (onClose) onClose();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [image]);

  // UI minimalist: doar loading sau nimic
  return (
    <View className="flex-1 justify-center items-center bg-black">
      {isLoading && (
        <>
          <ActivityIndicator size="large" color="#a78bfa" />
          <Text className="text-gray-300 mt-4 text-center">Se analizează imaginea...</Text>
        </>
      )}
    </View>
  );
};

export default Camera;