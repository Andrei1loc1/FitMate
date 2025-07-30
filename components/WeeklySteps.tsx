import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { solidCard } from '@/styles/cardStyles';
import { stepsService } from '@/services/appwrite';
import { auth } from '@/firebaseConfig';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const GOAL = 10000;
const MAX_BAR_HEIGHT = 100; // px

const WeeklySteps = () => {
  const [weeklySteps, setWeeklySteps] = useState<{ date: string; steps: number; }[]>([]);
  const [firebaseUserID, setFirebaseUserID] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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
    const fetchWeeklySteps = async () => {
      if (firebaseUserID && isLoggedIn) {
        try {
          const stepsData = await stepsService.getWeeklySteps(firebaseUserID);
          setWeeklySteps(stepsData);
        } catch (error) {
          // Failed to fetch weekly steps
        }
      }
    };

    fetchWeeklySteps();
  }, [firebaseUserID, isLoggedIn]);

  // Ensure we have 7 days of data, filling with 0 if necessary
  const filledWeeklySteps = DAYS.map((day, index) => {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7; // Adjust to start from Monday
    const date = new Date(today);
    date.setDate(today.getDate() - (dayOfWeek - index + 7) % 7); // Calculate date for each day
    const dateString = date.toISOString().slice(0, 10);

    const stepData = weeklySteps.find(step => step.date === dateString);
    return stepData ? stepData.steps : 0;
  });

  return (
    <View style={solidCard.card} className="w-full max-w-[360px] mt-2 mb-5 mx-4">
      <Text className="text-white text-lg font-bold mb-2">Weekly Steps Progress</Text>
      {/* Header cu zilele */}
      <View className="flex-row justify-between mb-2">
        {DAYS.map(day => (
          <Text key={day} className="text-gray-300 text-xs text-center flex-1">
            {day}
          </Text>
        ))}
      </View>
      {/* Barele verticale */}
      <View className="flex-row items-end justify-between" style={{ minHeight: MAX_BAR_HEIGHT + 30 }}>
        {filledWeeklySteps.map((steps, idx) => {
          const percent = Math.min((steps / GOAL), 1);
          let barColor = '#ef4444'; // red
          if (percent >= 1) barColor = '#10b981'; // green
          else if (percent >= 0.75) barColor = '#3b82f6'; // blue
          else if (percent >= 0.5) barColor = '#f59e0b'; // yellow
          return (
            <View key={DAYS[idx]} className="flex-1 items-center">
              <View
                style={{
                  height: percent * MAX_BAR_HEIGHT,
                  width: 16,
                  backgroundColor: barColor,
                  borderRadius: 8,
                  marginBottom: 4,
                }}
                className="bg-gray-700"
              />
              <Text className="text-gray-400 text-xs text-center" style={{ minWidth: 30 }}>
                {steps}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default WeeklySteps;
