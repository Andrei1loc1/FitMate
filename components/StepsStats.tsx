import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { stepsService } from '@/services/appwrite';
import { cardStyles } from '@/styles/cardStyles';
import { auth } from '@/firebaseConfig';

interface StepsStatsProps {
  userID?: string;
}

const StepsStats: React.FC<StepsStatsProps> = ({ userID: propUserID }) => {
  const [firebaseUserID, setFirebaseUserID] = useState<string | null>(propUserID || null);
  const [todaySteps, setTodaySteps] = useState<number>(0);
  const [weeklySteps, setWeeklySteps] = useState<number>(0);
  const [monthlySteps, setMonthlySteps] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Verifică dacă utilizatorul este autentificat în Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (propUserID) {
        setFirebaseUserID(propUserID);
        setIsLoggedIn(true);
      } else if (user) {
        setFirebaseUserID(user.uid);
        setIsLoggedIn(true);
      } else {
        setFirebaseUserID(null);
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, [propUserID]);

  // Încarcă statisticile (doar dacă utilizatorul este autentificat în Firebase)
  useEffect(() => {
    const loadStats = async () => {
      if (!firebaseUserID || !isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Obține pașii pentru ziua curentă
        const today = new Date().toISOString().slice(0, 10);
        const todayStepsData = await stepsService.getStepsByDate(firebaseUserID, today);
        setTodaySteps(todayStepsData?.steps || 0);

        // Obține pașii pentru săptămâna curentă
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + (6 - now.getDay()));

        const startDate = startOfWeek.toISOString().slice(0, 10);
        const endDate = endOfWeek.toISOString().slice(0, 10);

        const weeklyStepsData = await stepsService.getStepsByDateRange(firebaseUserID, startDate, endDate);
        const weeklyTotal = weeklyStepsData.reduce((sum, step) => sum + step.steps, 0);
        setWeeklySteps(weeklyTotal);

        // Obține pașii pentru luna curentă
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const startMonthDate = startOfMonth.toISOString().slice(0, 10);
        const endMonthDate = endOfMonth.toISOString().slice(0, 10);

        const monthlyStepsData = await stepsService.getStepsByDateRange(firebaseUserID, startMonthDate, endMonthDate);
        const monthlyTotal = monthlyStepsData.reduce((sum, step) => sum + step.steps, 0);
        setMonthlySteps(monthlyTotal);

      } catch (error) {
        // Error loading steps stats
      } finally {
        setLoading(false);
      }
    };

    if (firebaseUserID && isLoggedIn) {
      loadStats();
    } else {
      setLoading(false);
    }
  }, [firebaseUserID, isLoggedIn]);

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const getGoalPercentage = (steps: number, goal: number = 10000): number => {
    return Math.min((steps / goal) * 100, 100);
  };

  if (loading) {
    return (
      <View style={cardStyles.card} className="p-4 my-4">
        <Text className="text-textPrimary text-center">Se încarcă statisticile...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={cardStyles.card} className="p-4 my-4">
        <Text className="text-textPrimary text-center mb-2">Statistici de pași</Text>
        <Text className="text-gray-400 text-center text-sm">
          Autentifică-te în Firebase pentru a vedea statisticile
        </Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
      <View className="flex-row gap-4">
        {/* Pași astăzi */}
        <View style={cardStyles.card} className="p-4 min-w-[150px]">
          <Text className="text-textPrimary font-semibold text-lg">Astăzi</Text>
          <Text className="text-textPrimary font-bold text-2xl mt-2">
            {formatNumber(todaySteps)}
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            {getGoalPercentage(todaySteps).toFixed(1)}% din obiectiv
          </Text>
          <View className="bg-gray-200 rounded-full h-2 mt-2">
            <View 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${getGoalPercentage(todaySteps)}%` }}
            />
          </View>
        </View>

        {/* Pași săptămâna aceasta */}
        <View style={cardStyles.card} className="p-4 min-w-[150px]">
          <Text className="text-textPrimary font-semibold text-lg">Săptămâna</Text>
          <Text className="text-textPrimary font-bold text-2xl mt-2">
            {formatNumber(weeklySteps)}
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            {formatNumber(Math.round(weeklySteps / 7))} / zi în medie
          </Text>
        </View>

        {/* Pași luna aceasta */}
        <View style={cardStyles.card} className="p-4 min-w-[150px]">
          <Text className="text-textPrimary font-semibold text-lg">Luna</Text>
          <Text className="text-textPrimary font-bold text-2xl mt-2">
            {formatNumber(monthlySteps)}
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            {formatNumber(Math.round(monthlySteps / new Date().getDate()))} / zi în medie
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default StepsStats;
