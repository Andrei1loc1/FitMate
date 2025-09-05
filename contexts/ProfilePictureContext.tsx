import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { icons } from '@/constants/icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

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
  const [currentUserId, setCurrentUserId] = useState<string | null>(auth.currentUser?.uid ?? null);

  const storageKeyForUser = (uid: string) => `user_profile_picture:${uid}`;

  // Load saved profile picture on mount
  useEffect(() => {
    // Subscribe to auth changes to swap profile picture per account
    const unsub = onAuthStateChanged(auth, (user) => {
      const uid = user?.uid ?? null;
      setCurrentUserId(uid);
      if (!uid) {
        setProfilePic(icons.profile_pic);
      } else {
        loadProfilePicture(uid);
      }
    });
    // Initial load
    loadProfilePicture(currentUserId);
    return () => { unsub(); };
  }, []);

  const loadProfilePicture = async (uidOverride?: string | null) => {
    try {
      const uid = uidOverride ?? currentUserId;
      if (!uid) { setProfilePic(icons.profile_pic); return; }
      const key = storageKeyForUser(uid);
      const savedPicUri = await AsyncStorage.getItem(key);
      if (!savedPicUri) { setProfilePic(icons.profile_pic); return; }
      const info = await FileSystem.getInfoAsync(savedPicUri);
      if (info.exists) {
        setProfilePic({ uri: savedPicUri });
      } else {
        setProfilePic(icons.profile_pic);
      }
    } catch (error) {
      console.log('Error loading profile picture:', error);
    }
  };

  const saveProfilePicture = async (uri: string) => {
    try {
      if (!currentUserId) {
        // If user not logged in, just set locally for session
        setProfilePic({ uri });
        return;
      }
      const directory = FileSystem.documentDirectory || '';
      const targetPath = `${directory}profile_${currentUserId}_${Date.now()}.jpg`;
      try {
        await FileSystem.copyAsync({ from: uri, to: targetPath });
      } catch (copyErr) {
        // If copy fails (e.g., content://), try read->write as fallback
        try {
          const data = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
          await FileSystem.writeAsStringAsync(targetPath, data, { encoding: FileSystem.EncodingType.Base64 });
        } catch (fallbackErr) {
          console.log('Profile picture copy failed:', fallbackErr);
          return;
        }
      }

      // Optionally cleanup older saved pics
      try {
        const files = await FileSystem.readDirectoryAsync(directory);
        const oldPics = files.filter(f => f.startsWith(`profile_${currentUserId}_`) && !targetPath.endsWith(f));
        await Promise.all(
          oldPics.map(f => FileSystem.deleteAsync(directory + f, { idempotent: true }))
        );
      } catch {}

      const key = storageKeyForUser(currentUserId);
      await AsyncStorage.setItem(key, targetPath);
      setProfilePic({ uri: targetPath });
    } catch (error) {
      console.log('Error saving profile picture:', error);
    }
  };

  const resetProfilePicture = async () => {
    try {
      if (currentUserId) {
        await AsyncStorage.removeItem(storageKeyForUser(currentUserId));
      }
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