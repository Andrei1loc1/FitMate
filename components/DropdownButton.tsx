import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { icons } from '@/constants/icons';
import { button2Styles, buttonStyles, cardStyles, solidCard } from '@/styles/cardStyles';

interface DropdownButtonProps {
  onAddWithCamera: () => void;
  onAddManual: () => void;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ onAddWithCamera, onAddManual }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleAddWithCamera = () => {
    setIsDropdownVisible(false);
    onAddWithCamera();
  };

  const handleAddManual = () => {
    setIsDropdownVisible(false);
    onAddManual();
  };

  return (
    <View className="relative z-50 justify-center items-center">
      <TouchableOpacity
        style={buttonStyles.button}
        className="flex-row w-[80%] h-[50px] justify-center items-center px-4 py-3"
        onPress={toggleDropdown}
      >
        <Text className="text-[#58a6ff] text-base font-semibold">+  Add Meal</Text>
      </TouchableOpacity>

      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
          <View style={solidCard.card} className="w-80 p-6">
            <Text className="text-white text-xl font-bold text-center mb-4">
              Adaugă o masă
            </Text>
            
            <View className="space-y-4 w-full">
              <TouchableOpacity
                style={button2Styles.button}
                className="p-3 mb-2 w-[70%] self-center"
                onPress={handleAddWithCamera}
              >
                <Text className="text-white font-semibold text-center">Camera</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={button2Styles.button}
                className="p-3 w-[70%] self-center"
                onPress={handleAddManual}
              >
                <Text className="text-white font-semibold text-center">Manual</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={cardStyles.card}
              className="mt-6 p-3"
              onPress={() => setIsDropdownVisible(false)}
            >
              <Text className="text-white font-semibold text-center">Închide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DropdownButton; 