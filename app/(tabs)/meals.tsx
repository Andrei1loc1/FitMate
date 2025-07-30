import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import CalendarMeals from '@/components/CalendarMeals'
import DropdownButton from '@/components/DropdownButton'
import { router } from 'expo-router'
import { mealService, Meal } from '@/services/appwrite'
import { auth } from '@/firebaseConfig'
import { useFocusEffect } from '@react-navigation/native';
import { getMealPlanLlama } from '@/services/api_llama';
import { LinearGradient } from 'expo-linear-gradient';
import Camera from '@/components/Camera';
import type { CalorieResult } from '@/components/Camera';
import { button2Styles, buttonStyles, solidCard } from '@/styles/cardStyles';
import { CalendarDots } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MEAL_PLAN_KEY = 'daily_meal_plan';
const MEAL_PLAN_DATE_KEY = 'daily_meal_plan_date';

function GradientHeaderMeals() {
  return (
    <View style={{ position: 'relative', width: '100%', height: 140 }}>
      <LinearGradient
        colors={['#0f2027', '#203a43', '#2c5364']}
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
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Meals</Text>
          <Text style={{ color: 'white', fontSize: 14, opacity: 0.8 }}>Plan your meals for the day</Text>
        </View>
      </View>
    </View>
  );
}

const meals = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);
  const [mealPlan, setMealPlan] = useState<{ [type: string]: string }>({});
  const [loadingPlan, setLoadingPlan] = useState(false);


  useFocusEffect(
    React.useCallback(() => {
      loadMeals();
    }, [])
  );

  const loadMeals = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setMeals([]);
        setLoading(false);
        return;
      }
      const userMeals = await mealService.getUserMeals(currentUser.uid);
      setMeals(userMeals);
    } catch (error) {
      console.error('Error loading meals:', error);
      // Alert.alert('Error', 'Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWithCamera = () => {
    router.push({ pathname: '/(meals)/add-meal', params: { camera: '1' } });
  };

  const handleAddManual = () => {
    router.push("/(meals)/add-meal");
  };

  const regenerateMealPlan = async () => {
    setLoadingPlan(true);
    try {
      const plan = await getMealPlanLlama(mealTypes);
      setMealPlan(plan);
      const today = new Date().toISOString().slice(0, 10);
      await AsyncStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(plan));
      await AsyncStorage.setItem(MEAL_PLAN_DATE_KEY, today);
    } catch (e) {
      setMealPlan(Object.fromEntries(mealTypes.map(type => [type, '-'])));
    } finally {
      setLoadingPlan(false);
    }
  };

  // Filtrare mese pentru ziua curentă
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todayMeals = meals.filter(meal => meal.createdAt.slice(0, 10) === todayKey);

  // Grupare mese pe tipuri
  // Mapping between English and Romanian meal types
  const mealTypeMap = [
    { en: 'Breakfast', ro: 'Mic dejun' },
    { en: 'Snack 1', ro: 'Gustare 1' },
    { en: 'Lunch', ro: 'Prânz' },
    { en: 'Snack 2', ro: 'Gustare 2' },
    { en: 'Dinner', ro: 'Cină' },
    { en: 'Snack 3', ro: 'Gustare 3' },
  ];
  const mealTypes = mealTypeMap.map(m => m.en);
  const mealsByType = mealTypes.map(type => ({
    type,
    meal: todayMeals.find(m => m.mealType === type)
  }));

  // Generează planul alimentar la încărcarea paginii sau la refresh
  useEffect(() => {
    const fetchPlan = async () => {
      setLoadingPlan(true);
      try {
        const today = new Date().toISOString().slice(0, 10);
        const savedDate = await AsyncStorage.getItem(MEAL_PLAN_DATE_KEY);
        const savedPlan = await AsyncStorage.getItem(MEAL_PLAN_KEY);
        if (savedDate === today && savedPlan) {
          setMealPlan(JSON.parse(savedPlan));
          // Loaded from storage
        } else {
          const plan = await getMealPlanLlama(mealTypes);
          // Meal plan loaded from API
          setMealPlan(plan);
          await AsyncStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(plan));
          await AsyncStorage.setItem(MEAL_PLAN_DATE_KEY, today);
        }
      } catch (e) {
        setMealPlan(Object.fromEntries(mealTypes.map(type => [type, '-'])));
      } finally {
        setLoadingPlan(false);
      }
    };
    fetchPlan();
  }, []);

  return (
    <View className='flex-1 bg-[#101827]'>
      <GradientHeaderMeals />
      <CalendarMeals meals={meals} />
      <View className="mt-4 mb-4">
        <DropdownButton 
          onAddWithCamera={handleAddWithCamera}
          onAddManual={handleAddManual}
        />
      </View>
      {/* Meal plan of the day card */}
      <TouchableOpacity
        style={button2Styles.button}
        className="flex-row w-[80%] h-[50px] justify-center items-center px-4 py-3 self-center"
        onPress={() => setShowMealPlanModal(true)}
      >
        <CalendarDots size={24} color="white" />
        <Text className="text-white text-base font-semibold"> Meal plan of the day</Text>
      </TouchableOpacity>
      {/* Modal pentru meal plan */}
      <Modal
        visible={showMealPlanModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMealPlanModal(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
          <View className="bg-gray-900 rounded-2xl p-6 w-full">
            <Text className="text-white text-xl font-bold text-center mb-4">Meal plan of the day</Text>
            <View className="space-y-3 w-full items-center">
              {mealTypeMap.map(({ en, ro }) => (
                <View key={en} className="bg-gray-800 p-3 rounded-lg w-full mb-1">
                  <Text className="text-[#2C9474] font-semibold mb-1">{ro}</Text>
                  <Text className="text-white mb-1">{mealPlan[en] || '-'}</Text>
                  {meals.find(m => m.mealType === en) ? (
                    <Text className="text-gray-300 text-xs">Adăugat: {meals.find(m => m.mealType === en)?.mealName}</Text>
                  ) : null}
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={buttonStyles.button}
              className="mt-3 p-2 rounded-lg"
              onPress={regenerateMealPlan}
              disabled={loadingPlan}
            >
              <Text className="text-white font-semibold text-center">
                {loadingPlan ? 'Regenerare...' : 'Regenerare ⟳'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-3 p-3 bg-[#2C9474] rounded-lg"
              onPress={() => setShowMealPlanModal(false)}
            >
              <Text className="text-white font-semibold text-center">Închide</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>
      {loading && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white">Loading meals...</Text>
        </View>
      )}
    </View>
  )
}

export default meals 