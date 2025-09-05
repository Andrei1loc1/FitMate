import { View, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { images } from '@/constants/images'
import { buttonStyles } from "@/styles/cardStyles"
import { cardStyles } from "@/styles/cardStyles"
import { inputStyles } from "@/styles/cardStyles"
import { router } from 'expo-router';
import { mealService } from '@/services/appwrite';
import { auth } from '@/firebaseConfig';
import Camera, { CalorieResult } from '@/components/Camera';
import { useLocalSearchParams } from 'expo-router';
import { solidCard } from '@/styles/cardStyles';

function getParamString(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
}

const AddMeal = () => {
    const params = useLocalSearchParams();
    const [showCamera, setShowCamera] = useState(params.camera === '1');
    const [mealName, setMealName] = useState(getParamString(params.mealName));
    const [calories, setCalories] = useState(getParamString(params.calories));
    const [protein, setProtein] = useState(getParamString(params.protein));
    const [carbs, setCarbs] = useState(getParamString(params.carbs));
    const [fat, setFat] = useState(getParamString(params.fat));
    const [mealType, setMealType] = useState("breakfast"); // breakfast, lunch, dinner, snack

    const handleAddMeal = async () => {
        if (!mealName.trim()) {
            Alert.alert("Error", "Please enter a meal name");
            return;
        }
        if (!calories.trim()) {
            Alert.alert("Error", "Please enter calories");
            return;
        }

        // Validate that all numeric fields are valid integers
        const caloriesInt = Math.round(Number(calories)) || 0;
        const proteinInt = Math.round(Number(protein)) || 0;
        const carbsInt = Math.round(Number(carbs)) || 0;
        const fatInt = Math.round(Number(fat)) || 0;

        if (isNaN(caloriesInt) || isNaN(proteinInt) || isNaN(carbsInt) || isNaN(fatInt)) {
            Alert.alert("Error", "All nutritional values must be valid numbers");
            return;
        }

        try {
            // Get current Firebase user ID
            const currentUser = auth.currentUser;
            if (!currentUser) {
                Alert.alert("Error", "You must be logged in to add meals");
                return;
            }
            
            await mealService.createMeal({
                mealName: mealName.trim(),
                mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
                calories: caloriesInt,
                protein: proteinInt,
                carbs: carbsInt,
                fat: fatInt,
                userID: currentUser.uid
            });

            // Navigate back to meals page after successful save
            router.back();
        } catch (error) {
            console.error('Error saving meal:', error);
            Alert.alert("Error", "Failed to save meal. Please try again.");
        }
    }

    const mealTypes = [
        { key: "breakfast", label: "Breakfast" },
        { key: "lunch", label: "Lunch" },
        { key: "dinner", label: "Dinner" },
        { key: "snack", label: "Snack" }
    ];

    return (
        <View className="flex-1 bg-[#101827]">
            {showCamera ? (
                <Camera
                  onResult={(result: CalorieResult) => {
                    setShowCamera(false);
                    setMealName(result.food || "");
                    setCalories(result.calories?.toString() || "");
                    setProtein(result.nutrients?.protein?.toString() || "");
                    setCarbs(result.nutrients?.carbs?.toString() || "");
                    setFat(result.nutrients?.fat?.toString() || "");
                  }}
                  onClose={() => setShowCamera(false)}
                />
            ) : (
                <KeyboardAvoidingView 
                    className="flex-1"
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <ScrollView 
                        className="flex-1"
                        contentContainerStyle={{ 
                            paddingBottom: 120,
                            flexGrow: 1
                        }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="flex-1 items-center justify-center py-10">
                            <Text className="text-white font-bold text-3xl mb-6">Add New Meal</Text>
                            <View style={solidCard.card} className="w-[90%] items-center py-8 px-4">
                                <Text className="text-white font-semibold text-lg mb-4">Meal Information</Text>
                                <TextInput 
                                    style={inputStyles.input} 
                                    placeholder="Meal Name" 
                                    placeholderTextColor='#b1c7c4' 
                                    value={mealName} 
                                    onChangeText={setMealName} 
                                    className="text-white w-full h-12 py-2 mb-4"
                                />
                                <View className="w-full mb-4">
                                    <Text className="text-white font-medium mb-2">Meal Type</Text>
                                    <View className="flex-row flex-wrap justify-center gap-2">
                                        {mealTypes.map((type) => (
                                            <TouchableOpacity
                                                key={type.key}
                                                style={[
                                                    buttonStyles.button,
                                                    mealType === type.key && { backgroundColor: 'rgba(46, 204, 112, 0.4)' }
                                                ]}
                                                className="px-4 py-2 mx-1"
                                                onPress={() => setMealType(type.key)}
                                            >
                                                <Text className="text-white font-medium text-sm">{type.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                                <Text className="text-white font-semibold text-lg mb-4">Nutritional Information</Text>
                                <View className="w-full space-y-4">
                                    <View>
                                        <Text className="text-white font-medium mb-2">Calories</Text>
                                        <TextInput 
                                            style={inputStyles.input} 
                                            placeholder="Calories" 
                                            placeholderTextColor='#b1c7c4' 
                                            value={calories} 
                                            onChangeText={setCalories} 
                                            className="text-white w-full h-12 py-2"
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View className="flex-row space-x-2">
                                        <View className="flex-1">
                                            <Text className="text-white font-medium mb-2">Protein (g)</Text>
                                            <TextInput 
                                                style={inputStyles.input} 
                                                placeholder="Protein" 
                                                placeholderTextColor='#b1c7c4' 
                                                value={protein} 
                                                onChangeText={setProtein} 
                                                className="text-white w-full h-12 py-2"
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-white font-medium mb-2">Carbs (g)</Text>
                                            <TextInput 
                                                style={inputStyles.input} 
                                                placeholder="Carbs" 
                                                placeholderTextColor='#b1c7c4' 
                                                value={carbs} 
                                                onChangeText={setCarbs} 
                                                className="text-white w-full h-12 py-2"
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <Text className="text-white font-medium mb-2">Fat (g)</Text>
                                        <TextInput 
                                            style={inputStyles.input} 
                                            placeholder="Fat" 
                                            placeholderTextColor='#b1c7c4' 
                                            value={fat} 
                                            onChangeText={setFat} 
                                            className="text-white w-full h-12 py-2"
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                            </View>
                            <View className="w-full items-center mt-6 space-y-3">
                                <TouchableOpacity 
                                    className="w-[60%] h-12 mb-4" 
                                    style={buttonStyles.button} 
                                    onPress={handleAddMeal}
                                >
                                    <Text className="text-white font-bold text-base">Add Meal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    className="w-[60%] h-12" 
                                    style={buttonStyles.button} 
                                    onPress={() => router.back()}
                                >
                                    <Text className="text-white font-bold text-base">Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </View>
    )
}

export default AddMeal 