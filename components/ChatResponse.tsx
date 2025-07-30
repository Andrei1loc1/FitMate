import { View, Text, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getGeminiResponse } from '@/services/api_gemini';
import { SugestioncardStyles } from '@/styles/cardStyles';

const MAX_HEIGHT = 300;

const ChatResponse = ({ prompt }: any) => {
  const [response, setResponse] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [contentHeight, setContentHeight] = useState(0);

  // Fetch AI response
  useEffect(() => {
    setResponse('');
    setDisplayText('');
    getGeminiResponse(prompt)
      .then(setResponse)
      .catch(err => {
        console.error('Eroare API:', err);
        setResponse('A apărut o eroare.');
      });
  }, [prompt]);

  // Typewriter effect
  useEffect(() => {
    if (!response) return;
    let i = 0;
    setDisplayText('');
    const interval = setInterval(() => {
      i++;
      setDisplayText(response.slice(0, i));
      if (i >= response.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [response]);

  const content = (
    <Text
      className="text-white"
      onLayout={e => setContentHeight(e.nativeEvent.layout.height)}
    >
      {displayText || 'Loading...'}
    </Text>
  );

  // Dacă textul depășește MAX_HEIGHT, folosește ScrollView
  if (contentHeight > MAX_HEIGHT) {
    return (
      <ScrollView
        style={[SugestioncardStyles.card, { maxHeight: MAX_HEIGHT }]}
        className="mt-8 w-full"
      >
        {content}
      </ScrollView>
    );
  }

  // Altfel, doar un View normal, fără animare pe height
  return (
    <View style={SugestioncardStyles.card} className="mt-8 w-full">
      {content}
    </View>
  );
};

export default ChatResponse;