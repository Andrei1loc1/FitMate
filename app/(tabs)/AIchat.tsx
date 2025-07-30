import { View, Text, TextInput, Pressable } from 'react-native'
import ChatResponse from '@/components/ChatResponse';
import { useState } from 'react';
import { button2Styles, chatCardStyles } from '@/styles/cardStyles';
import { LinearGradient } from 'expo-linear-gradient';
import AISugesstion from '@/components/AISugesstion';

function GradientHeaderAIChat() {
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
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>AI Chat</Text>
          <Text style={{ color: 'white', fontSize: 14, opacity: 0.8 }}>Ask everything about fitness!</Text>
        </View>
      </View>
    </View>
  );
}

const AIchat = () => {
  const [inputText, setInputText] = useState("");
  const [prompt, setPrompt] = useState("");

  return (
    <View className='flex-1 justify-start items-center bg-gray-900'>
      <GradientHeaderAIChat />
      <View className="flex-row justify-center w-full mt-10">
          <AISugesstion />
      </View>
      <View className="w-[90%] items-center mt-10">
        <View style={chatCardStyles.card} className="text-textPrimary rounded-xl w-full h-14 px-4">
          <TextInput
            className="text-white w-full px-4"
            placeholder='Ask a question...'
            placeholderTextColor='#b1c7c4'
            value={inputText}
            onChangeText={(text: string) => setInputText(text)}
          />
        </View>
        <Pressable
          style={button2Styles.button}
          className="w-40 mt-4 p-2"
          onPress={() => {
            inputText ? setPrompt(inputText) : alert("Please enter a question!");
            setInputText("");
          }}>
          <Text className="text-white text-center font-bold">Send</Text>
        </Pressable>
        {prompt ? <ChatResponse prompt={prompt} /> : null}
      </View>
    </View>
  )
}

export default AIchat