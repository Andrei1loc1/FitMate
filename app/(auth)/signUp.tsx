import { View, Text, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/firebaseConfig'
import { images } from '@/constants/images'
import { buttonStyles } from "@/styles/cardStyles"
import { solidCard } from "@/styles/cardStyles"
import { inputStyles } from "@/styles/cardStyles"
import { router } from 'expo-router';


const signUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignUp = async () => {
        if(password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if(!name.trim()) {
            alert("Please enter your name");
            return;
        }
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Update user profile with name
            await updateProfile(user, {
                displayName: name
            });
            
            alert("SignUp successful");
            router.replace("/(tabs)");
        }catch(error){
            alert("SignUp failed");
        }
    }

  return (
    <ImageBackground source={images.bgOnboarding} className="flex-1">
        <KeyboardAvoidingView 
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 items-center justify-center">
                    <Text className="text-white font-bold text-3xl">Sign Up</Text>
                    <View style={solidCard.card_transparent} className="w-[90%] items-center mt-10 mb-3 py-8">
                        <TextInput style={inputStyles.input} placeholder="Name" placeholderTextColor='#b1c7c4' value={name} onChangeText={setName} className="text-white w-[90%] h-17 py-2 mb-4"/>
                        <TextInput style={inputStyles.input} placeholder="Email" placeholderTextColor='#b1c7c4' value={email} onChangeText={setEmail} className="text-white w-[90%] h-17 py-2 mb-4"/>
                        <TextInput style={inputStyles.input} placeholder="Password" placeholderTextColor='#b1c7c4' value={password} onChangeText={setPassword} className="text-white w-[90%] h-17 py-2 mb-4" secureTextEntry/>
                        <TextInput style={inputStyles.input} placeholder="Confirm Password" placeholderTextColor='#b1c7c4' value={confirmPassword} onChangeText={setConfirmPassword} className="text-white w-[90%] h-17 py-2" secureTextEntry/>
                    </View>
                    <TouchableOpacity className="w-[50%] mt-4" style={buttonStyles.button} onPress={handleSignUp}>
                        <Text className="text-white font-bold text-base">Create Account</Text>
                    </TouchableOpacity>
                    <Text className="text-gray-300 font-bold my-3">or</Text>
                    <TouchableOpacity className="w-[50%]" style={buttonStyles.button} onPress={() => { router.push("/(auth)/login") }}>
                        <Text className="text-white font-bold text-base">Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </ImageBackground>
  )
}

export default signUp