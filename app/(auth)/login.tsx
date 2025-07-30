import { View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth } from "@/firebaseConfig"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { images } from '@/constants/images';
import { buttonStyles, chatCardStyles, solidCard } from "@/styles/cardStyles"
import { router } from 'expo-router';
import { cardStyles } from "@/styles/cardStyles"
import { inputStyles } from "@/styles/cardStyles"
import AsyncStorage from '@react-native-async-storage/async-storage'

const LOGIN_TIMESTAMP_KEY = 'login_last_time';
const TEN_MINUTES_MS = 10 * 60 * 1000;

const login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const checkLoginTime = async () => {
            try {
                const lastLogin = await AsyncStorage.getItem(LOGIN_TIMESTAMP_KEY);
                const now = Date.now();
                if (lastLogin && now - parseInt(lastLogin, 10) < TEN_MINUTES_MS) {
                    router.replace("/(tabs)");
                }
            } catch (e) {
                // În caz de eroare, continuăm cu login-ul
            }
        };
        //checkLoginTime();
    }, []);

    const handleLogin = async () => {
        try{
            await signInWithEmailAndPassword(auth, email, password);
            await AsyncStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
            router.replace("/(tabs)");
        }catch(error){
            alert("Login failed");
        }
    }

  return (
    <ImageBackground source={images.bgOnboarding} className="flex-1">
    <View className="flex-1 items-center justify-center">
      <Text className="text-white font-bold text-3xl">Login</Text>
      <View style={solidCard.card_transparent} className="w-[90%] items-center mt-10 mb-3 py-8">
        <TextInput style={inputStyles.input} placeholder="Email" placeholderTextColor='#b1c7c4' value={email} onChangeText={setEmail} className="text-white w-[90%] h-17 py-2 mb-4 pl-3"/>
        <TextInput style={inputStyles.input} placeholder="Password" placeholderTextColor='#b1c7c4' value={password} onChangeText={setPassword} className="text-white w-[90%] h-17 py-2 pl-3" secureTextEntry/>
      </View>
      <TouchableOpacity className="w-[50%] mt-4" style={buttonStyles.button} onPress={handleLogin}>
        <Text className="text-white font-bold text-base">Login</Text>
      </TouchableOpacity>
      <Text className="text-gray-300 font-bold my-3">or</Text>
      <TouchableOpacity className="w-[50%]" style={buttonStyles.button} onPress={() => { router.push("/(auth)/signUp") }}>
        <Text className="text-white font-bold text-base">SignUp</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  )
}

export default login