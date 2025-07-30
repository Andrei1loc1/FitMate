import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons } from '@/constants/icons';

interface ProfilePictureContextType {
  profilePic: any;
  saveProfilePicture: (uri: string) => Promise<void>;
  resetProfilePicture: () => Promise<void>;
  loadProfilePicture: () => Promise<void>;
}

const ProfilePictureContext = createContext<ProfilePictureContextType | undefined>(undefined);

export const useProfilePictureContext = () => {
  const context = useContext(ProfilePictureContext);
  if (!context) {
    throw new Error('useProfilePictureContext must be used within a ProfilePictureProvider');
  }
  return context;
};

interface ProfilePictureProviderProps {
  children: ReactNode;
}

export const ProfilePictureProvider: React.FC<ProfilePictureProviderProps> = ({ children }) => {
  const [profilePic, setProfilePic] = useState<any>(icons.profile_pic);

  // Load saved profile picture on mount
  useEffect(() => {
    loadProfilePicture();
  }, []);

  const loadProfilePicture = async () => {
    try {
      const savedPicUri = await AsyncStorage.getItem('user_profile_picture');
      if (savedPicUri) {
        setProfilePic({ uri: savedPicUri });
      }
    } catch (error) {
      console.log('Error loading profile picture:', error);
    }
  };

  const saveProfilePicture = async (uri: string) => {
    try {
      await AsyncStorage.setItem('user_profile_picture', uri);
      setProfilePic({ uri });
    } catch (error) {
      console.log('Error saving profile picture:', error);
    }
  };

  const resetProfilePicture = async () => {
    try {
      await AsyncStorage.removeItem('user_profile_picture');
      setProfilePic(icons.profile_pic);
    } catch (error) {
      console.log('Error resetting profile picture:', error);
    }
  };

  const value = {
    profilePic,
    saveProfilePicture,
    resetProfilePicture,
    loadProfilePicture
  };

  return (
    <ProfilePictureContext.Provider value={value}>
      {children}
    </ProfilePictureContext.Provider>
  );
}; 