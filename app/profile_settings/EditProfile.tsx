import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import React, { useState } from 'react';
import { SettingsStyles, inputStyles, solidCard, buttonStyles } from '@/styles/cardStyles';
import { auth } from '@/firebaseConfig';
import { updateProfile } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { icons } from '@/constants/icons';
import * as ImagePicker from 'expo-image-picker';
import { useProfilePicture } from '@/hooks/useProfilePicture';

const EditProfile = () => {
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || '');
  const [newName, setNewName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const { profilePic, saveProfilePicture, resetProfilePicture } = useProfilePicture();

  const handleChangeProfilePic = async () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose how you want to update your profile picture',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              const newPicUri = result.assets[0].uri;
              await saveProfilePicture(newPicUri);
              Alert.alert('Success', 'Profile picture updated successfully!');
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              const newPicUri = result.assets[0].uri;
              await saveProfilePicture(newPicUri);
              Alert.alert('Success', 'Profile picture updated successfully!');
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Update name if changed
      if (newName.trim().length > 0 && newName !== name) {
        await updateProfile(user, { displayName: newName });
        setName(newName);
      }
      // Update email if changed
      if (newEmail.trim().length > 0 && newEmail !== email) {
        // updateEmail is async and may require recent login
        await import('firebase/auth').then(({ updateEmail }) => updateEmail(user, newEmail));
        setEmail(newEmail);
      }
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  };

  function GradientHeaderWorkout() {
    return (
      <View style={{ position: 'relative', width: '100%', height: 140 }}>
        <LinearGradient
          colors={['#0f2027', '#203a43', '#2c5364']}
          locations={[0, 0.7, 1]}
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
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60 }}>
          <Text className="text-white font-bold text-3xl mb-6">Edit Profile</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#101827]">
      <ScrollView className="flex-1">
        <GradientHeaderWorkout />
        <View style={{ alignSelf: 'center', top: 110, marginBottom: 4, position: 'absolute', width: 96, height: 96 }}>
          <Image
            source={profilePic}
            style={{
              width: 96,
              height: 96,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: '#101827',
              backgroundColor: '#23232a',
            }}
          />
          <TouchableOpacity
            onPress={handleChangeProfilePic}
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              backgroundColor: '#23232a',
              borderRadius: 9999,
              padding: 0,
              borderWidth: 0,
              borderColor: '#fff',
              elevation: 5,
            }}
          >
            <Image
              source={require('@/assets/icons/pencil.png')}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center py-5 mt-20">
          <View style={solidCard.card} className="w-[90%] items-center py-8 px-4">
            <Text className="text-white font-semibold text-xl mb-8">Profile Information</Text>
            <Text className="text-white font-semibold text-lg mb-4 self-start ml-2">Edit your name</Text>
            <TextInput
              style={inputStyles.input}
              placeholder="Current name"
              placeholderTextColor="#b1c7c4"
              value={name}
              editable={false}
              className="text-white w-full h-12 py-2 mb-4"
            />
            <TextInput
              style={inputStyles.input}
              placeholder="New name..."
              placeholderTextColor="#b1c7c4"
              value={newName}
              onChangeText={setNewName}
              className="text-white w-full h-12 py-2 mb-4"
            />
            <Text className="text-white font-semibold text-lg mb-4 self-start ml-2">Edit your email</Text>
            <TextInput
              style={inputStyles.input}
              placeholder="Current email"
              placeholderTextColor="#b1c7c4"
              value={email}
              editable={false}
              className="text-white w-full h-12 py-2 mb-4"
            />
            <TextInput
              style={inputStyles.input}
              placeholder="New email..."
              placeholderTextColor="#b1c7c4"
              value={newEmail}
              onChangeText={setNewEmail}
              className="text-white w-full h-12 py-2 mb-4"
            />
          </View>
          <View className="w-full items-center mt-6 space-y-3">
            <TouchableOpacity
              className="w-[60%] h-12 mb-4"
              style={buttonStyles.button}
              onPress={handleSave}
              disabled={loading}
            >
              <Text className="text-white font-bold text-base">{loading ? 'Saving...' : 'Save Changes'}</Text>
            </TouchableOpacity>
                         <TouchableOpacity
               className="w-[60%] h-12"
               style={buttonStyles.button}
               onPress={() => router.back()}
             >
               <Text className="text-white font-bold text-base">Cancel</Text>
             </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile; 