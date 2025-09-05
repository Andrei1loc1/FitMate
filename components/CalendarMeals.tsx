import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { cardStyles, daycardStyles, solidCard } from '@/styles/cardStyles';
import { Meal } from '@/services/appwrite';

interface CalendarMealsProps {
  meals: Meal[];
}

const CalendarMeals: React.FC<CalendarMealsProps> = ({ meals }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewedDate, setViewedDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);

  // Group meals by date (YYYY-MM-DD)
  const mealsByDate = useMemo(() => {
    const grouped: { [date: string]: Meal[] } = {};
    meals.forEach(meal => {
      const dateKey = meal.createdAt.slice(0, 10); // YYYY-MM-DD
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(meal);
    });
    return grouped;
  }, [meals]);

  // Get viewed month data
  const currentDate = new Date();
  const viewedMonth = viewedDate.getMonth();
  const viewedYear = viewedDate.getFullYear();
  const daysInMonth = new Date(viewedYear, viewedMonth + 1, 0).getDate();
  // Adjust firstDayOfMonth so that Monday is 0
  // JS getDay(): 0=Sunday, 1=Monday, ..., 6=Saturday
  // We want: 0=Monday, 6=Sunday
  const jsFirstDay = new Date(viewedYear, viewedMonth, 1).getDay();
  const firstDayOfMonth = (jsFirstDay + 6) % 7;

  const monthNames = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];

  const dayNames = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'];

  const handleDatePress = (day: number) => {
    const dateKey = `${viewedYear}-${String(viewedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (mealsByDate[dateKey] && mealsByDate[dateKey].length > 0) {
      setSelectedDate(new Date(viewedYear, viewedMonth, day));
      setShowModal(true);
    }
    // altfel nu deschide modalul
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <View key={`empty-${i}`} className="w-10 h-10 m-2" />
      );
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === currentDate.getDate() &&
        viewedMonth === currentDate.getMonth() &&
        viewedYear === currentDate.getFullYear();
      const dateKey = `${viewedYear}-${String(viewedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasMeals = mealsByDate[dateKey] && mealsByDate[dateKey].length > 0;
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            daycardStyles.card,
            {
              backgroundColor: isToday ? '#2C9474' : 'rgba(255,255,255,0.10)',
              opacity: hasMeals ? 1 : 0.5,
            }
          ]}
          className="w-10 h-10 m-2 items-center justify-center"
          onPress={() => handleDatePress(day)}
        >
          <Text className="text-white font-semibold">{day}</Text>
        </TouchableOpacity>
      );
    }
    // Group days into weeks (rows of 7)
    const rows = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(
        <View key={`row-${i / 7}`} className="flex-row justify-start ml-2">
          {days.slice(i, i + 7)}
        </View>
      );
    }
    return rows;
  };

  // Get meals for selected date
  const selectedMeals = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    return mealsByDate[dateKey] || [];
  }, [selectedDate, mealsByDate]);

  return (
    <View className="p-4 mt-10">
      {/* Header */}
      <View style={solidCard.card} className="mb-6 p-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => setViewedDate(new Date(viewedYear, viewedMonth - 1, 1))}>
          <Text className="text-white text-2xl font-bold">{"<"}</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold text-center">
          {monthNames[viewedMonth]} {viewedYear}
        </Text>
        <TouchableOpacity onPress={() => setViewedDate(new Date(viewedYear, viewedMonth + 1, 1))}>
          <Text className="text-white text-2xl font-bold">{">"}</Text>
        </TouchableOpacity>
      </View>
      {/* Day names */}
      <View className="flex-row justify-around mb-4">
        {dayNames.map((dayName, index) => (
          <View key={index} className="w-10 h-10 items-center justify-center">
            <Text className="text-white font-semibold text-sm">
              {dayName}
            </Text>
          </View>
        ))}
      </View>
      {/* Calendar grid */}
      <View>
        {renderCalendarDays()}
      </View>
      {/* Modal for selected date */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
          <View className="w-80 p-6 bg-gray-900 rounded-2xl">
            <Text className="text-white text-xl font-bold text-center mb-4">
              {selectedDate?.toLocaleDateString('ro-RO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            <View className="space-y-4 w-full items-center">
              {selectedMeals.length > 0 ? (
                selectedMeals.map((meal, idx) => (
                  <View key={meal.$id || idx} className="bg-gray-800 p-3 rounded-lg w-[70%] mb-2">
                    <Text className="text-white font-semibold mb-2">{meal.mealType}</Text>
                    <Text className="text-gray-300">{meal.mealName}</Text>
                    <Text className="text-green-400 text-sm">{meal.calories} kcal</Text>
                  </View>
                ))
              ) : (
                <Text className="text-gray-400 text-center">Nicio masă înregistrată pentru această zi.</Text>
              )}
            </View>
            <TouchableOpacity
              style={cardStyles.card}
              className="mt-6 p-3"
              onPress={closeModal}
            >
              <Text className="text-white font-semibold text-center">Închide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CalendarMeals;