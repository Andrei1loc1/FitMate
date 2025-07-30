import React, { useRef, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Canvas, Circle, Path } from '@shopify/react-native-skia';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Accelerometer } from 'expo-sensors';
import { solidCard } from '@/styles/cardStyles';
import { stepsService } from '@/services/appwrite';
import { auth } from '@/firebaseConfig';
import { BlurView } from 'expo-blur';

const THRESHOLD = 2.0; // prag de detecție a unui "pas"
const COOLDOWN = 300; // ms între pași

const radius = 50; // half the previous size
const strokeWidth = 10;
const center = radius + strokeWidth;
const size = center * 2;
const MAX_STEPS = 10000;

interface StepProps {
  steps: number;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
}

const Step: React.FC<StepProps> = ({ steps, setSteps }) => {
  const [lastSyncedSteps, setLastSyncedSteps] = useState(0);
  const [firebaseUserID, setFirebaseUserID] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const lastStepTime = useRef(Date.now());
  
  // Reanimated values for animation
  const progress = useSharedValue(0);

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

  // Sincronizează pașii în Appwrite (doar dacă utilizatorul este autentificat în Firebase)
  const syncStepsToAppwrite = async (stepsToSync: number) => {
    if (!firebaseUserID || !isLoggedIn) {
      return;
    }
    
    try {
      const today = new Date().toISOString().slice(0, 10);
      await stepsService.upsertSteps(firebaseUserID, stepsToSync, today);
    } catch (error) {
      // Error syncing steps to Appwrite
    }
  };

  // Încarcă pașii existenți pentru ziua curentă (doar dacă utilizatorul este autentificat în Firebase)
  useEffect(() => {
    const loadTodaySteps = async () => {
      if (!firebaseUserID || !isLoggedIn) return;
      
      try {
        const todaySteps = await stepsService.getTodaySteps(firebaseUserID);
        if (todaySteps) {
          setSteps(todaySteps.steps);
          setLastSyncedSteps(todaySteps.steps);
        }
      } catch (error) {
        // Error loading today steps
      }
    };

    if (firebaseUserID && isLoggedIn) {
      loadTodaySteps();
    }
  }, [firebaseUserID, isLoggedIn]);

  // Sincronizare la fiecare 10 secunde dacă s-a modificat valoarea
  useEffect(() => {
    const interval = setInterval(() => {
      if (steps !== lastSyncedSteps) {
        syncStepsToAppwrite(steps);
        setLastSyncedSteps(steps);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [steps, lastSyncedSteps, firebaseUserID, isLoggedIn]);

  // Calculate angle based on progress
  const getAngle = (currentSteps: number) => {
    return (currentSteps / MAX_STEPS) * 360;
  };

  // Calculate path based on angle
  const getPath = (angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    const endX = center + radius * Math.cos(rad);
    const endY = center + radius * Math.sin(rad);
    const largeArcFlag = angle > 180 ? 1 : 0;

    if (angle <= 0) return '';
    
    return `M ${center} ${center - radius} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  // Calculate percentage for daily goal
  const getDailyGoalPercentage = () => {
    return Math.min((steps / MAX_STEPS) * 100, 100);
  };

  // Get color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return '#10B981'; // Green
    if (percentage >= 75) return '#3B82F6'; // Blue
    if (percentage >= 50) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  useEffect(() => {
    // Animate progress when steps change
    progress.value = withTiming(steps, { duration: 500 });
  }, [steps]);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100); // update la 100ms

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const totalAcceleration = Math.sqrt(x * x + y * y + z * z);

      if (
        totalAcceleration > THRESHOLD &&
        Date.now() - lastStepTime.current > COOLDOWN
      ) {
        setSteps((prev) => prev + 1);
        lastStepTime.current = Date.now();
      }
    });

    return () => subscription && subscription.remove();
  }, []);

  const currentAngle = getAngle(steps);
  const currentPath = getPath(currentAngle);
  const dailyGoalPercentage = getDailyGoalPercentage();
  const progressColor = getProgressColor(dailyGoalPercentage);

  return (
    <View style={solidCard.card} className="flex-row items-center p-4 justify-between w-[90%] h-48 self-center my-10 "> 
      <View style={{ marginRight: 18, position: 'relative' }}>
        <Canvas style={{ width: size, height: size }}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            color="#374151"
            style="stroke"
            strokeWidth={strokeWidth}
          />

          {/* Progress arc */}
          {currentPath && (
            <Path
              path={currentPath}
              color={progressColor}
              style="stroke"
              strokeWidth={strokeWidth}
              strokeCap="round"
            />
          )}

        </Canvas>
        {/* Percentage text in center */}
        <View style={{
          position: 'absolute',
          top: center - 10,
          left: center - 20,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text 
            style={{ 
              color: progressColor, 
              fontSize: 12, 
              fontWeight: 'bold' 
            }}
          >
            {dailyGoalPercentage.toFixed(1)}%
          </Text>
        </View>
      </View>
      <View style={{ justifyContent: 'center', flex: 1 }}>
        <Text className="text-2xl text-white font-semibold">Steps</Text>
        <Text className="text-xl font-bold text-white mt-1">{steps} / {MAX_STEPS}</Text>
        <Text className="text-sm text-gray-400 mt-1">
          Obiectiv zilnic: {MAX_STEPS.toLocaleString()} pași
        </Text>
        {!isLoggedIn && (
          <Text className="text-sm text-gray-400 mt-1">
            Local tracking only
          </Text>
        )}
      </View>
    </View>
  );
};

export default Step;
