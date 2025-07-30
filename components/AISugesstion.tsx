import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { solidCard } from '@/styles/cardStyles'
import { getMotivationalQuoteLlama } from '@/services/api_llama'
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUOTE_KEY = 'daily_quote';
const QUOTE_DATE_KEY = 'daily_quote_date';

const AISugesstion = () => {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchQuote = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().slice(0, 10);
        const savedDate = await AsyncStorage.getItem(QUOTE_DATE_KEY);
        const savedQuote = await AsyncStorage.getItem(QUOTE_KEY);
        if (savedDate === today && savedQuote) {
          if (mounted) {
            setQuote(savedQuote);
            setLoading(false);
          }
        } else {
          const newQuote = await getMotivationalQuoteLlama();
          await AsyncStorage.setItem(QUOTE_KEY, newQuote);
          await AsyncStorage.setItem(QUOTE_DATE_KEY, today);
          if (mounted) {
            setQuote(newQuote);
            setLoading(false);
          }
        }
      } catch (e) {
        if (mounted) {
          setError('AI unavailable');
          setLoading(false);
          console.log('AI ERROR:', e);
        }
      }
    };
    fetchQuote();
    return () => { mounted = false; };
  }, []);

  return (
    <View style={solidCard.card} className='w-[90%] rounded-2xl justify-start min-h-30 p-4'>
      <Text className='text-white text-xl font-bold w-full mb-1'>Quote of the Day</Text>
      {loading ? (
        <ActivityIndicator color="#3DF264" size="large" />
      ) : error ? (
        <Text className='text-red-400 text-base mt-3'>{error}</Text>
      ) : (
        <Text className='text-white text-lg italic mt-3 text-center'>{quote}</Text>
      )}
    </View>
  )
}

export default AISugesstion