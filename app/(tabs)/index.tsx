import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import Step from "../../components/Step";
import DashCard from "../../components/DashCard";
import {icons} from "@/constants/icons"
import StepsStats from "@/components/StepsStats"
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Animated } from 'react-native';
import { COLORS } from '@/constants/colors';
import { auth } from '@/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { waterService } from '@/services/appwrite';
import WeeklySteps from "@/components/WeeklySteps";
import { useProfilePicture } from '@/hooks/useProfilePicture';
import { useBackgroundNotifications } from '@/hooks/useBackgroundNotifications';

function GradientHeader({ profilePic }: { profilePic: any }) {
  return (
    <View style={{ position: 'relative', width: '100%', height: 140 }}>
      <LinearGradient
        colors={[COLORS.DarkBackground, '#203a43', '#2c5364']}
        locations={[0, 0.7, 1]} // griurile ocupă 70%, verdele doar ultimul 30%
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: 'absolute',
          width: '100%',
          height: 140,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      />
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 40 }}>
        
        <View style={{ flex: 1 }}>
          <Text style={{ color: COLORS.White, fontSize: 24, fontWeight: 'bold' }}>Today</Text>
          <Text style={{ color: COLORS.White, fontSize: 14, opacity: 0.8 }}>
            Have a nice day {auth.currentUser?.displayName || "Guest"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Image source={profilePic} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#23232a' }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Index() {
  // State for steps
  const [steps, setSteps] = useState(0);
  // State for water
  const [water, setWater] = useState(0);
  const [firebaseUserID, setFirebaseUserID] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { profilePic } = useProfilePicture();
  const {
    isEnabled,
    permissionsGranted,
    backgroundStatus,
    enableBackgroundNotifications,
    disableBackgroundNotifications,
    sendTestNotification,
    updateStepsNotification,
  } = useBackgroundNotifications();

  // Verifică dacă utilizatorul este autentificat în Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setFirebaseUserID(user.uid);
        setIsLoggedIn(true);
      } else {
        setFirebaseUserID(null);
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadWater = async () => {
      const today = new Date().toISOString().slice(0, 10);
  
      const savedDate = await AsyncStorage.getItem('water_date');
      const savedWater = await AsyncStorage.getItem('water');
  
      if (savedDate === today && savedWater !== null) {
        setWater(parseFloat(savedWater));
        return;
      }
  
      try {
        if (!firebaseUserID) return;
        const dbWater = await waterService.getWaterByDate(firebaseUserID, today);
        if (dbWater) {
          setWater(dbWater.water);
          await AsyncStorage.setItem('water', dbWater.water.toString());
        } else {
          setWater(0);
          await AsyncStorage.setItem('water', '0');
        }
        await AsyncStorage.setItem('water_date', today);
      } catch (e) {
        setWater(0);
      }
    };
  
    if (firebaseUserID && isLoggedIn) {
      loadWater();
    }
  }, [firebaseUserID, isLoggedIn]);


  useEffect(() => {
    if (!firebaseUserID || !isLoggedIn) return;
    if (water === 0) return; // ⛔️ evită salvarea valorii implicite 0

    const saveWater = async () => {
      const today = new Date().toISOString().slice(0, 10);
      try {
        await AsyncStorage.setItem('water', water.toString());
        await AsyncStorage.setItem('water_date', today);

        await waterService.upsertWater(firebaseUserID, water, today);
      } catch (e) {
        // Silent error handling
      }
    };

    saveWater();
  }, [water, firebaseUserID, isLoggedIn]);

  // Actualizează notificările când se schimbă pașii
  useEffect(() => {
    if (isEnabled && steps > 0) {
      updateStepsNotification(steps, 10000);
    }
  }, [steps, isEnabled, updateStepsNotification]);



  // Calorie calculation (can be improved with user weight later)
  const calculateCalories = (steps: number) => {
    return Math.round(steps * 0.05); // 0.05 kcal per step
  };

  // Distance calculation (1 step ≈ 0.0008 km)
  const calculateDistance = (steps: number) => {
    return (steps * 0.0008).toFixed(2); // 2 decimals, km
  };

  const calculateActiveMinutes = (steps: number): number => {
    return parseFloat((steps / 100).toFixed(2)); // 2 zecimale
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.DarkBackground }}>
      <ScrollView showsVerticalScrollIndicator={false} className="w-full h-full">
        <GradientHeader profilePic={profilePic} />
        <View className="mt-4">
          {/* Pass steps and setSteps to Step */}
          <Step steps={steps} setSteps={setSteps} />
        </View>
        <View className="w-full items-center mb-4">
          <DashCard 
            icon={icons.fire} 
            titlu="Calorii arse" 
            valoare={calculateCalories(steps)} 
            unitate="kcal" 
            obiectiv={400}
          />
          <DashCard 
            icon={icons.time} 
            titlu="Distanța parcursă" 
            valoare={parseFloat(calculateDistance(steps))} 
            unitate="km" 
            obiectiv={5}
          />
          <DashCard 
            icon={icons.moon} 
            titlu="Timpul activ" 
            valoare={calculateActiveMinutes(steps)} 
            unitate="min" 
            obiectiv={60}
          />
          <DashCard 
            icon={icons.drop} 
            titlu="Apa consumată" 
            valoare={water} 
            unitate="L" 
            obiectiv={2.5}
            button={
              <TouchableOpacity
                style={{ marginTop: 8, borderRadius: 20, borderWidth: 1, borderColor: '#34455c', width: 150, height: 36, justifyContent: 'center', alignItems: 'center', shadowColor: '#58a6ff', shadowOpacity: 0.2, shadowRadius: 4 }}
                onPress={() => setWater(w => parseFloat((w + 0.25).toFixed(2)))}
              >
                <Text className="text-[#58a6ff] text-xl font-bold">+</Text>
              </TouchableOpacity>
            }
          />
        </View>
                  {/* Weekly steps progress demo */}
          <WeeklySteps />
          
          {/* Background Notifications Control */}
          <View className="w-full items-center mb-40 mt-4">
            <View className="bg-gray-800 rounded-lg p-4 w-[90%]">
              <Text className="text-white font-semibold text-lg mb-2 text-center">
                🔔 Notificări de Background
              </Text>
              <Text className="text-gray-300 text-sm mb-3 text-center">
                {isEnabled 
                  ? 'Notificările sunt active și vor funcționa în fundal'
                  : 'Activează notificările pentru a primi actualizări despre pași'
                }
              </Text>
              
              <View className="flex-row justify-center space-x-3">
                <TouchableOpacity
                  style={{
                    backgroundColor: isEnabled ? '#ef4444' : '#10b981',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                  }}
                  onPress={isEnabled ? disableBackgroundNotifications : enableBackgroundNotifications}
                >
                  <Text className="text-white font-semibold">
                    {isEnabled ? 'Dezactivează' : 'Activează'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
}
